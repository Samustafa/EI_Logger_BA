package de.ude.backend.model.questions;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = MultipleChoiceQuestion.class, name = "MultipleChoiceQuestion"),
        @JsonSubTypes.Type(value = RangeQuestion.class, name = "RangeQuestion"),
        @JsonSubTypes.Type(value = TextQuestion.class, name = "TextQuestion")
})
@Document(collection = "Questions")
@RequiredArgsConstructor
@TypeAlias("Question")
public abstract class Question {
    @Id
    private String questionId;
    @NonNull
    private final String questionText;

}
