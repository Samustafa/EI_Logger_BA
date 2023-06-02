package de.ude.backend.model.questions;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString
@Document(collection = "Questions")
@TypeAlias("RangeQuestion")
public class RangeQuestion extends Question {

    @NonNull
    private Integer range;

    /**
     * @param questionText the question text
     * @param range        the range of the answer. e.g. 5 -> then the representation will be from 1 to 5
     */
    public RangeQuestion(@NonNull String questionText, @NonNull Integer range) {
        super(questionText);
        this.range = range;
    }
}
