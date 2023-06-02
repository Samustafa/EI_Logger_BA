package de.ude.backend.service.repository;

import de.ude.backend.model.Study;
import org.springframework.data.repository.CrudRepository;

public interface StudyRepo extends CrudRepository<Study, String> {
}
