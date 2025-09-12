import { Injectable, signal, computed } from '@angular/core';
import { Show, ShowWithActors, Actor, ShowSearchResult } from '../../../shared/models/show.model';

@Injectable({
  providedIn: 'root'
})
export class ShowStateService {
  private _shows = signal<Show[]>([]);
  private _showsWithActors = signal<ShowWithActors[]>([]);
  private _loading = signal(false);
  private _loadingActors = signal<Set<number>>(new Set());
  private _error = signal<string | null>(null);
  private _searchQuery = signal('');

  readonly shows = computed(() => this._shows());
  readonly showsWithActors = computed(() => this._showsWithActors());
  readonly loading = computed(() => this._loading());
  readonly loadingActors = computed(() => this._loadingActors());
  readonly error = computed(() => this._error());
  readonly searchQuery = computed(() => this._searchQuery());
  readonly hasShows = computed(() => this._shows().length > 0);

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  setShows(shows: Show[]): void {
    this._shows.set(shows);
    this._error.set(null);
  }

  addShowWithActors(show: ShowWithActors): void {
    this._showsWithActors.update(shows => {
      const existingIndex = shows.findIndex(s => s.id === show.id);
      if (existingIndex >= 0) {
        const updated = [...shows];
        updated[existingIndex] = show;
        return updated;
      }
      return [...shows, show];
    });
  }

  setLoadingActor(showId: number, loading: boolean): void {
    this._loadingActors.update(loadingSet => {
      const newSet = new Set(loadingSet);
      if (loading) {
        newSet.add(showId);
      } else {
        newSet.delete(showId);
      }
      return newSet;
    });
  }

  clearShows(): void {
    this._shows.set([]);
    this._showsWithActors.set([]);
    this._error.set(null);
  }

  reset(): void {
    this.clearShows();
    this._loading.set(false);
    this._loadingActors.set(new Set());
    this._searchQuery.set('');
  }
}
