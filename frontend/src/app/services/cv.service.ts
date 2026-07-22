import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Cv, Certification, Skill, Experience, Project, Formation, Language } from '../models/cv.model';

@Injectable({ providedIn: 'root' })
export class CvService {

  private readonly apiUrl = 'http://localhost:8080/api/cv';
  private http = inject(HttpClient);

  getCv(id: number): Observable<Cv> {
    return this.http.get<ApiResponse<Cv>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }

  createCv(cv: Partial<Cv>): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(this.apiUrl, cv)
      .pipe(map(res => res.data));
  }

  updateCv(id: number, cv: Partial<Cv>): Observable<Cv> {
    return this.http.put<ApiResponse<Cv>>(`${this.apiUrl}/${id}`, cv)
      .pipe(map(res => res.data));
  }

  deleteCv(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  addCertification(cvId: number, cert: Certification): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/certifications`, cert)
      .pipe(map(res => res.data));
  }

  removeCertification(cvId: number, certId: number): Observable<Cv> {
    return this.http.delete<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/certifications/${certId}`)
      .pipe(map(res => res.data));
  }

  addSkill(cvId: number, skill: Skill): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/skills`, skill)
      .pipe(map(res => res.data));
  }

  removeSkill(cvId: number, skillId: number): Observable<Cv> {
    return this.http.delete<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/skills/${skillId}`)
      .pipe(map(res => res.data));
  }

  addExperience(cvId: number, exp: Experience): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/experiences`, exp)
      .pipe(map(res => res.data));
  }

  removeExperience(cvId: number, expId: number): Observable<Cv> {
    return this.http.delete<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/experiences/${expId}`)
      .pipe(map(res => res.data));
  }

  addProject(cvId: number, project: Project): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/projects`, project)
      .pipe(map(res => res.data));
  }

  removeProject(cvId: number, projectId: number): Observable<Cv> {
    return this.http.delete<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/projects/${projectId}`)
      .pipe(map(res => res.data));
  }

  addFormation(cvId: number, formation: Formation): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/formations`, formation)
      .pipe(map(res => res.data));
  }

  removeFormation(cvId: number, formationId: number): Observable<Cv> {
    return this.http.delete<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/formations/${formationId}`)
      .pipe(map(res => res.data));
  }

  addLanguage(cvId: number, language: Language): Observable<Cv> {
    return this.http.post<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/languages`, language)
      .pipe(map(res => res.data));
  }

  removeLanguage(cvId: number, languageId: number): Observable<Cv> {
    return this.http.delete<ApiResponse<Cv>>(`${this.apiUrl}/${cvId}/languages/${languageId}`)
      .pipe(map(res => res.data));
  }
}
