import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ShowService } from './data-access/services/show.service';
import { ShowWithActors } from '../shared/models/show.model';
import { AllShowsComponent } from './ui/all-shows/all-shows';
import { APP_CONSTANTS, PrimeNgIcons } from '../shared/constants/app.constants';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrl: './main.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    AllShowsComponent,
  ],
  standalone: true,
})
export class MainComponent {
  private readonly showService = inject(ShowService);

  readonly shows = this.showService.shows;
  readonly showsWithActors = this.showService.showsWithActors;
  readonly loading = this.showService.loading;
  readonly loadingActors = this.showService.loadingActors;
  readonly error = this.showService.error;
  readonly searchQuery = this.showService.searchQuery;
  readonly hasShows = this.showService.hasShows;
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly PrimeNgIcons = PrimeNgIcons;

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.showService.searchShows(query);
  }

  onClearSearch(): void {
    this.showService.clearSearch();
  }

  trackByShowId(index: number, show: ShowWithActors): number {
    return show.id;
  }

  trackByActorId(index: number, actor: any): number {
    return actor.id || index;
  }
}
