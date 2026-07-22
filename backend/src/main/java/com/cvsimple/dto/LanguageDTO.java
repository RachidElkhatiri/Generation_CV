package com.cvsimple.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LanguageDTO {

    private Long id;

    @NotBlank(message = "Le nom de la langue est obligatoire")
    private String name;

    @NotBlank(message = "Le niveau est obligatoire")
    private String level;
}
