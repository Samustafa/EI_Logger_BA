package de.ude.backend;

import de.ude.backend.exceptions.custom_exceptions.NoStudyFoundException;
import de.ude.backend.exceptions.custom_exceptions.NoUserFoundException;
import de.ude.backend.exceptions.custom_exceptions.RegistrationCodeNotValid;
import de.ude.backend.model.RegistrationCode;
import de.ude.backend.model.Study;
import de.ude.backend.model.User;
import de.ude.backend.model.dto.RegistrationCodeDTO;
import de.ude.backend.model.dto.UserDTO;
import de.ude.backend.service.RegistrationCodeService;
import de.ude.backend.service.StudyService;
import de.ude.backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "Requestor-Type", exposedHeaders = "X-Get-Header")
@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/logger")
public class BackendController {

    private final UserService userService;
    private final RegistrationCodeService registrationCodeService;
    private final StudyService studyService;

    @PostMapping("/registerUser/{registrationCode}")
    public ResponseEntity<UserDTO> registerUser(@PathVariable String registrationCode) throws RegistrationCodeNotValid {
        String studyId = registrationCodeService.getStudyIdByRegistrationCode(registrationCode);
        registrationCodeService.deleteRegistrationCode(registrationCode);

        User user = userService.registerUser(studyId);
        UserDTO userDTO = new UserDTO(user.getUserId());

        log.info("registerNewUserIfRegistrationCodeIsValid(): User added: " + user.getUserId());
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/authenticateUser/{userId}")
    public HttpStatus authenticateUser(@PathVariable String userId) {
        if (userService.userExists(userId)) {
            log.info("authenticateUSer(): User authenticated: " + userId);
            return HttpStatus.OK;
        } else {
            throw new NoUserFoundException("User not found.");
        }
    }

    @GetMapping("/createAnonymousRegistrationCodes/{studyId}/{numberOfRegistrationCodes}")
    public ResponseEntity<List<RegistrationCodeDTO>> createAnonymousRegistrationCodes(@PathVariable int numberOfRegistrationCodes, @PathVariable String studyId) {
        if (!studyService.doesStudyExist(studyId))
            throw new NoStudyFoundException("Study with ID " + studyId + " not found.");

        List<RegistrationCode> registrationCodes = registrationCodeService.createAnonymousRegistrationCodes(numberOfRegistrationCodes, studyId);
        List<RegistrationCodeDTO> registrationCodeDTOs = registrationCodeService.convertRegistrationCodesToDTOs(registrationCodes);

        log.info("Created {} pending users: {}.", numberOfRegistrationCodes, registrationCodeDTOs);
        return new ResponseEntity<>(registrationCodeDTOs, HttpStatus.OK);
    }

    @GetMapping("/createUsers/{studyId}/{numberOfUsers}")
    public ResponseEntity<List<UserDTO>> createdUserIds(@PathVariable int numberOfUsers, @PathVariable String studyId) {
        if (!studyService.doesStudyExist(studyId))
            throw new NoStudyFoundException("Study with ID " + studyId + " not found.");

        List<User> users = userService.createUserIds(numberOfUsers, studyId);
        List<UserDTO> userDTOs = userService.convertUsersToDTOs(users);

        log.info("Created {} new users: {}.", numberOfUsers, userDTOs);
        return new ResponseEntity<>(userDTOs, HttpStatus.OK);
    }

    @PostMapping("/createStudy")
    public ResponseEntity<Study> createStudy(@RequestBody Study study) {
        return new ResponseEntity<>(studyService.createStudy(study), HttpStatus.OK);
    }

    @DeleteMapping("/deleteAllStudies")
    public void deleteAllStudies() {
        studyService.deleteAllStudies();
    }

    @GetMapping("/getStudy/{userId}")
    public ResponseEntity<Study> getStudy(@PathVariable String userId) throws NoUserFoundException, NoStudyFoundException {
        String studyId = userService.getStudyIdByUserId(userId);
        Study study = studyService.getStudyByStudyId(studyId);
        return new ResponseEntity<>(study, HttpStatus.OK);
    }
}

