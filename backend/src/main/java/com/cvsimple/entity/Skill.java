package com.cvsimple.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La catégorie est obligatoire")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "La valeur est obligatoire")
    @Column(name = "skill_value", nullable = false, columnDefinition = "CLOB")
    private String value;
}
