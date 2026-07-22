package com.cvsimple.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    private String highlights;

    private String technologies;
}
