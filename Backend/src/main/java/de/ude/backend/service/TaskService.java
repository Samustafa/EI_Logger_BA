package de.ude.backend.service;


import de.ude.backend.model.Task;
import de.ude.backend.service.repository.TaskRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepo taskRepo;

    public void createTask(Task task) {
        taskRepo.save(task);
    }

}
