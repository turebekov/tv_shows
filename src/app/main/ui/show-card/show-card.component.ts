import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Show } from '../../../shared/models/show.model';
import { APP_CONSTANTS, PrimeNgIcons } from '../../../shared/constants/app.constants';

@Component({
  selector: 'sg-show-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card class="show-card" [style]="{'height': APP_CONSTANTS.CARD_HEIGHT}">
      <ng-template pTemplate="header">
        @if (show.image && show.image.medium) {
          <img 
            [src]="show.image.medium" 
            [alt]="show.name" 
            class="show-image"
            loading="lazy"
          />
        } @else {
          <div class="show-image-placeholder">
                   <i [class]="PrimeNgIcons.IMAGE"></i>
          </div>
        }
      </ng-template>
      
      <ng-template pTemplate="content">
        <h3 class="show-title">{{ show.name }}</h3>
        
        @if (show.genres && show.genres.length) {
          <div class="show-genres">
            @for (genre of show.genres; track genre) {
              <span class="genre-tag">{{ genre }}</span>
            }
          </div>
        }
        
        @if (show.rating && show.rating.average) {
          <div class="show-rating">
                 <i [class]="PrimeNgIcons.STAR_FILL"></i>
            <span>{{ show.rating.average | number:'1.1-1' }}</span>
          </div>
        }
        
        @if (show.premiered) {
          <div class="show-premiered">
                 <i [class]="PrimeNgIcons.CALENDAR"></i>
            <span>{{ show.premiered | date:'yyyy' }}</span>
          </div>
        }
        
        @if (show.status) {
          <div class="show-status" [class]="'status-' + show.status.toLowerCase()">
            <span>{{ show.status }}</span>
          </div>
        }
        
        @if (show.summary) {
          <p class="show-summary" [innerHTML]="getSummaryText()"></p>
        }
      </ng-template>
      
    </p-card>
  `,
  styleUrls: ['./show-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowCardComponent {
  @Input({ required: true }) show!: Show;
  
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly PrimeNgIcons = PrimeNgIcons;

  getSummaryText(): string {
    if (!this.show.summary) return '';
    
    const text = this.show.summary.replace(/<[^>]*>/g, '');
    return text.length > APP_CONSTANTS.SUMMARY_MAX_LENGTH ? text.substring(0, APP_CONSTANTS.SUMMARY_MAX_LENGTH) + '...' : text;
  }
}
