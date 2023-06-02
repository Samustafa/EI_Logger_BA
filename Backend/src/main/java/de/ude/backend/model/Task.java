package de.ude.backend.model;

import de.ude.backend.model.questions.Question;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@Document(collection = "Tasks")
public class Task {
    @Id
    private String taskId;
    @NonNull
    private String text;
    private List<Question> preQuestions;
    private List<Question> postQuestions;
    private boolean hasPreQuestionnaire;
    private boolean hasPostQuestionnaire;

    public Task(@NonNull String text, List<Question> preQuestions, List<Question> postQuestions) {
        this.text = text;
        this.preQuestions = preQuestions;
        this.postQuestions = postQuestions;
        this.hasPreQuestionnaire = preQuestions != null && !preQuestions.isEmpty();
        this.hasPostQuestionnaire = postQuestions != null && !postQuestions.isEmpty();
    }

}
