package de.ude.backend.service;

import de.ude.backend.exceptions.custom_exceptions.RegistrationCodeNotValid;
import de.ude.backend.model.DTO.RegistrationCodeDTO;
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
     */
    public List<RegistrationCode> createAnonymousRegistrationCodes(int numberOfRegistrationCodes, String studyName) {
        ArrayList<RegistrationCode> registrationCodes = new ArrayList<>();

        for (int i = 0; i < numberOfRegistrationCodes; i++) {
            UUID uuid = UUID.randomUUID();
            var registrationCode = new RegistrationCode(uuid.toString(), studyName);
            registrationCodes.add(registrationCode);
        }

        registrationCodeRepo.saveAll(registrationCodes);
        return registrationCodes;
    }

    public void deleteRegistrationCode(String id) {
        registrationCodeRepo.deleteById(id);
    }

    public List<RegistrationCodeDTO> convertRegistrationCodesToDTOs(List<RegistrationCode> registrationCodes) {
        ArrayList<RegistrationCodeDTO> registrationCodeDTOs = new ArrayList<>();

        for (RegistrationCode registrationCode : registrationCodes) {
            registrationCodeDTOs.add(new RegistrationCodeDTO(registrationCode.getCode()));
        }

        return registrationCodeDTOs;
    }

    public String getStudyIdByRegistrationCode(String registrationCode) throws RegistrationCodeNotValid {
        RegistrationCode code = registrationCodeRepo.findById(registrationCode).orElseThrow(() -> new RegistrationCodeNotValid("Registration code not found"));
        System.out.println("passed first");
        System.out.println(code.toString());
        return code.getStudyId();
    }
}
