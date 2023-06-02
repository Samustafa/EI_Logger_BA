package de.ude.backend.model.questions;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "Questions")
@TypeAlias("MultipleChoiceQuestion")
public class MultipleChoiceQuestion extends Question {

    @NonNull
    private String[] choices;

    public MultipleChoiceQuestion(@NonNull String questionText, @NonNull String[] choices) {
        super(questionText);
        this.choices = choices;
    }

}
