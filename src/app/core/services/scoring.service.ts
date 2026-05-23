import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  ScoreSportDto,
  ScoreRuleSetDto,
  CreateScoringMatchRequest,
  ScoringMatchDto,
  RegisteredPlayerSearchDto,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ScoringService {
  constructor(private readonly api: ApiService) {}

  getSports(): Observable<ScoreSportDto[]> {
    return this.api.get<ScoreSportDto[]>('/scoring/sports');
  }

  getRuleSets(sportCode: string): Observable<ScoreRuleSetDto[]> {
    return this.api.get<ScoreRuleSetDto[]>(
      `/scoring/rule-sets?sportCode=${encodeURIComponent(sportCode)}`
    );
  }

  searchPlayers(query: string): Observable<RegisteredPlayerSearchDto[]> {
    return this.api.get<RegisteredPlayerSearchDto[]>(
      `/scoring/players/search?query=${encodeURIComponent(query)}`
    );
  }

  createMatch(payload: CreateScoringMatchRequest): Observable<ScoringMatchDto> {
    return this.api.post<ScoringMatchDto>('/scoring/matches', payload);
  }

  getMatch(matchId: string): Observable<ScoringMatchDto> {
    return this.api.get<ScoringMatchDto>(`/scoring/matches/${matchId}`);
  }

  getMyHistory(): Observable<ScoringMatchDto[]> {
    return this.api.get<ScoringMatchDto[]>('/scoring/matches/my-history');
  }
}
