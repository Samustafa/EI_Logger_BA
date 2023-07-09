package de.ude.backend.exceptions.custom_exceptions;

public class NoStudyFoundException extends RuntimeException {
    public NoStudyFoundException(String message) {
        super(message);
    }
}
