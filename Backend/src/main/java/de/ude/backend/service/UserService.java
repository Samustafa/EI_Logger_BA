package de.ude.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.ude.backend.model.User;
import de.ude.backend.service.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
        User user = Utils.createUniversillayUniqueUser();
        userRepo.save(user);
        return Utils.mapUserToJSON(user);
    }
    public List<String> createUserIds(int numberOfUsers) throws JsonProcessingException {
        ArrayList<String> userIds = new ArrayList<>();

        for (int i = 0; i < numberOfUsers; i++) {
            String user = registerUser();
            userIds.add(user);
        }
        return userIds;
    }

    public boolean userExists(String userId) {
        return userRepo.existsById(userId);
    }
}

