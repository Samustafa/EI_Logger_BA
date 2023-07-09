package de.ude.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@AllArgsConstructor
@Document(collection = "Users")
public class User {
    @NonNull
    @Id
    private final String userId;
    @NonNull
    private String studyId;
}
