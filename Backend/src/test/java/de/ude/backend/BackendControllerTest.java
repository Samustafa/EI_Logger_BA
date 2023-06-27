package de.ude.backend;

import de.ude.backend.exceptions.custom_exceptions.NoUserFoundException;
import de.ude.backend.exceptions.custom_exceptions.RegistrationCodeNotValid;
import de.ude.backend.model.RegistrationCode;
import de.ude.backend.model.Study;
import de.ude.backend.model.User;
import de.ude.backend.service.RegistrationCodeService;
import de.ude.backend.service.StudyService;
import de.ude.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BackendControllerTest {

    private BackendController backendController;

    @Mock
    private UserService userService;

    @Mock
    private RegistrationCodeService registrationCodeService;

    @Mock
    private StudyService studyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        backendController = new BackendController(userService, registrationCodeService, studyService);
    }

    @Test
    void registerUser_ValidRegistrationCode_ShouldReturnUserWithHttpStatusOK() throws RegistrationCodeNotValid {
        // Arrange
        String registrationCode = "validRegistrationCode";
        User expectedUser = new User("userId");
        when(registrationCodeService.isRegistrationCodeExist(registrationCode)).thenReturn(true);
        when(userService.registerUser()).thenReturn(expectedUser);

        // Act
        ResponseEntity<User> response = backendController.registerUser(registrationCode);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedUser, response.getBody());
        verify(registrationCodeService).deleteRegistrationCode(registrationCode);
        verify(userService).registerUser();
    }

    @Test
    void registerUser_InvalidRegistrationCode_ShouldThrowRegistrationCodeNotValidException() {
        // Arrange
        String registrationCode = "invalidRegistrationCode";
        when(registrationCodeService.isRegistrationCodeExist(registrationCode)).thenReturn(false);

        // Act and Assert
        assertThrows(RegistrationCodeNotValid.class, () -> backendController.registerUser(registrationCode));
        verify(registrationCodeService, never()).deleteRegistrationCode(registrationCode);
        verify(userService, never()).registerUser();
    }

    @Test
    void authenticateUser_ExistingUserId_ShouldReturnHttpStatusOK() {
        // Arrange
        String userId = "existingUserId";
        when(userService.userExists(userId)).thenReturn(true);

        // Act
        HttpStatus response = backendController.authenticateUser(userId);

        // Assert
        assertEquals(HttpStatus.OK, response);
        verify(userService).userExists(userId);
    }

    @Test
    void authenticateUser_NonExistingUserId_ShouldThrowNoUserFoundException() {
        // Arrange
        String userId = "nonExistingUserId";
        when(userService.userExists(userId)).thenReturn(false);

        // Act and Assert
        assertThrows(NoUserFoundException.class, () -> backendController.authenticateUser(userId));
        verify(userService).userExists(userId);
    }

    @Test
    void createAnonymousRegistrationCodes_ValidNumberOfRegistrationCodes_ShouldReturnRegistrationCodesWithHttpStatusOK() {
        // Arrange
        int numberOfRegistrationCodes = 5;
        List<RegistrationCode> expectedRegistrationCodes = new ArrayList<>();
        when(registrationCodeService.createAnonymousRegistrationCodes(numberOfRegistrationCodes)).thenReturn(expectedRegistrationCodes);

        // Act
        ResponseEntity<List<RegistrationCode>> response = backendController.createAnonymousRegistrationCodes(numberOfRegistrationCodes);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedRegistrationCodes, response.getBody());
        verify(registrationCodeService).createAnonymousRegistrationCodes(numberOfRegistrationCodes);
    }

    @Test
    void createUsers_ValidNumberOfUsers_ShouldReturnUsersWithHttpStatusOK() {
        // Arrange
        int numberOfUsers = 5;
        List<User> expectedUsers = new ArrayList<>();
        when(userService.createUserIds(numberOfUsers)).thenReturn(expectedUsers);

        // Act
        ResponseEntity<List<User>> response = backendController.createdUserIds(numberOfUsers);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedUsers, response.getBody());
        verify(userService).createUserIds(numberOfUsers);
    }

    @Test
    void createStudy_ValidStudyObject_ShouldReturnStudyWithHttpStatusOK() {
        // Arrange
        Study study = new Study("studyId", "studyName", true, new ArrayList<>());
        when(studyService.createStudy(study)).thenReturn(study);

        // Act
        ResponseEntity<Study> response = backendController.createStudy(study);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(study, response.getBody());
        verify(studyService).createStudy(study);
    }

    @Test
    void deleteAllStudies_ShouldCallDeleteAllStudiesInStudyService() {
        // Act
        backendController.deleteAllStudies();

        // Assert
        verify(studyService).deleteAllStudies();
    }

    @Test
    void getTestStudy_ShouldReturnTestStudyWithHttpStatusOK() {
        // Arrange
        Study testStudy = new Study("studyId", "studyName", true, new ArrayList<>());
        when(studyService.getTestStudy()).thenReturn(testStudy);

        // Act
        ResponseEntity<Study> response = backendController.getTestStudy();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testStudy, response.getBody());
        verify(studyService).getTestStudy();
    }
}
