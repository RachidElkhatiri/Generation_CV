package com.cvsimple.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "certifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la certification est obligatoire")
    @Column(nullable = false)
    private String name;

    private String description;
}
