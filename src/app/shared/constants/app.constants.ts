export const APP_CONSTANTS = {
  SHOWS_PER_PAGE: 9,
  SEARCH_DEBOUNCE_TIME: 500,
  MIN_RATING: 0,
  MAX_RATING: 10,
  RATING_STEP: 0.1,
  DEFAULT_RATING: 0,
  SUMMARY_MAX_LENGTH: 150,
  SPINNER: {
    LARGE: { width: '50px', height: '50px' },
    MEDIUM: { width: '30px', height: '30px' },
    SMALL: { width: '20px', height: '20px' }
  },
  STROKE_WIDTH: {
    LARGE: '4',
    MEDIUM: '3',
    SMALL: '3'
  },
  ANIMATION_DURATION: '1s',
  CARD_HEIGHT: '100%',
  IMAGE_HEIGHT: '200px',
  IMAGE_HEIGHT_MOBILE: '180px',
  GRID_COLUMNS: {
    DESKTOP: 'repeat(auto-fill, minmax(350px, 1fr))',
    TABLET: 'repeat(auto-fill, minmax(320px, 1fr))',
    MOBILE: '1fr'
  },
  GAP: {
    SMALL: '0.5rem',
    MEDIUM: '1rem',
    LARGE: '1.5rem',
    XLARGE: '2rem'
  },
  PADDING: {
    SMALL: '0.5rem',
    MEDIUM: '1rem',
    LARGE: '1.5rem',
    XLARGE: '2rem'
  },
  MARGIN: {
    SMALL: '0.5rem',
    MEDIUM: '1rem',
    LARGE: '1.5rem',
    XLARGE: '2rem'
  },
  FONT_SIZE: {
    XS: '0.7rem',
    SM: '0.8rem',
    BASE: '0.9rem',
    LG: '1rem',
    XL: '1.1rem',
    '2XL': '1.25rem',
    '3XL': '1.5rem',
    '4XL': '2rem',
    '5XL': '2.5rem',
    '6XL': '4rem'
  },
  BORDER_RADIUS: {
    SM: '4px',
    MD: '8px',
    LG: '12px',
    XL: '20px',
    FULL: '50px'
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070
  },
  BREAKPOINTS: {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1200px'
  },
  COLORS: {
    PRIMARY: '#007bff',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
    MUTED: '#6c757d'
  },
  OPACITY: {
    LOW: 0.5,
    MEDIUM: 0.7,
    HIGH: 0.9
  }
} as const;

import { PrimeIcons } from 'primeng/api';

export const PrimeNgIcons = {
  ...PrimeIcons
};