package com.cvsimple.dto;

import jakarta.validation.Valid;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CvDTO {

    private Long id;

    @Valid
    private PersonalInfoDTO personalInfo;

    private String profileSummary;

    @Builder.Default
    private List<CertificationDTO> certifications = new ArrayList<>();

    @Builder.Default
    private List<SkillDTO> skills = new ArrayList<>();

    @Builder.Default
    private List<ExperienceDTO> experiences = new ArrayList<>();

    @Builder.Default
    private List<ProjectDTO> projects = new ArrayList<>();

    @Builder.Default
    private List<FormationDTO> formations = new ArrayList<>();

    @Builder.Default
    private List<LanguageDTO> languages = new ArrayList<>();
}
