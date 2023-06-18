package de.ude.backend;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.ude.backend.exceptions.custom_exceptions.NoUserFoundException;
import de.ude.backend.exceptions.custom_exceptions.RegistrationCodeNotValid;
import de.ude.backend.model.Study;
import de.ude.backend.service.RegistrationCodeService;
import de.ude.backend.service.StudyService;
import de.ude.backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping("/logger")
public class BackendController {

    private final UserService userService;
    private final RegistrationCodeService registrationCodeService;
    private final StudyService studyService;

    @PostMapping("/registerUser/{registrationCode}")
    public ResponseEntity<String> registerUser(@PathVariable String registrationCode) throws RegistrationCodeNotValid, JsonProcessingException {
        if (!registrationCodeService.isRegistrationCodeExist(registrationCode))
            throw new RegistrationCodeNotValid("Registration Code not valid.");

        registrationCodeService.deleteRegistrationCode(registrationCode);
        String userJson = userService.registerUser();

        log.info("registerNewUserIfRegistrationCodeIsValid(): User added: " + userJson);
        return new ResponseEntity<>(userJson, HttpStatus.OK);
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

    @GetMapping("/createAnonymousRegistrationCodes/{numberOfRegistrationCodes}")
    public ResponseEntity<String> createAnonymousRegistrationCodes(@PathVariable int numberOfRegistrationCodes) throws JsonProcessingException {
        String userJson = registrationCodeService.createAnonymousRegistrationCodes(numberOfRegistrationCodes);
        log.info("Created {} pending users: {}.", numberOfRegistrationCodes, userJson);
        return new ResponseEntity<>(userJson, HttpStatus.OK);
    }

    @GetMapping("/createUsers/{numberOfUsers}")
    public ResponseEntity<List<String>> createdUserIds(@PathVariable int numberOfUsers) throws JsonProcessingException {
        ArrayList<String> users = (ArrayList<String>) userService.createUserIds(numberOfUsers);

        log.info("Created {} new users: {}.", numberOfUsers, users);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @PostMapping("/createStudy")
    public ResponseEntity<Study> createStudy(@RequestBody Study study) {
        return new ResponseEntity<>(studyService.createStudy(study), HttpStatus.OK);
    }

    @DeleteMapping("/deleteAllStudies")
    public void deleteAllStudies() {
        studyService.deleteAllStudies();
    }

    @GetMapping("/getTestStudy")
    public ResponseEntity<Study> getTestStudy() {
        return new ResponseEntity<>(studyService.getTestStudy(), HttpStatus.OK);
    }
}

