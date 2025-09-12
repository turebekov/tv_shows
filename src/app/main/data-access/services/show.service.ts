import { Injectable, inject, OnDestroy } from '@angular/core';
import { finalize, switchMap, catchError, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, forkJoin, of, EMPTY } from 'rxjs';
import { TvMazeService } from './tv-maze.service';
import { ShowStateService } from './show-state.service';
import { Show, ShowWithActors } from '../../../shared/models/show.model';

@Injectable({
  providedIn: 'root'
})
export class ShowService implements OnDestroy {
  private readonly tvMazeService = inject(TvMazeService);
  private readonly stateService = inject(ShowStateService);
  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject$ = new BehaviorSubject<string>('');

  readonly shows = this.stateService.shows;
  readonly showsWithActors = this.stateService.showsWithActors;
  readonly loading = this.stateService.loading;
  readonly loadingActors = this.stateService.loadingActors;
  readonly error = this.stateService.error;
  readonly searchQuery = this.stateService.searchQuery;
  readonly hasShows = this.stateService.hasShows;

  constructor() {
    this.searchSubject$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query?.trim()) {
          this.stateService.clearShows();
          return EMPTY;
        }

        this.stateService.setSearchQuery(query);
        this.stateService.setLoading(true);
        this.stateService.clearShows();

        return this.tvMazeService.searchShows(query).pipe(
          switchMap(shows => {
            this.stateService.setShows(shows);
            return this.loadActorsForShowsReactive(shows);
          }),
          catchError(error => {
            this.stateService.setError(error.message);
            return EMPTY;
          }),
          finalize(() => this.stateService.setLoading(false))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  searchShows(query: string): void {
    this.searchSubject$.next(query);
  }

  private loadActorsForShowsReactive(shows: Show[]): Observable<ShowWithActors[]> {
    if (shows.length === 0) {
      return of([]);
    }

    const actorsRequests$ = shows.map(show => 
      this.loadActorsForShowReactive(show).pipe(
        catchError(error => {
          console.error(`Failed to load actors for show ${show.name}:`, error);
          return of({ ...show, actors: [] });
        })
      )
    );
    return forkJoin(actorsRequests$).pipe(
      switchMap((showWithActorsArray: ShowWithActors[]) => {
        showWithActorsArray.forEach((showWithActors: ShowWithActors) => {
          this.stateService.addShowWithActors(showWithActors);
        });
        return of(showWithActorsArray);
      })
    );
  }

  private loadActorsForShowReactive(show: Show): Observable<ShowWithActors> {
    if (this.stateService.loadingActors().has(show.id)) {
      return of({ ...show, actors: [] });
    }

    this.stateService.setLoadingActor(show.id, true);

    return this.tvMazeService.getCastByShow(show.id).pipe(
      switchMap(actors => {
        const showWithActors: ShowWithActors = { ...show, actors };
        return of(showWithActors);
      }),
      finalize(() => this.stateService.setLoadingActor(show.id, false))
    );
  }

  clearSearch(): void {
    this.stateService.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
