package de.ude.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.ude.backend.model.User;
import de.ude.backend.service.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepo userRepo;

    /**
     * Registers a new user and returns the user as JSON
     *
     * @return User as JSON String
     */
    public String registerUser() throws JsonProcessingException {
        UUID uuid = UUID.randomUUID();
        User user = new User(uuid.toString());

        userRepo.save(user);
        return Utils.mapUserToJSON(user);
    }

    public List<User> createUserIds(int numberOfUsers) {
        ArrayList<User> users = new ArrayList<>();
        UUID uuid = UUID.randomUUID();

        for (int i = 0; i < numberOfUsers; i++) {
            User user = new User(uuid.toString());
            users.add(user);
        }
        userRepo.saveAll(users);
        return users;
    }

    public boolean userExists(String userId) {
        return userRepo.existsById(userId);
    }
}

