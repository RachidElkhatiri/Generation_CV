package com.cvsimple.mapper;

import com.cvsimple.dto.*;
import com.cvsimple.entity.*;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CvMapper {

    CvDTO toDto(CV cv);

    CV toEntity(CvDTO dto);

    PersonalInfoDTO toDto(PersonalInfo personalInfo);

    PersonalInfo toEntity(PersonalInfoDTO dto);

    CertificationDTO toDto(Certification certification);

    Certification toEntity(CertificationDTO dto);

    SkillDTO toDto(Skill skill);

    Skill toEntity(SkillDTO dto);

    ExperienceDTO toDto(Experience experience);

    Experience toEntity(ExperienceDTO dto);

    ProjectDTO toDto(Project project);

    Project toEntity(ProjectDTO dto);

    FormationDTO toDto(Formation formation);

    Formation toEntity(FormationDTO dto);

    LanguageDTO toDto(Language language);

    Language toEntity(LanguageDTO dto);

    default List<CertificationDTO> certificationsToDto(List<Certification> certifications) {
        if (certifications == null) return new ArrayList<>();
        return certifications.stream().map(this::toDto).toList();
    }

    default List<Certification> certificationsToEntity(List<CertificationDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream().map(this::toEntity).toList();
    }

    default List<SkillDTO> skillsToDto(List<Skill> skills) {
        if (skills == null) return new ArrayList<>();
        return skills.stream().map(this::toDto).toList();
    }

    default List<Skill> skillsToEntity(List<SkillDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream().map(this::toEntity).toList();
    }

    default List<ExperienceDTO> experiencesToDto(List<Experience> experiences) {
        if (experiences == null) return new ArrayList<>();
        return experiences.stream().map(this::toDto).toList();
    }

    default List<Experience> experiencesToEntity(List<ExperienceDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream().map(this::toEntity).toList();
    }

    default List<ProjectDTO> projectsToDto(List<Project> projects) {
        if (projects == null) return new ArrayList<>();
        return projects.stream().map(this::toDto).toList();
    }

    default List<Project> projectsToEntity(List<ProjectDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream().map(this::toEntity).toList();
    }

    default List<FormationDTO> formationsToDto(List<Formation> formations) {
        if (formations == null) return new ArrayList<>();
        return formations.stream().map(this::toDto).toList();
    }

    default List<Formation> formationsToEntity(List<FormationDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream().map(this::toEntity).toList();
    }

    default List<LanguageDTO> languagesToDto(List<Language> languages) {
        if (languages == null) return new ArrayList<>();
        return languages.stream().map(this::toDto).toList();
    }

    default List<Language> languagesToEntity(List<LanguageDTO> dtos) {
        if (dtos == null) return new ArrayList<>();
        return dtos.stream().map(this::toEntity).toList();
    }
}
