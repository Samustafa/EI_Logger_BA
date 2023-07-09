package de.ude.backend.service;

import de.ude.backend.exceptions.custom_exceptions.NoUserFoundException;
import de.ude.backend.model.User;
import de.ude.backend.model.dto.UserDTO;
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
    public User registerUser(String studyId) {
        UUID uuid = UUID.randomUUID();
        User user = new User(uuid.toString(), studyId);

        userRepo.save(user);
        return user;
    }

    public List<User> createUserIds(int numberOfUsers, String studyId) {
        ArrayList<User> users = new ArrayList<>();

        for (int i = 0; i < numberOfUsers; i++) {
            UUID uuid = UUID.randomUUID();
            User user = new User(uuid.toString(), studyId);
            users.add(user);
        }

        userRepo.saveAll(users);
        return users;
    }

    public boolean userExists(String userId) {
        return userRepo.existsById(userId);
    }

    public List<UserDTO> convertUsersToDTOs(List<User> users) {

        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            userDTOs.add(new UserDTO(user.getUserId()));
        }
        return userDTOs;
    }

    public String getStudyIdByUserId(String userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new NoUserFoundException("User not found"));
        return user.getStudyId();
    }
}

