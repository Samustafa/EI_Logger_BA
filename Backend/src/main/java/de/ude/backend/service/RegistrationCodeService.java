package de.ude.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.ude.backend.model.RegistrationCode;
import de.ude.backend.service.repository.RegistrationCodeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RegistrationCodeService {

    private final RegistrationCodeRepo registrationCodeRepo;


    /**
     * Creates a number of registration codes and returns them as JSON
     *
     * @param numberOfRegistrationCodes to create
     * @return RegistrationCode as JSON String
     * @throws JsonProcessingException: if JSON could not be processed
     */
    public List<RegistrationCode> createAnonymousRegistrationCodes(int numberOfRegistrationCodes) {
        ArrayList<RegistrationCode> registrationCodes = new ArrayList<>();

        UUID uuid = UUID.randomUUID();
        for (int i = 0; i < numberOfRegistrationCodes; i++) {
            var registrationCode = new RegistrationCode(uuid.toString());
            registrationCodes.add(registrationCode);
        }
        registrationCodeRepo.saveAll(registrationCodes);
        return registrationCodes;
    }

    public boolean isRegistrationCodeExist(String id) {
        return registrationCodeRepo.existsById(id);
    }

    public void deleteRegistrationCode(String id) {
        registrationCodeRepo.deleteById(id);
    }
}
