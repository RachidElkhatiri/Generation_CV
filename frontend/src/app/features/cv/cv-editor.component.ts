import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CvService } from '../../services/cv.service';
import { Cv } from '../../models/cv.model';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="cv-editor-container">
      @if (loading) {
        <div class="spinner-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!loading && isNewMode) {
        <mat-card class="welcome-card">
          <mat-card-header>
            <mat-card-title>Nouveau CV</mat-card-title>
            <mat-card-subtitle>Créez un CV vide et remplissez-le via l'éditeur</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Cliquez sur le bouton ci-dessous pour initialiser un nouveau CV.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="createNewCv()" [disabled]="saving">
              <mat-icon>add</mat-icon>
              {{ saving ? 'Création...' : 'Créer un CV' }}
            </button>
          </mat-card-actions>
        </mat-card>
      }

      @if (cv) {
        <div class="editor-header">
          <h2>{{ cv.id ? 'Éditeur de CV' : 'Nouveau CV' }}</h2>
          <div class="actions">
            <button mat-stroked-button color="primary" [routerLink]="['/cv', cv.id, 'preview']">
              <mat-icon>visibility</mat-icon> Prévisualiser
            </button>
            <button mat-stroked-button color="primary" routerLink="/cv/new">
              <mat-icon>note_add</mat-icon> Nouveau CV
            </button>
            <button mat-raised-button color="accent" (click)="saveCv()" [disabled]="saving">
              <mat-icon>save</mat-icon>
              {{ saving ? 'Enregistrement...' : (isNewCv ? 'Créer' : 'Enregistrer') }}
            </button>
          </div>
        </div>

        <mat-tab-group animationDuration="200ms" class="cv-tabs">
          <!-- PROFIL -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>person</mat-icon> Profil
            </ng-template>
            <div class="tab-content">
              <mat-card>
                <mat-card-content>
                  <div class="form-grid">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nom complet</mat-label>
                      <input matInput [formControl]="fc(profilForm, 'fullName')">
                    </mat-form-field>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Titre du poste</mat-label>
                      <input matInput [formControl]="fc(profilForm, 'jobTitle')">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Localisation</mat-label>
                      <input matInput [formControl]="fc(profilForm, 'location')">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" [formControl]="fc(profilForm, 'email')">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>LinkedIn URL</mat-label>
                      <input matInput [formControl]="fc(profilForm, 'linkedInUrl')">
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>URL Photo</mat-label>
                      <input matInput [formControl]="fc(profilForm, 'photoUrl')">
                    </mat-form-field>
                  </div>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Résumé du profil</mat-label>
                    <textarea matInput rows="4" [formControl]="profileSummaryControl"></textarea>
                  </mat-form-field>
                </mat-card-content>
              </mat-card>
            </div>
          </mat-tab>

          <!-- EXPÉRIENCES -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>work</mat-icon> Expériences
            </ng-template>
            <div class="tab-content">
              <div class="section-header">
                <h3>Expériences</h3>
                <button mat-mini-fab color="primary" (click)="addExperience()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              @for (exp of experiencesArray.controls; track $index) {
                <mat-card class="item-card">
                  <mat-card-content>
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Titre</mat-label>
                        <input matInput [formControl]="fc(exp, 'title')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Entreprise</mat-label>
                        <input matInput [formControl]="fc(exp, 'company')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Localisation</mat-label>
                        <input matInput [formControl]="fc(exp, 'location')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Date de début</mat-label>
                        <input matInput type="date" [formControl]="fc(exp, 'startDate')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Date de fin</mat-label>
                        <input matInput type="date" [formControl]="fc(exp, 'endDate')">
                      </mat-form-field>
                    </div>
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Descriptions (une par ligne)</mat-label>
                      <textarea matInput rows="4" [formControl]="fc(exp, 'descriptions')"></textarea>
                    </mat-form-field>
                  </mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="warn" (click)="removeExperience($index)">
                      <mat-icon>delete</mat-icon> Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- FORMATIONS -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>school</mat-icon> Formations
            </ng-template>
            <div class="tab-content">
              <div class="section-header">
                <h3>Formations</h3>
                <button mat-mini-fab color="primary" (click)="addFormation()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              @for (form of formationsArray.controls; track $index) {
                <mat-card class="item-card">
                  <mat-card-content>
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Diplôme</mat-label>
                        <input matInput [formControl]="fc(form, 'degree')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Établissement</mat-label>
                        <input matInput [formControl]="fc(form, 'school')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Date de début</mat-label>
                        <input matInput type="date" [formControl]="fc(form, 'startDate')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Date de fin</mat-label>
                        <input matInput type="date" [formControl]="fc(form, 'endDate')">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="warn" (click)="removeFormation($index)">
                      <mat-icon>delete</mat-icon> Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- COMPÉTENCES -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>build</mat-icon> Compétences
            </ng-template>
            <div class="tab-content">
              <div class="section-header">
                <h3>Compétences</h3>
                <button mat-mini-fab color="primary" (click)="addSkill()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              @for (skill of skillsArray.controls; track $index) {
                <mat-card class="item-card">
                  <mat-card-content>
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Catégorie</mat-label>
                        <input matInput [formControl]="fc(skill, 'category')">
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Compétences</mat-label>
                        <input matInput [formControl]="fc(skill, 'value')">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="warn" (click)="removeSkill($index)">
                      <mat-icon>delete</mat-icon> Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- CERTIFICATIONS -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>emoji_events</mat-icon> Certifications
            </ng-template>
            <div class="tab-content">
              <div class="section-header">
                <h3>Certifications</h3>
                <button mat-mini-fab color="primary" (click)="addCertification()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              @for (cert of certificationsArray.controls; track $index) {
                <mat-card class="item-card">
                  <mat-card-content>
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Nom</mat-label>
                        <input matInput [formControl]="fc(cert, 'name')">
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Description</mat-label>
                        <input matInput [formControl]="fc(cert, 'description')">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="warn" (click)="removeCertification($index)">
                      <mat-icon>delete</mat-icon> Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- PROJETS -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>folder</mat-icon> Projets
            </ng-template>
            <div class="tab-content">
              <div class="section-header">
                <h3>Projets</h3>
                <button mat-mini-fab color="primary" (click)="addProject()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              @for (project of projectsArray.controls; track $index) {
                <mat-card class="item-card">
                  <mat-card-content>
                    <div class="form-grid">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Titre</mat-label>
                        <input matInput [formControl]="fc(project, 'title')">
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Description</mat-label>
                        <textarea matInput rows="3" [formControl]="fc(project, 'description')"></textarea>
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Points forts (un par ligne)</mat-label>
                        <textarea matInput rows="3" [formControl]="fc(project, 'highlights')"></textarea>
                      </mat-form-field>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Technologies</mat-label>
                        <input matInput [formControl]="fc(project, 'technologies')">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="warn" (click)="removeProject($index)">
                      <mat-icon>delete</mat-icon> Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-tab>

          <!-- LANGUES -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon>translate</mat-icon> Langues
            </ng-template>
            <div class="tab-content">
              <div class="section-header">
                <h3>Langues</h3>
                <button mat-mini-fab color="primary" (click)="addLanguage()">
                  <mat-icon>add</mat-icon>
                </button>
              </div>
              @for (lang of languagesArray.controls; track $index) {
                <mat-card class="item-card">
                  <mat-card-content>
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Langue</mat-label>
                        <input matInput [formControl]="fc(lang, 'name')">
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Niveau</mat-label>
                        <input matInput [formControl]="fc(lang, 'level')">
                      </mat-form-field>
                    </div>
                  </mat-card-content>
                  <mat-card-actions align="end">
                    <button mat-button color="warn" (click)="removeLanguage($index)">
                      <mat-icon>delete</mat-icon> Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </div>
  `,
  styles: [`
    .cv-editor-container {
      max-width: 1100px;
      margin: 24px auto;
      padding: 0 16px;
    }
    .spinner-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }
    .welcome-card {
      max-width: 500px;
      margin: 48px auto;
      text-align: center;
    }
    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .editor-header h2 {
      margin: 0;
      color: #333;
    }
    .cv-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    .tab-content {
      padding: 24px 16px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .section-header h3 {
      margin: 0;
      color: #555;
    }
    .item-card {
      margin-bottom: 16px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CvEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cvService = inject(CvService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cv: Cv | null = null;
  loading = true;
  saving = false;
  isNewCv = false;
  isNewMode = false;

  profilForm = this.fb.group({
    fullName: [''],
    jobTitle: [''],
    location: [''],
    email: [''],
    linkedInUrl: [''],
    photoUrl: ['']
  });

  profileSummaryControl = this.fb.control('');

  experiencesArray = this.fb.array<FormGroup>([]);
  formationsArray = this.fb.array<FormGroup>([]);
  skillsArray = this.fb.array<FormGroup>([]);
  certificationsArray = this.fb.array<FormGroup>([]);
  projectsArray = this.fb.array<FormGroup>([]);
  languagesArray = this.fb.array<FormGroup>([]);

  fc(form: FormGroup, key: string): FormControl {
    return form.get(key) as FormControl;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isNewMode = false;
        this.loadCv(Number(id));
      } else {
        this.isNewMode = true;
        this.loading = false;
      }
    });
  }

  loadCv(id: number): void {
    this.loading = true;
    this.cvService.getCv(id).subscribe({
      next: (cv) => {
        this.cv = cv;
        this.isNewCv = false;
        this.populateForm(cv);
        this.loading = false;
      },
      error: () => {
        this.cv = null;
        this.loading = false;
        this.snackBar.open('CV introuvable', 'Fermer', { duration: 3000 });
        this.router.navigate(['/cv/new']);
      }
    });
  }

  createNewCv(): void {
    this.saving = true;
    const emptyCv: Partial<Cv> = {
      personalInfo: {
        fullName: '',
        jobTitle: '',
        location: '',
        email: '',
        linkedInUrl: '',
        photoUrl: ''
      },
      profileSummary: '',
      certifications: [],
      skills: [],
      experiences: [],
      projects: [],
      formations: [],
      languages: []
    };

    this.cvService.createCv(emptyCv).subscribe({
      next: (cv) => {
        this.cv = cv;
        this.isNewCv = true;
        this.isNewMode = false;
        this.populateForm(cv);
        this.saving = false;
        this.router.navigate(['/cv', cv.id]);
        this.snackBar.open('CV créé avec succès', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Erreur lors de la création du CV', 'Fermer', { duration: 3000 });
      }
    });
  }

  populateForm(cv: Cv): void {
    this.profilForm.patchValue(cv.personalInfo);
    this.profileSummaryControl.setValue(cv.profileSummary || '');

    this.setFormArray(this.experiencesArray, cv.experiences, this.createExperienceGroup);
    this.setFormArray(this.formationsArray, cv.formations, this.createFormationGroup);
    this.setFormArray(this.skillsArray, cv.skills, this.createSkillGroup);
    this.setFormArray(this.certificationsArray, cv.certifications, this.createCertificationGroup);
    this.setFormArray(this.projectsArray, cv.projects, this.createProjectGroup);
    this.setFormArray(this.languagesArray, cv.languages, this.createLanguageGroup);
  }

  private setFormArray(formArray: FormArray, items: any[], factory: (item: any) => FormGroup): void {
    formArray.clear();
    items.forEach(item => formArray.push(factory(item)));
  }

  createExperienceGroup = (exp: any) => this.fb.group({
    id: [exp?.id ?? null],
    title: [exp?.title ?? ''],
    company: [exp?.company ?? ''],
    location: [exp?.location ?? ''],
    startDate: [exp?.startDate ?? ''],
    endDate: [exp?.endDate ?? ''],
    descriptions: [exp?.descriptions ?? '']
  });

  createFormationGroup = (form: any) => this.fb.group({
    id: [form?.id ?? null],
    degree: [form?.degree ?? ''],
    school: [form?.school ?? ''],
    startDate: [form?.startDate ?? ''],
    endDate: [form?.endDate ?? '']
  });

  createSkillGroup = (skill: any) => this.fb.group({
    id: [skill?.id ?? null],
    category: [skill?.category ?? ''],
    value: [skill?.value ?? '']
  });

  createCertificationGroup = (cert: any) => this.fb.group({
    id: [cert?.id ?? null],
    name: [cert?.name ?? ''],
    description: [cert?.description ?? '']
  });

  createProjectGroup = (project: any) => this.fb.group({
    id: [project?.id ?? null],
    title: [project?.title ?? ''],
    description: [project?.description ?? ''],
    highlights: [project?.highlights ?? ''],
    technologies: [project?.technologies ?? '']
  });

  createLanguageGroup = (lang: any) => this.fb.group({
    id: [lang?.id ?? null],
    name: [lang?.name ?? ''],
    level: [lang?.level ?? '']
  });

  addExperience(): void {
    this.experiencesArray.push(this.createExperienceGroup(null));
  }

  removeExperience(index: number): void {
    this.experiencesArray.removeAt(index);
  }

  addFormation(): void {
    this.formationsArray.push(this.createFormationGroup(null));
  }

  removeFormation(index: number): void {
    this.formationsArray.removeAt(index);
  }

  addSkill(): void {
    this.skillsArray.push(this.createSkillGroup(null));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  addCertification(): void {
    this.certificationsArray.push(this.createCertificationGroup(null));
  }

  removeCertification(index: number): void {
    this.certificationsArray.removeAt(index);
  }

  addProject(): void {
    this.projectsArray.push(this.createProjectGroup(null));
  }

  removeProject(index: number): void {
    this.projectsArray.removeAt(index);
  }

  addLanguage(): void {
    this.languagesArray.push(this.createLanguageGroup(null));
  }

  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  buildCvPayload(): Partial<Cv> {
    return {
      personalInfo: this.profilForm.value as any,
      profileSummary: this.profileSummaryControl.value || '',
      experiences: this.experiencesArray.value as any[],
      formations: this.formationsArray.value as any[],
      skills: this.skillsArray.value as any[],
      certifications: this.certificationsArray.value as any[],
      projects: this.projectsArray.value as any[],
      languages: this.languagesArray.value as any[]
    };
  }

  saveCv(): void {
    this.saving = true;
    const payload = this.buildCvPayload();

    if (this.cv?.id) {
      this.cvService.updateCv(this.cv.id, payload).subscribe({
        next: (cv) => {
          this.cv = cv;
          this.isNewCv = false;
          this.saving = false;
          this.snackBar.open('CV enregistré avec succès', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.cvService.createCv(payload).subscribe({
        next: (cv) => {
          this.cv = cv;
          this.isNewCv = false;
          this.saving = false;
          this.router.navigate(['/cv', cv.id]);
          this.snackBar.open('CV créé avec succès', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.saving = false;
          this.snackBar.open('Erreur lors de la création du CV', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
