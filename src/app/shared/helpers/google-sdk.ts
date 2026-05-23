/* ── Google Identity Services SDK Loader ── */

export interface GoogleCredentialResponse {
  credential?: string;
}

export interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }): void;

  renderButton(
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      type?: 'standard' | 'icon';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      width?: number;
    }
  ): void;

  prompt(momentListener?: (moment: { isNotDisplayed: () => boolean }) => void): void;
}

interface GoogleWindow extends Window {
  google?: {
    accounts?: {
      id?: GoogleAccountsId;
    };
  };
}

const SCRIPT_ID = 'google-identity-services-sdk';
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
let loadPromise: Promise<GoogleAccountsId> | null = null;

function getGoogleAccountsId(): GoogleAccountsId | undefined {
  return (window as GoogleWindow).google?.accounts?.id;
}

function waitForGoogleApi(timeoutMs = 15000): Promise<GoogleAccountsId> {
  const existing = getGoogleAccountsId();
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const poll = () => {
      const g = getGoogleAccountsId();
      if (g) { resolve(g); return; }
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Google Identity Services API did not initialize in time.'));
        return;
      }
      setTimeout(poll, 50);
    };

    poll();
  });
}

export function loadGoogleSdk(timeoutMs = 15000): Promise<GoogleAccountsId> {
  const existing = getGoogleAccountsId();
  if (existing) return Promise.resolve(existing);

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    const timeoutId = setTimeout(() => {
      loadPromise = null;
      reject(new Error('Google sign-in script timed out.'));
    }, timeoutMs);

    const onLoad = (): void => {
      clearTimeout(timeoutId);
      const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (script) script.setAttribute('data-loaded', 'true');

      waitForGoogleApi(timeoutMs)
        .then((g) => resolve(g))
        .catch((e) => {
          loadPromise = null;
          reject(e);
        });
    };

    const onError = (): void => {
      clearTimeout(timeoutId);
      loadPromise = null;
      reject(new Error('Google sign-in script was blocked or failed to load.'));
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', onError, { once: true });
      document.head.appendChild(script);
      return;
    }

    if (existingScript.getAttribute('data-loaded') === 'true') {
      onLoad();
      return;
    }

    existingScript.addEventListener('load', onLoad, { once: true });
    existingScript.addEventListener('error', onError, { once: true });
  });

  return loadPromise;
}
