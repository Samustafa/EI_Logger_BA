package de.ude.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.ude.backend.model.RegistrationCode;

import java.util.List;

public final class Utils {

    private Utils() {
    }


    public static String mapRegistrationCodeToJSON(List<RegistrationCode> registrationCodes) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(registrationCodes);
    }
}
