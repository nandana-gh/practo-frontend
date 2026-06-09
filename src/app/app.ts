import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('practo-frontend');
  isCustomHeaderPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCustomHeaderPage = event.urlAfterRedirects.includes('/corporate') || 
                                  event.urlAfterRedirects.includes('/providers/prime') ||
                                  event.urlAfterRedirects.includes('/data-security') ||
                                  event.urlAfterRedirects.includes('/about') ||
                                  event.urlAfterRedirects.includes('/software/clinics') ||
                                  event.urlAfterRedirects.includes('/software/hospitals') ||
                                  event.urlAfterRedirects.includes('/providers/profile') ||
                                  event.urlAfterRedirects.includes('/help') ||
                                  event.urlAfterRedirects.includes('/consult/request');
      }
    });
  }
}
