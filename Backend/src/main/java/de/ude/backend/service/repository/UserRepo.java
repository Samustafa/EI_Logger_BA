package de.ude.backend.service.repository;

import de.ude.backend.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends CrudRepository<User, String> {
}
