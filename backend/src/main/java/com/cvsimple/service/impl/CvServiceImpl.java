package com.cvsimple.service.impl;

import com.cvsimple.dto.*;
import com.cvsimple.entity.*;
import com.cvsimple.exception.ResourceNotFoundException;
import com.cvsimple.mapper.CvMapper;
import com.cvsimple.repository.CvRepository;
import com.cvsimple.service.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CvServiceImpl implements CvService {

    private final CvRepository cvRepository;
    private final CvMapper cvMapper;

    @Override
    @Transactional(readOnly = true)
    public CvDTO getCv(Long id) {
        CV cv = findCvById(id);
        return cvMapper.toDto(cv);
    }

    @Override
    public CvDTO createCv(CvDTO cvDTO) {
        CV cv = cvMapper.toEntity(cvDTO);
        CV savedCv = cvRepository.save(cv);
        return cvMapper.toDto(savedCv);
    }

    @Override
    public CvDTO updateCv(Long id, CvDTO cvDTO) {
        CV existingCv = findCvById(id);

        existingCv.setPersonalInfo(cvMapper.toEntity(cvDTO.getPersonalInfo()));
        existingCv.setProfileSummary(cvDTO.getProfileSummary());

        existingCv.getCertifications().clear();
        if (cvDTO.getCertifications() != null) {
            cvDTO.getCertifications().forEach(dto -> existingCv.getCertifications().add(cvMapper.toEntity(dto)));
        }

        existingCv.getSkills().clear();
        if (cvDTO.getSkills() != null) {
            cvDTO.getSkills().forEach(dto -> existingCv.getSkills().add(cvMapper.toEntity(dto)));
        }

        existingCv.getExperiences().clear();
        if (cvDTO.getExperiences() != null) {
            cvDTO.getExperiences().forEach(dto -> existingCv.getExperiences().add(cvMapper.toEntity(dto)));
        }

        existingCv.getProjects().clear();
        if (cvDTO.getProjects() != null) {
            cvDTO.getProjects().forEach(dto -> existingCv.getProjects().add(cvMapper.toEntity(dto)));
        }

        existingCv.getFormations().clear();
        if (cvDTO.getFormations() != null) {
            cvDTO.getFormations().forEach(dto -> existingCv.getFormations().add(cvMapper.toEntity(dto)));
        }

        existingCv.getLanguages().clear();
        if (cvDTO.getLanguages() != null) {
            cvDTO.getLanguages().forEach(dto -> existingCv.getLanguages().add(cvMapper.toEntity(dto)));
        }

        CV savedCv = cvRepository.save(existingCv);
        return cvMapper.toDto(savedCv);
    }

    @Override
    public void deleteCv(Long id) {
        CV cv = findCvById(id);
        cvRepository.delete(cv);
    }

    @Override
    public CvDTO addCertification(Long cvId, CertificationDTO certificationDTO) {
        CV cv = findCvById(cvId);
        cv.getCertifications().add(cvMapper.toEntity(certificationDTO));
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO removeCertification(Long cvId, Long certificationId) {
        CV cv = findCvById(cvId);
        boolean removed = cv.getCertifications().removeIf(c -> c.getId().equals(certificationId));
        if (!removed) {
            throw new ResourceNotFoundException("Certification", "id", certificationId);
        }
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO addSkill(Long cvId, SkillDTO skillDTO) {
        CV cv = findCvById(cvId);
        cv.getSkills().add(cvMapper.toEntity(skillDTO));
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO removeSkill(Long cvId, Long skillId) {
        CV cv = findCvById(cvId);
        boolean removed = cv.getSkills().removeIf(s -> s.getId().equals(skillId));
        if (!removed) {
            throw new ResourceNotFoundException("Compétence", "id", skillId);
        }
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO addExperience(Long cvId, ExperienceDTO experienceDTO) {
        CV cv = findCvById(cvId);
        cv.getExperiences().add(cvMapper.toEntity(experienceDTO));
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO removeExperience(Long cvId, Long experienceId) {
        CV cv = findCvById(cvId);
        boolean removed = cv.getExperiences().removeIf(e -> e.getId().equals(experienceId));
        if (!removed) {
            throw new ResourceNotFoundException("Expérience", "id", experienceId);
        }
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO addProject(Long cvId, ProjectDTO projectDTO) {
        CV cv = findCvById(cvId);
        cv.getProjects().add(cvMapper.toEntity(projectDTO));
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO removeProject(Long cvId, Long projectId) {
        CV cv = findCvById(cvId);
        boolean removed = cv.getProjects().removeIf(p -> p.getId().equals(projectId));
        if (!removed) {
            throw new ResourceNotFoundException("Projet", "id", projectId);
        }
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO addFormation(Long cvId, FormationDTO formationDTO) {
        CV cv = findCvById(cvId);
        cv.getFormations().add(cvMapper.toEntity(formationDTO));
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO removeFormation(Long cvId, Long formationId) {
        CV cv = findCvById(cvId);
        boolean removed = cv.getFormations().removeIf(f -> f.getId().equals(formationId));
        if (!removed) {
            throw new ResourceNotFoundException("Formation", "id", formationId);
        }
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO addLanguage(Long cvId, LanguageDTO languageDTO) {
        CV cv = findCvById(cvId);
        cv.getLanguages().add(cvMapper.toEntity(languageDTO));
        return cvMapper.toDto(cvRepository.save(cv));
    }

    @Override
    public CvDTO removeLanguage(Long cvId, Long languageId) {
        CV cv = findCvById(cvId);
        boolean removed = cv.getLanguages().removeIf(l -> l.getId().equals(languageId));
        if (!removed) {
            throw new ResourceNotFoundException("Langue", "id", languageId);
        }
        return cvMapper.toDto(cvRepository.save(cv));
    }

    private CV findCvById(Long id) {
        return cvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CV", "id", id));
    }
}
