package de.ude.backend.exceptions.custom_exceptions;

public class RegistrationCodeNotValid extends RuntimeException {
    public RegistrationCodeNotValid(String message) {
        super(message);
    }
}
