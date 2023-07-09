package de.ude.backend;

import de.ude.backend.exceptions.custom_exceptions.NoStudyFoundException;
import de.ude.backend.exceptions.custom_exceptions.NoUserFoundException;
import de.ude.backend.exceptions.custom_exceptions.RegistrationCodeNotValid;
import de.ude.backend.model.DTO.RegistrationCodeDTO;
import de.ude.backend.model.DTO.UserDTO;
import de.ude.backend.model.RegistrationCode;
import de.ude.backend.model.Study;
import de.ude.backend.model.User;
import de.ude.backend.service.RegistrationCodeService;
import de.ude.backend.service.StudyService;
import de.ude.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class BackendControllerTest {
    @Mock
    private UserService userService;

    @Mock
    private RegistrationCodeService registrationCodeService;

    @Mock
    private StudyService studyService;

    @InjectMocks
    private BackendController backendController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() throws RegistrationCodeNotValid {
        String registrationCode = "abc123";
        String studyId = "study123";
        User user = new User("user123", studyId);
        UserDTO expectedUserDTO = new UserDTO("user123");

        when(registrationCodeService.getStudyIdByRegistrationCode(registrationCode)).thenReturn(studyId);
        when(userService.registerUser(studyId)).thenReturn(user);

        ResponseEntity<UserDTO> responseEntity = backendController.registerUser(registrationCode);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedUserDTO.getUserId(), Objects.requireNonNull(responseEntity.getBody()).getUserId());
        verify(registrationCodeService, times(1)).deleteRegistrationCode(registrationCode);
        verify(userService, times(1)).registerUser(studyId);
    }

    @Test
    void testAuthenticateUser_UserExists() {
        String userId = "user123";

        when(userService.userExists(userId)).thenReturn(true);

        HttpStatus status = backendController.authenticateUser(userId);

        assertEquals(HttpStatus.OK, status);
        verify(userService, times(1)).userExists(userId);
    }

    @Test
    void testAuthenticateUser_UserNotFound() {
        String userId = "user123";

        when(userService.userExists(userId)).thenReturn(false);

        NoUserFoundException exception =
                org.junit.jupiter.api.Assertions.assertThrows(NoUserFoundException.class, () -> {
                    backendController.authenticateUser(userId);
                });

        assertEquals("User not found.", exception.getMessage());
        verify(userService, times(1)).userExists(userId);
    }

    @Test
    void testCreateAnonymousRegistrationCodes_StudyExists() {
        int numberOfRegistrationCodes = 5;
        String studyId = "study123";
        List<RegistrationCode> registrationCodes = Arrays.asList(new RegistrationCode("code1", studyId), new RegistrationCode("code2", studyId));
        List<RegistrationCodeDTO> expectedDTOs = Arrays.asList(new RegistrationCodeDTO("code1"), new RegistrationCodeDTO("code2"));

        when(studyService.doesStudyExist(studyId)).thenReturn(true);
        when(registrationCodeService.createAnonymousRegistrationCodes(numberOfRegistrationCodes, studyId))
                .thenReturn(registrationCodes);
        when(registrationCodeService.convertRegistrationCodesToDTOs(registrationCodes)).thenReturn(expectedDTOs);

        ResponseEntity<List<RegistrationCodeDTO>> responseEntity =
                backendController.createAnonymousRegistrationCodes(numberOfRegistrationCodes, studyId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedDTOs, responseEntity.getBody());
        verify(studyService, times(1)).doesStudyExist(studyId);
        verify(registrationCodeService, times(1)).createAnonymousRegistrationCodes(numberOfRegistrationCodes, studyId);
        verify(registrationCodeService, times(1)).convertRegistrationCodesToDTOs(registrationCodes);
    }

    @Test
    void testCreateAnonymousRegistrationCodes_StudyNotFound() {
        int numberOfRegistrationCodes = 5;
        String studyId = "study123";

        when(studyService.doesStudyExist(studyId)).thenReturn(false);

        NoStudyFoundException exception =
                org.junit.jupiter.api.Assertions.assertThrows(NoStudyFoundException.class, () -> {
                    backendController.createAnonymousRegistrationCodes(numberOfRegistrationCodes, studyId);
                });

        assertEquals("Study with ID " + studyId + " not found.", exception.getMessage());
        verify(studyService, times(1)).doesStudyExist(studyId);
        verify(registrationCodeService, never()).createAnonymousRegistrationCodes(anyInt(), anyString());
        verify(registrationCodeService, never()).convertRegistrationCodesToDTOs(anyList());
    }

    @Test
    void testCreateUsers_StudyExists() {
        int numberOfUsers = 5;
        String studyId = "study123";
        List<User> users = Arrays.asList(new User("user1", studyId), new User("user2", studyId));
        List<UserDTO> expectedDTOs = Arrays.asList(new UserDTO("user1"), new UserDTO("user2"));

        when(studyService.doesStudyExist(studyId)).thenReturn(true);
        when(userService.createUserIds(numberOfUsers, studyId)).thenReturn(users);
        when(userService.convertUsersToDTOs(users)).thenReturn(expectedDTOs);

        ResponseEntity<List<UserDTO>> responseEntity =
                backendController.createdUserIds(numberOfUsers, studyId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedDTOs, responseEntity.getBody());
        verify(studyService, times(1)).doesStudyExist(studyId);
        verify(userService, times(1)).createUserIds(numberOfUsers, studyId);
        verify(userService, times(1)).convertUsersToDTOs(users);
    }

    @Test
    void testCreateUsers_StudyNotFound() {
        int numberOfUsers = 5;
        String studyId = "study123";

        when(studyService.doesStudyExist(studyId)).thenReturn(false);

        NoStudyFoundException exception =
                org.junit.jupiter.api.Assertions.assertThrows(NoStudyFoundException.class, () -> {
                    backendController.createdUserIds(numberOfUsers, studyId);
                });

        assertEquals("Study with ID " + studyId + " not found.", exception.getMessage());
        verify(studyService, times(1)).doesStudyExist(studyId);
        verify(userService, never()).createUserIds(anyInt(), anyString());
        verify(userService, never()).convertUsersToDTOs(anyList());
    }

    @Test
    void testCreateStudy() {
        Study study = new Study("studyId", "studyName", true, new ArrayList<>());
        ResponseEntity<Study> expectedResponseEntity = new ResponseEntity<>(study, HttpStatus.OK);

        when(studyService.createStudy(study)).thenReturn(study);

        ResponseEntity<Study> responseEntity = backendController.createStudy(study);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(expectedResponseEntity.getBody(), responseEntity.getBody());
        verify(studyService, times(1)).createStudy(study);
    }

    @Test
    void testDeleteAllStudies() {
        backendController.deleteAllStudies();
        verify(studyService, times(1)).deleteAllStudies();
    }

    @Test
    void testGetStudy_UserAndStudyExist() throws NoUserFoundException, NoStudyFoundException {
        String userId = "user123";
        String studyId = "study123";
        Study study = new Study("studyId", "studyName", true, new ArrayList<>());

        when(userService.getStudyIdByUserId(userId)).thenReturn(studyId);
        when(studyService.getStudyByStudyId(studyId)).thenReturn(study);

        ResponseEntity<Study> responseEntity = backendController.getStudy(userId);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(study, responseEntity.getBody());
        verify(userService, times(1)).getStudyIdByUserId(userId);
        verify(studyService, times(1)).getStudyByStudyId(studyId);
    }

    @Test
    void testGetStudy_UserNotFound() throws NoUserFoundException, NoStudyFoundException {
        String userId = "user123";

        when(userService.getStudyIdByUserId(userId)).thenThrow(new NoUserFoundException("User not found."));

        NoUserFoundException exception =
                org.junit.jupiter.api.Assertions.assertThrows(NoUserFoundException.class, () -> {
                    backendController.getStudy(userId);
                });

        assertEquals("User not found.", exception.getMessage());
        verify(userService, times(1)).getStudyIdByUserId(userId);
        verify(studyService, never()).getStudyByStudyId(anyString());
    }

    @Test
    void testGetStudy_StudyNotFound() throws NoUserFoundException, NoStudyFoundException {
        String userId = "user123";
        String studyId = "study123";

        when(userService.getStudyIdByUserId(userId)).thenReturn(studyId);
        when(studyService.getStudyByStudyId(studyId)).thenThrow(new NoStudyFoundException("Study not found."));

        NoStudyFoundException exception =
                org.junit.jupiter.api.Assertions.assertThrows(NoStudyFoundException.class, () -> {
                    backendController.getStudy(userId);
                });

        assertEquals("Study not found.", exception.getMessage());
        verify(userService, times(1)).getStudyIdByUserId(userId);
        verify(studyService, times(1)).getStudyByStudyId(studyId);
    }
}

