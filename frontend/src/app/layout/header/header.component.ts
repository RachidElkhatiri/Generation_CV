import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <mat-icon>description</mat-icon>
      <span class="title" routerLink="/cv/new" style="cursor: pointer">CV Simple</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/cv/new" style="margin-right: 8px">
        <mat-icon>add</mat-icon> Nouveau CV
      </button>
      <span class="subtitle">Générateur de CV</span>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    .title {
      margin-left: 8px;
      font-weight: 500;
    }
    .spacer {
      flex: 1;
    }
    .subtitle {
      font-size: 14px;
      opacity: 0.8;
    }
  `]
})
export class HeaderComponent {}
