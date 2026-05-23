import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ScoreSport, ScoreRuleSet } from '../models';

@Injectable({ providedIn: 'root' })
export class ScoringService {
  constructor(private readonly api: ApiService) {}

  getSports(): Observable<ScoreSport[]> {
    return this.api.get<ScoreSport[]>('/scoring/sports');
  }

  getRuleSets(sportCode?: string): Observable<ScoreRuleSet[]> {
    const params = sportCode ? `?sportCode=${encodeURIComponent(sportCode)}` : '';
    return this.api.get<ScoreRuleSet[]>(`/scoring/rule-sets${params}`);
  }
}
