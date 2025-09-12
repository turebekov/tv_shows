import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { finalize, switchMap, catchError, takeUntil, tap } from 'rxjs/operators';
import { Subject, BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { TvMazeService } from './tv-maze.service';
import { Show } from '../../../shared/models/show.model';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

export interface ShowFilters {
  genre: string | null;
  status: string | null;
  rating: number | null;
  year: number | null;
}

export interface ShowSort {
  field: 'name' | 'rating' | 'premiered' | 'status';
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class AllShowsService implements OnDestroy {
  readonly shows = computed(() => this._shows());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  readonly currentPage = computed(() => this._currentPage());
  readonly hasMorePages = computed(() => this._hasMorePages());
  readonly filters = computed(() => this._filters());
  readonly sort = computed(() => this._sort());

  readonly filteredShows = computed(() => {
    let filtered = this._shows();
    
    const filters = this._filters();
    if (filters.genre) {
      filtered = filtered.filter(show => 
        show.genres?.some(genre => 
          genre.toLowerCase().includes(filters.genre!.toLowerCase())
        )
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(show => 
        show.status?.toLowerCase() === filters.status!.toLowerCase()
      );
    }
    
    if (filters.rating) {
      filtered = filtered.filter(show => 
        show.rating?.average && show.rating.average >= filters.rating!
      );
    }
    
    if (filters.year) {
      filtered = filtered.filter(show => 
        show.premiered && new Date(show.premiered).getFullYear() === filters.year!
      );
    }

    const sort = this._sort();
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sort.field) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'rating':
          aValue = a.rating?.average || 0;
          bValue = b.rating?.average || 0;
          break;
        case 'premiered':
          aValue = new Date(a.premiered || 0).getTime();
          bValue = new Date(b.premiered || 0).getTime();
          break;
        case 'status':
          aValue = a.status?.toLowerCase() || '';
          bValue = b.status?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  });

  readonly availableGenres = computed(() => {
    const shows = this._shows();
    if (shows.length === 0) return [];
    
    const genres = new Set<string>();
    shows.forEach(show => {
      show.genres?.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort().map(genre => ({ label: genre, value: genre }));
  });

  readonly availableStatuses = computed(() => {
    const shows = this._shows();
    if (shows.length === 0) return [];
    
    const statuses = new Set<string>();
    shows.forEach(show => {
      if (show.status) statuses.add(show.status);
    });
    return Array.from(statuses).sort().map(status => ({ label: status, value: status }));
  });

  readonly availableYears = computed(() => {
    const shows = this._shows();
    if (shows.length === 0) return [];
    
    const years = new Set<number>();
    shows.forEach(show => {
      if (show.premiered) {
        years.add(new Date(show.premiered).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a).map(year => ({ label: year.toString(), value: year }));
  });

  get showsPerPage(): number {
    return AllShowsService.SHOWS_PER_PAGE;
  }

  private static readonly SHOWS_PER_PAGE = APP_CONSTANTS.SHOWS_PER_PAGE;
  
  private readonly tvMazeService = inject(TvMazeService);
  private readonly destroy$ = new Subject<void>();
  private readonly loadMoreSubject$ = new BehaviorSubject<{ page: number; reset: boolean }>({ page: 0, reset: false });
  private readonly _shows = signal<Show[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentPage = signal(0);
  private readonly _hasMorePages = signal(true);
  private readonly _filters = signal<ShowFilters>({
    genre: null,
    status: null,
    rating: null,
    year: null
  });
  private readonly _sort = signal<ShowSort>({
    field: 'name',
    direction: 'asc'
  });

  constructor() {
    this.loadMoreSubject$.pipe(
      switchMap(({ page, reset }) => {
        if (this._loading() || (!reset && !this._hasMorePages())) {
          return EMPTY;
        }

        this._loading.set(true);
        if (reset) {
          this._shows.set([]);
          this._error.set(null);
        }

        return this.tvMazeService.getAllShows(page, AllShowsService.SHOWS_PER_PAGE).pipe(
          tap(newShows => {
            if (newShows.length === 0) {
              this._hasMorePages.set(false);
              return;
            }

            if (reset) {
              this._shows.set(newShows);
            } else {
              this._shows.update(shows => [...shows, ...newShows]);
            }
            
            this._currentPage.set(page + 1);
            
            if (newShows.length < AllShowsService.SHOWS_PER_PAGE) {
              this._hasMorePages.set(false);
            }
          }),
          catchError(error => {
            this._error.set(error.message);
            return EMPTY;
          }),
          finalize(() => this._loading.set(false))
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  loadInitialShows(): void {
    this._currentPage.set(0);
    this._hasMorePages.set(true);
    this.loadMoreSubject$.next({ page: 0, reset: true });
  }

  loadMoreShows(): void {
    if (this._loading() || !this._hasMorePages()) return;
    this.loadMoreSubject$.next({ page: this._currentPage(), reset: false });
  }

  setFilters(filters: Partial<ShowFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  setSort(sort: Partial<ShowSort>): void {
    this._sort.update(current => ({ ...current, ...sort }));
  }

  clearFilters(): void {
    this._filters.set({
      genre: null,
      status: null,
      rating: null,
      year: null
    });
  }

  reset(): void {
    this._shows.set([]);
    this._currentPage.set(0);
    this._hasMorePages.set(true);
    this._error.set(null);
    this.clearFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
