package com.cvsimple.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CertificationDTO {

    private Long id;

    @NotBlank(message = "Le nom de la certification est obligatoire")
    private String name;

    private String description;
}
