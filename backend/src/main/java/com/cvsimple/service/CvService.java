package com.cvsimple.service;

import com.cvsimple.dto.*;

public interface CvService {

    CvDTO getCv(Long id);

    CvDTO createCv(CvDTO cvDTO);

    CvDTO updateCv(Long id, CvDTO cvDTO);

    void deleteCv(Long id);

    CvDTO addCertification(Long cvId, CertificationDTO certificationDTO);

    CvDTO removeCertification(Long cvId, Long certificationId);

    CvDTO addSkill(Long cvId, SkillDTO skillDTO);

    CvDTO removeSkill(Long cvId, Long skillId);

    CvDTO addExperience(Long cvId, ExperienceDTO experienceDTO);

    CvDTO removeExperience(Long cvId, Long experienceId);

    CvDTO addProject(Long cvId, ProjectDTO projectDTO);

    CvDTO removeProject(Long cvId, Long projectId);

    CvDTO addFormation(Long cvId, FormationDTO formationDTO);

    CvDTO removeFormation(Long cvId, Long formationId);

    CvDTO addLanguage(Long cvId, LanguageDTO languageDTO);

    CvDTO removeLanguage(Long cvId, Long languageId);
}
