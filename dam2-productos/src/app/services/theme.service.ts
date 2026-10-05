import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  isDark(): boolean {
    return this.darkMode;
  }

  toggleDarkMode(): boolean {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
    return this.darkMode;
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('ion-palette-dark', this.darkMode);
    document.body.classList.toggle('ion-palette-dark', this.darkMode);
    document.documentElement.classList.toggle('dark', this.darkMode);
  }
}
