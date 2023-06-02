package de.ude.backend.exceptions;

import com.fasterxml.jackson.core.JsonProcessingException;
import de.ude.backend.exceptions.custom_exceptions.NoUserFoundException;
import de.ude.backend.exceptions.custom_exceptions.RegistrationCodeNotValid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.ZonedDateTime;

@ControllerAdvice
@Slf4j
public class ApiExceptionHandler {

    @ExceptionHandler(value = {JsonProcessingException.class})
    public ResponseEntity<Object> handleException(JsonProcessingException e) {
        ApiErrorResponse apiException = new ApiErrorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, ZonedDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = {RegistrationCodeNotValid.class})
    public ResponseEntity<Object> handleException(RegistrationCodeNotValid e) {
        ApiErrorResponse apiException = new ApiErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, ZonedDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {NoUserFoundException.class})
    public ResponseEntity<Object> handleException(NoUserFoundException e) {
        ApiErrorResponse apiException = new ApiErrorResponse(e.getMessage(), HttpStatus.UNAUTHORIZED, ZonedDateTime.now());
        return new ResponseEntity<>(apiException, HttpStatus.UNAUTHORIZED);
    }
}
