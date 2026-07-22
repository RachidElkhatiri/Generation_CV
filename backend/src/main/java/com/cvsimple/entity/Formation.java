package com.cvsimple.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "formations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le diplôme est obligatoire")
    @Column(nullable = false)
    private String degree;

    @NotBlank(message = "L'établissement est obligatoire")
    @Column(nullable = false)
    private String school;

    private LocalDate startDate;

    private LocalDate endDate;
}
