package com.cvsimple.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalInfoDTO {

    @NotBlank(message = "Le nom complet est obligatoire")
    private String fullName;

    @NotBlank(message = "Le titre du poste est obligatoire")
    private String jobTitle;

    private String location;

    @Email(message = "Email invalide")
    private String email;

    private String linkedInUrl;

    private String photoUrl;
}
