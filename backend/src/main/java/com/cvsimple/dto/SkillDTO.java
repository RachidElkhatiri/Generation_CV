package com.cvsimple.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillDTO {

    private Long id;

    @NotBlank(message = "La catégorie est obligatoire")
    private String category;

    @NotBlank(message = "La valeur est obligatoire")
    private String value;
}
