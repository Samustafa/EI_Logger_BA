package de.ude.backend.model.questions;


import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "Questions")
@TypeAlias("TextQuestion")
public class TextQuestion extends Question {
    @NonNull
    private Integer maxCharacters;

    public TextQuestion(@NonNull String questionText, @NonNull Integer maxCharacters) {
        super(questionText);
        setMaxCharacters(maxCharacters);
    }

    public void setMaxCharacters(Integer maxCharacters) {
        if (maxCharacters < 0) {
            this.maxCharacters = 1000;
        } else {
            this.maxCharacters = maxCharacters;
        }
    }
}
