package de.ude.backend.service.repository;

import de.ude.backend.model.RegistrationCode;
import org.springframework.data.repository.CrudRepository;

public interface RegistrationCodeRepo extends CrudRepository<RegistrationCode, String> {
}
