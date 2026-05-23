import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {
    // Hydrate user on refresh if token exists
    if (this.auth.isLoggedIn && !this.auth.currentUser) {
      this.auth.loadCurrentUser().subscribe();
    }
  }
}
