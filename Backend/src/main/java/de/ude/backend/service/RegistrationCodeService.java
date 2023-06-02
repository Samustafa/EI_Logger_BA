package de.ude.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.ude.backend.model.RegistrationCode;
import de.ude.backend.service.repository.RegistrationCodeRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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
    public String createRegistrationCode(int numberOfRegistrationCodes) throws JsonProcessingException {
        ArrayList<RegistrationCode> registrationCodes = new ArrayList<>();
        for (int i = 0; i < numberOfRegistrationCodes; i++) {
            registrationCodes.add(Utils.createUniversillyUniqueRegistrationCode());
        }
        registrationCodeRepo.saveAll(registrationCodes);
        return Utils.mapRegistrationCodeToJSON(registrationCodes);
    }

    public boolean isRegistrationCodeExist(String id) {
        return registrationCodeRepo.existsById(id);
    }

    public void deleteRegistrationCode(String id) {
        registrationCodeRepo.deleteById(id);
    }
}
