package com.cvsimple.dto;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalInfoDTO {

    private String fullName;

    private String jobTitle;

    private String location;

    @Email(message = "Email invalide")
    private String email;

    private String linkedInUrl;

    private String photoUrl;
}
