import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Show, ShowSearchResult, Actor } from '../../../shared/models/show.model';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Injectable({ 
  providedIn: 'root' 
})
export class TvMazeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  searchShows(query: string): Observable<Show[]> {
    if (!query?.trim()) {
      return throwError(() => new Error('Search query is required'));
    }

    return this.http.get<ShowSearchResult[]>(`${this.baseUrl}/search/shows?q=${encodeURIComponent(query)}`)
      .pipe(
        map(results => results.map(result => result.show)),
        catchError(this.handleError)
      );
  }

  getCastByShow(showId: number): Observable<Actor[]> {
    if (!showId || showId <= 0) {
      return throwError(() => new Error('Valid show ID is required'));
    }

    return this.http.get<Actor[]>(`${this.baseUrl}/shows/${showId}/cast`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllShows(pageNum = 0, pageSize = APP_CONSTANTS.SHOWS_PER_PAGE): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.baseUrl}/shows?page=${pageNum}`)
      .pipe(
        map(shows => shows.slice(0, pageSize)),
        catchError(this.handleError)
      );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
