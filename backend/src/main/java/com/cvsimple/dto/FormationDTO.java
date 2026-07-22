package com.cvsimple.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FormationDTO {

    private Long id;

    @NotBlank(message = "Le diplôme est obligatoire")
    private String degree;

    @NotBlank(message = "L'établissement est obligatoire")
    private String school;

    private LocalDate startDate;

    private LocalDate endDate;
}
