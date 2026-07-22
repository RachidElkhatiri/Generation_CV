import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CvService } from '../../services/cv.service';
import { Cv } from '../../models/cv.model';

@Component({
  selector: 'app-cv-preview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="cv-preview-page">
      @if (loading) {
        <div class="spinner-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && !cv) {
        <mat-card class="empty-card">
          <mat-card-content>
            <mat-icon class="empty-icon">description</mat-icon>
            <h2>Aucun CV trouvé</h2>
            <p>Créez votre CV dans l'éditeur avant de le visualiser.</p>
            <button mat-raised-button color="primary" routerLink="/cv/new">
              <mat-icon>edit</mat-icon> Aller à l'éditeur
            </button>
          </mat-card-content>
        </mat-card>
      }

      @if (cv) {
        <div class="cv-document">
          <!-- BARRE D'ACTIONS -->
          <div class="actions-bar no-print">
            <button mat-stroked-button [routerLink]="['/cv', cv.id]">
              <mat-icon>edit</mat-icon> Éditer
            </button>
            <button mat-raised-button color="primary" (click)="printCv()">
              <mat-icon>print</mat-icon> Imprimer / PDF
            </button>
          </div>

          <!-- EN-TÊTE -->
          <header class="cv-header">
            <div class="photo" *ngIf="cv.personalInfo?.photoUrl">
              <img [src]="cv.personalInfo.photoUrl" [alt]="cv.personalInfo.fullName" />
            </div>
            <div class="header-info">
              <h1>{{ cv.personalInfo?.fullName }}</h1>
              <div class="job-title">{{ cv.personalInfo?.jobTitle }}</div>
              <div class="contact">
                <span *ngIf="cv.personalInfo?.location">
                  <mat-icon>location_on</mat-icon> {{ cv.personalInfo.location }}
                </span>
                <span *ngIf="cv.personalInfo?.email">
                  <mat-icon>email</mat-icon>
                  <a [href]="'mailto:' + cv.personalInfo.email">{{ cv.personalInfo.email }}</a>
                </span>
                <span *ngIf="cv.personalInfo?.linkedInUrl">
                  <mat-icon>link</mat-icon>
                  <a [href]="cv.personalInfo.linkedInUrl" target="_blank">LinkedIn</a>
                </span>
              </div>
            </div>
          </header>

          <!-- PROFIL -->
          <section class="cv-section" *ngIf="cv.profileSummary">
            <h2>Profil</h2>
            <p class="profile-text">{{ cv.profileSummary }}</p>
          </section>

          <!-- CERTIFICATIONS -->
          <section class="cv-section" *ngIf="cv.certifications?.length">
            <h2>Certifications</h2>
            <div class="skills-grid">
              <div class="skill-item" *ngFor="let cert of cv.certifications">
                <span class="label">🏆 {{ cert.name }}</span>
                <span class="value">{{ cert.description }}</span>
              </div>
            </div>
          </section>

          <!-- COMPÉTENCES -->
          <section class="cv-section" *ngIf="cv.skills?.length">
            <h2>Compétences</h2>
            <div class="skills-grid">
              <div class="skill-item" *ngFor="let skill of cv.skills">
                <span class="label">{{ skill.category }}</span>
                <span class="value">{{ skill.value }}</span>
              </div>
            </div>
          </section>

          <!-- EXPÉRIENCES -->
          <section class="cv-section" *ngIf="cv.experiences?.length">
            <h2>Expérience</h2>
            <div class="exp-item" *ngFor="let exp of cv.experiences">
              <div class="exp-header">
                <h3>{{ exp.title }}</h3>
                <span class="date">
                  {{ formatDate(exp.startDate) }} – {{ exp.endDate ? formatDate(exp.endDate) : 'Présent' }}
                </span>
              </div>
              <div class="company">{{ exp.company }}<span *ngIf="exp.location"> • {{ exp.location }}</span></div>
              <ul *ngIf="exp.descriptions">
                <li *ngFor="let desc of splitLines(exp.descriptions)">{{ desc }}</li>
              </ul>
            </div>
          </section>

          <!-- PROJETS -->
          <section class="cv-section" *ngIf="cv.projects?.length">
            <h2>Projets</h2>
            <div class="project" *ngFor="let project of cv.projects">
              <h3>{{ project.title }}</h3>
              <p *ngIf="project.description">{{ project.description }}</p>
              <ul *ngIf="project.highlights">
                <li *ngFor="let h of splitLines(project.highlights)">{{ h }}</li>
              </ul>
              <div class="tech" *ngIf="project.technologies">{{ project.technologies }}</div>
            </div>
          </section>

          <!-- FORMATIONS -->
          <section class="cv-section" *ngIf="cv.formations?.length">
            <h2>Formation</h2>
            <div class="edu-item" *ngFor="let form of cv.formations">
              <div class="edu-header">
                <h3>{{ form.degree }}</h3>
                <span class="edu-date">{{ formatDate(form.startDate) }} – {{ form.endDate ? formatDate(form.endDate) : 'En cours' }}</span>
              </div>
              <div class="school">{{ form.school }}</div>
            </div>
          </section>

          <!-- LANGUES -->
          <section class="cv-section" *ngIf="cv.languages?.length">
            <h2>Langues</h2>
            <div class="langues">
              <span *ngFor="let lang of cv.languages">
                <strong>{{ lang.name }}</strong> – {{ lang.level }}
              </span>
            </div>
          </section>

          <!-- FOOTER -->
          <footer class="cv-footer">
            CV mis à jour – {{ currentMonth }}
          </footer>
        </div>
      }
    </div>
  `,
  styleUrls: ['./cv-preview.component.scss']
})
export class CvPreviewComponent implements OnInit {
  private cvService = inject(CvService);
  private route = inject(ActivatedRoute);

  cv: Cv | null = null;
  loading = true;
  currentMonth = '';

  ngOnInit(): void {
    const now = new Date();
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    this.currentMonth = months[now.getMonth()] + ' ' + now.getFullYear();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cvService.getCv(Number(id)).subscribe({
          next: (cv) => {
            this.cv = cv;
            this.loading = false;
          },
          error: () => {
            this.cv = null;
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    });
  }

  splitLines(text: string): string[] {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim() !== '');
  }

  formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
      'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
    return months[date.getMonth()] + '. ' + date.getFullYear();
  }

  printCv(): void {
    window.print();
  }
}
