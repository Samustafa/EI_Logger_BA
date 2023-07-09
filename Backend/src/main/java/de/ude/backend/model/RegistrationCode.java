package de.ude.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@ToString
@Document(collection = "registrationCodes")
public class RegistrationCode {
    @NonNull
    @Id
    private final String code;
    @NonNull
    private final String studyId;
}
