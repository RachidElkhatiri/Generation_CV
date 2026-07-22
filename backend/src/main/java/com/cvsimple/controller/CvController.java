package com.cvsimple.controller;

import com.cvsimple.dto.*;
import com.cvsimple.service.CvService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
@Tag(name = "CV", description = "Gestion du CV")
public class CvController {

    private final CvService cvService;

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer le CV")
    public ResponseEntity<ApiResponse<CvDTO>> getCv(@PathVariable Long id) {
        CvDTO cv = cvService.getCv(id);
        return ResponseEntity.ok(ApiResponse.success(cv));
    }

    @PostMapping
    @Operation(summary = "Créer un CV")
    public ResponseEntity<ApiResponse<CvDTO>> createCv(@Valid @RequestBody CvDTO cvDTO) {
        CvDTO created = cvService.createCv(cvDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("CV créé avec succès", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour le CV")
    public ResponseEntity<ApiResponse<CvDTO>> updateCv(@PathVariable Long id, @Valid @RequestBody CvDTO cvDTO) {
        CvDTO updated = cvService.updateCv(id, cvDTO);
        return ResponseEntity.ok(ApiResponse.success("CV mis à jour avec succès", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer le CV")
    public ResponseEntity<ApiResponse<Void>> deleteCv(@PathVariable Long id) {
        cvService.deleteCv(id);
        return ResponseEntity.ok(ApiResponse.success("CV supprimé avec succès", null));
    }

    @PostMapping("/{cvId}/certifications")
    @Operation(summary = "Ajouter une certification")
    public ResponseEntity<ApiResponse<CvDTO>> addCertification(@PathVariable Long cvId, @Valid @RequestBody CertificationDTO dto) {
        CvDTO updated = cvService.addCertification(cvId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Certification ajoutée", updated));
    }

    @DeleteMapping("/{cvId}/certifications/{certificationId}")
    @Operation(summary = "Supprimer une certification")
    public ResponseEntity<ApiResponse<CvDTO>> removeCertification(@PathVariable Long cvId, @PathVariable Long certificationId) {
        CvDTO updated = cvService.removeCertification(cvId, certificationId);
        return ResponseEntity.ok(ApiResponse.success("Certification supprimée", updated));
    }

    @PostMapping("/{cvId}/skills")
    @Operation(summary = "Ajouter une compétence")
    public ResponseEntity<ApiResponse<CvDTO>> addSkill(@PathVariable Long cvId, @Valid @RequestBody SkillDTO dto) {
        CvDTO updated = cvService.addSkill(cvId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Compétence ajoutée", updated));
    }

    @DeleteMapping("/{cvId}/skills/{skillId}")
    @Operation(summary = "Supprimer une compétence")
    public ResponseEntity<ApiResponse<CvDTO>> removeSkill(@PathVariable Long cvId, @PathVariable Long skillId) {
        CvDTO updated = cvService.removeSkill(cvId, skillId);
        return ResponseEntity.ok(ApiResponse.success("Compétence supprimée", updated));
    }

    @PostMapping("/{cvId}/experiences")
    @Operation(summary = "Ajouter une expérience")
    public ResponseEntity<ApiResponse<CvDTO>> addExperience(@PathVariable Long cvId, @Valid @RequestBody ExperienceDTO dto) {
        CvDTO updated = cvService.addExperience(cvId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expérience ajoutée", updated));
    }

    @DeleteMapping("/{cvId}/experiences/{experienceId}")
    @Operation(summary = "Supprimer une expérience")
    public ResponseEntity<ApiResponse<CvDTO>> removeExperience(@PathVariable Long cvId, @PathVariable Long experienceId) {
        CvDTO updated = cvService.removeExperience(cvId, experienceId);
        return ResponseEntity.ok(ApiResponse.success("Expérience supprimée", updated));
    }

    @PostMapping("/{cvId}/projects")
    @Operation(summary = "Ajouter un projet")
    public ResponseEntity<ApiResponse<CvDTO>> addProject(@PathVariable Long cvId, @Valid @RequestBody ProjectDTO dto) {
        CvDTO updated = cvService.addProject(cvId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Projet ajouté", updated));
    }

    @DeleteMapping("/{cvId}/projects/{projectId}")
    @Operation(summary = "Supprimer un projet")
    public ResponseEntity<ApiResponse<CvDTO>> removeProject(@PathVariable Long cvId, @PathVariable Long projectId) {
        CvDTO updated = cvService.removeProject(cvId, projectId);
        return ResponseEntity.ok(ApiResponse.success("Projet supprimé", updated));
    }

    @PostMapping("/{cvId}/formations")
    @Operation(summary = "Ajouter une formation")
    public ResponseEntity<ApiResponse<CvDTO>> addFormation(@PathVariable Long cvId, @Valid @RequestBody FormationDTO dto) {
        CvDTO updated = cvService.addFormation(cvId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Formation ajoutée", updated));
    }

    @DeleteMapping("/{cvId}/formations/{formationId}")
    @Operation(summary = "Supprimer une formation")
    public ResponseEntity<ApiResponse<CvDTO>> removeFormation(@PathVariable Long cvId, @PathVariable Long formationId) {
        CvDTO updated = cvService.removeFormation(cvId, formationId);
        return ResponseEntity.ok(ApiResponse.success("Formation supprimée", updated));
    }

    @PostMapping("/{cvId}/languages")
    @Operation(summary = "Ajouter une langue")
    public ResponseEntity<ApiResponse<CvDTO>> addLanguage(@PathVariable Long cvId, @Valid @RequestBody LanguageDTO dto) {
        CvDTO updated = cvService.addLanguage(cvId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Langue ajoutée", updated));
    }

    @DeleteMapping("/{cvId}/languages/{languageId}")
    @Operation(summary = "Supprimer une langue")
    public ResponseEntity<ApiResponse<CvDTO>> removeLanguage(@PathVariable Long cvId, @PathVariable Long languageId) {
        CvDTO updated = cvService.removeLanguage(cvId, languageId);
        return ResponseEntity.ok(ApiResponse.success("Langue supprimée", updated));
    }
}
