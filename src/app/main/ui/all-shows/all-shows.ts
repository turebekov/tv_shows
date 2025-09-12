import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { AllShowsService, ShowFilters, ShowSort } from '../../data-access/services/all-shows.service';
import { ShowCardComponent } from '../show-card/show-card.component';
import { APP_CONSTANTS, PrimeNgIcons } from '../../../shared/constants/app.constants';

@Component({
  selector: 'sg-all-shows',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    SliderModule,
    ProgressSpinnerModule,
    MessageModule,
    CardModule,
    ShowCardComponent
  ],
  templateUrl: './all-shows.html',
  styleUrls: ['./all-shows.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllShowsComponent implements OnInit {
  private readonly allShowsService = inject(AllShowsService);

  readonly shows = this.allShowsService.shows;
  readonly filteredShows = this.allShowsService.filteredShows;
  readonly loading = this.allShowsService.loading;
  readonly error = this.allShowsService.error;
  readonly hasMorePages = this.allShowsService.hasMorePages;
  readonly availableGenres = this.allShowsService.availableGenres;
  readonly availableStatuses = this.allShowsService.availableStatuses;
  readonly availableYears = this.allShowsService.availableYears;
  readonly showsPerPage = this.allShowsService.showsPerPage;
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly PrimeNgIcons = PrimeNgIcons;

  selectedGenre: string | null = null;
  selectedStatus: string | null = null;
  selectedYear: number | null = null;
  selectedRating = APP_CONSTANTS.DEFAULT_RATING;
  selectedSortField: 'name' | 'rating' | 'premiered' | 'status' = 'name';
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly sortFields = [
    { label: 'Name', value: 'name' },
    { label: 'Rating', value: 'rating' },
    { label: 'Premiered', value: 'premiered' },
    { label: 'Status', value: 'status' }
  ];


  ngOnInit(): void {
    this.loadInitialShows();
  }

  loadInitialShows(): void {
    this.allShowsService.loadInitialShows();
  }

  loadMoreShows(): void {
    this.allShowsService.loadMoreShows();
  }

  onGenreChange(): void {
    this.updateFilters({ genre: this.selectedGenre });
  }

  onStatusChange(): void {
    this.updateFilters({ status: this.selectedStatus });
  }

  onYearChange(): void {
    this.updateFilters({ year: this.selectedYear });
  }

  onRatingChange(): void {
    this.updateFilters({ rating: this.selectedRating > APP_CONSTANTS.MIN_RATING ? this.selectedRating : null });
  }

  onSortChange(): void {
    this.updateSort({ field: this.selectedSortField });
  }

  toggleSortDirection(): void {
    const newDirection = this.sortDirection() === 'asc' ? 'desc' : 'asc';
    this.sortDirection.set(newDirection);
    this.updateSort({ direction: newDirection });
  }

  clearFilters(): void {
    this.selectedGenre = null;
    this.selectedStatus = null;
    this.selectedYear = null;
    this.selectedRating = APP_CONSTANTS.DEFAULT_RATING;
    this.selectedSortField = 'name';
    this.sortDirection.set('asc');
    
    this.allShowsService.clearFilters();
    this.updateSort({ field: 'name', direction: 'asc' });
  }

  private updateFilters(filters: Partial<ShowFilters>): void {
    this.allShowsService.setFilters(filters);
  }

  private updateSort(sort: Partial<ShowSort>): void {
    this.allShowsService.setSort(sort);
  }
}
