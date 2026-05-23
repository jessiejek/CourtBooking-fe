import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ScoringSetting } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private readonly api: ApiService) {}

  getScoringSetting(): Observable<ScoringSetting> {
    return this.api.get<ScoringSetting>('/settings/scoring');
  }

  updateScoringSetting(value: boolean): Observable<ScoringSetting> {
    return this.api.put<ScoringSetting>('/settings/scoring', { value });
  }
}
