package de.ude.backend.exceptions.custom_exceptions;

public class NoUserFoundException extends RuntimeException {
    public NoUserFoundException(String message) {
        super(message);
    }
}
