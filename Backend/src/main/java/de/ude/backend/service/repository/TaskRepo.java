package de.ude.backend.service.repository;

import de.ude.backend.model.Task;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepo extends CrudRepository<Task, String> {
}
