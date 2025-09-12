import { Component, signal } from '@angular/core';
import { MainComponent } from './main/main';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TV Shows App');
}
