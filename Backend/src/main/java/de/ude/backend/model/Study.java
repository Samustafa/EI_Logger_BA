package de.ude.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "Studies")
public class Study {
    @Id
    private String studyId;

    //@Indexed(unique = true)
    private String name;

    private boolean hasDemographics;

    @NonNull
    private List<Task> tasks;
}
