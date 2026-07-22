package com.cvsimple.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "languages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la langue est obligatoire")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Le niveau est obligatoire")
    @Column(nullable = false)
    private String level;
}
