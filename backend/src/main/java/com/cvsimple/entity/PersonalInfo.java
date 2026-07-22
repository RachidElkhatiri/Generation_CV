package com.cvsimple.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonalInfo {

    private String fullName;

    private String jobTitle;

    private String location;

    @Email(message = "Email invalide")
    private String email;

    private String linkedInUrl;

    private String photoUrl;
}
