import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { ScoringSettingDto } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private readonly api: ApiService) {}

  getScoringSetting(): Observable<boolean> {
    return this.api
      .get<ScoringSettingDto>('/settings/scoring')
      .pipe(map((s) => s.value === 'true'));
  }
}
