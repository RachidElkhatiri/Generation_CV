package com.cvsimple.config;

import com.cvsimple.entity.*;
import com.cvsimple.repository.CvRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CvRepository cvRepository;

    @Override
    public void run(String... args) {
        if (cvRepository.count() == 0) {
            CV cv = CV.builder()
                    .personalInfo(PersonalInfo.builder()
                            .fullName("RACHID ELKHATIRI")
                            .jobTitle("Développeur Full Stack Java | Angular")
                            .location("Rabat, Maroc")
                            .email("elkhatiri.rachid.div@gmail.com")
                            .linkedInUrl("https://linkedin.com/in/rachid-elkhatiri")
                            .photoUrl("media/pic1.png")
                            .build())
                    .profileSummary("Développeur Full Stack Java/Angular certifié Oracle (OCP Java 17 & 21), fort de 3 ans d'expérience dans la conception et le développement d'applications web enterprise. Maîtrise de l'écosystème Spring Boot, Angular et des bases de données Oracle/PostgreSQL. Passionné par l'architecture distribuée, les microservices et les bonnes pratiques DevOps (Docker, CI/CD). Approche agile rigoureuse pour livrer des solutions robustes et maintenables.")
                    .certifications(new ArrayList<>())
                    .skills(new ArrayList<>())
                    .experiences(new ArrayList<>())
                    .projects(new ArrayList<>())
                    .formations(new ArrayList<>())
                    .languages(new ArrayList<>())
                    .build();

            cv.getCertifications().add(Certification.builder()
                    .name("Java SE 21")
                    .description("Oracle Certified Professional (OCP) – Java SE 21 Developer")
                    .build());

            cv.getCertifications().add(Certification.builder()
                    .name("Java SE 17")
                    .description("Oracle Certified Professional (OCP) – Java SE 17 Developer")
                    .build());

            cv.getCertifications().add(Certification.builder()
                    .name("Agilité")
                    .description("Scrum Foundation Professional Certificate (SFPC)")
                    .build());

            cv.getSkills().add(Skill.builder()
                    .category("Back-end")
                    .value("Java 17/21, Spring Boot, Hibernate, Spring Security")
                    .build());

            cv.getSkills().add(Skill.builder()
                    .category("Front-end")
                    .value("Angular, TypeScript, JavaScript, Tailwind CSS")
                    .build());

            cv.getSkills().add(Skill.builder()
                    .category("Bases de données")
                    .value("Oracle, PostgreSQL, SQL Server")
                    .build());

            cv.getSkills().add(Skill.builder()
                    .category("Architecture")
                    .value("Microservices, API REST, Swagger")
                    .build());

            cv.getSkills().add(Skill.builder()
                    .category("DevOps")
                    .value("Docker, Git, GitLab CI, Jenkins")
                    .build());

            cv.getSkills().add(Skill.builder()
                    .category("Qualité")
                    .value("JUnit, Mockito, Testcontainers, TDD")
                    .build());

            cv.getExperiences().add(Experience.builder()
                    .title("Développeur Full-Stack Java / Angular")
                    .company("ADN")
                    .location("Rabat, Maroc")
                    .startDate(LocalDate.of(2024, 9, 1))
                    .endDate(null)
                    .descriptions("Développement d'applications web enterprise avec Java/Spring Boot et Angular, couvrant backend, frontend et traitements batch\nConception et implémentation d'API RESTful sécurisées avec intégration de bases de données Oracle et PostgreSQL\nMise en place de solutions de gestion documentaire, d'import massif de données et de validation métier complexe\nParticipation à une architecture distribuée scalable, assurant la fiabilité et la maintenabilité des systèmes\nCollaboration étroite avec les équipes métier pour traduire les besoins fonctionnels en solutions techniques robustes")
                    .build());

            cv.getProjects().add(Project.builder()
                    .title("Gestion des Convocations – Architecture Microservices")
                    .description("Plateforme web enterprise de gestion des convocations pour un organisme public, traitant des dizaines de milliers de dossiers. Le système centralise l'import massif de données depuis des fichiers Excel, gère l'attribution automatique des candidats selon des règles métier géographiques, et fournit un suivi en temps réel via une interface Angular moderne.")
                    .highlights("Réduction du traitement manuel de 70% grâce à l'automatisation de l'attribution des candidats\nImport et traitement de fichiers Excel de 10 000+ lignes avec validation métier en temps réel\nArchitecture microservices scalable avec API Gateway, assurant la disponibilité 24/7\nModélisation Oracle optimisée pour les requêtes complexes et les rapports géographiques")
                    .technologies("Spring Boot • Angular • Oracle • Docker • Apache POI • JPA/Hibernate")
                    .build());

            cv.getProjects().add(Project.builder()
                    .title("Moteur de Génération de PDF Bilingues")
                    .description("Microservice REST autonome pour la génération automatique de diplômes PDF bilingues (Français/Arabe) destiné à un organisme de formation. Le service a remplacé un processus manuel chronophage, réduisant le temps de production de plusieurs heures à quelques secondes par diplôme.")
                    .highlights("Génération automatique de PDF bilingues avec mise en page professionnelle et contrôle du rendu\nSécurisation des API avec Spring Security et documentation Swagger/OpenAPI pour une intégration facile\nArchitecture générique réutilisable pour d'autres types de documents (attestations, certificats)\nInterface d'administration avec Thymeleaf pour le suivi et la gestion des générations")
                    .technologies("Java 21 • Spring Boot 3 • Spring Security • Oracle • Swagger • Thymeleaf")
                    .build());

            cv.getFormations().add(Formation.builder()
                    .degree("Master en Ingénierie des Systèmes d'Information")
                    .school("Sup MTI, Rabat")
                    .startDate(LocalDate.of(2021, 9, 1))
                    .endDate(LocalDate.of(2023, 6, 30))
                    .build());

            cv.getFormations().add(Formation.builder()
                    .degree("Licence Professionnelle en IS")
                    .school("Sup MTI, Rabat")
                    .startDate(LocalDate.of(2020, 9, 1))
                    .endDate(LocalDate.of(2021, 6, 30))
                    .build());

            cv.getLanguages().add(Language.builder()
                    .name("Français")
                    .level("Courant")
                    .build());

            cv.getLanguages().add(Language.builder()
                    .name("Anglais")
                    .level("Technique")
                    .build());

            cv.getLanguages().add(Language.builder()
                    .name("Arabe")
                    .level("Natif")
                    .build());

            cvRepository.save(cv);
            log.info("CV par défaut créé avec succès (id=1)");
        }
    }
}
