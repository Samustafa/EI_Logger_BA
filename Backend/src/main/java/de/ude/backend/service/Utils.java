package de.ude.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.ude.backend.model.RegistrationCode;
import de.ude.backend.model.User;

import java.util.List;
import java.util.UUID;

public final class Utils {

    private Utils() {
    }

    public static User createUniversillayUniqueUser() {
        UUID uuid = UUID.randomUUID();
        return new User(uuid.toString());
    }

    public static String mapUserToJSON(User user) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(user);
    }

    public static RegistrationCode createUniversillyUniqueRegistrationCode() {
        UUID uuid = UUID.randomUUID();
        return new RegistrationCode(uuid.toString());
    }

    public static String mapRegistrationCodeToJSON(List<RegistrationCode> registrationCodes) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(registrationCodes);
    }
}
