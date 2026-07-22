package com.cvsimple.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "CLOB")
    private String description;

    @Column(columnDefinition = "CLOB")
    private String highlights;

    private String technologies;
}
