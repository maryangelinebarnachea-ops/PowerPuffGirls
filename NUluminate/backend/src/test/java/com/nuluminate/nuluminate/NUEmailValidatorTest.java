package com.nuluminate.nuluminate;
import com.nuluminate.nuluminate.validator.NUEmailValidator;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class NUEmailValidatorTest {
    private final NUEmailValidator validator = new NUEmailValidator();
    @Test
    void validStudentEmail_shouldReturnTrue() {
        assertTrue(validator.isValid("student@student.nu-laguna.edu.ph"));
    }
    @Test
    void gmailEmail_shouldReturnFalse() {
        assertFalse(validator.isValid("student@gmail.com"));
    }
    @Test
    void nullEmail_shouldReturnFalse() {
        assertFalse(validator.isValid(null));
    }
    @Test
    void emptyEmail_shouldReturnFalse() {
        assertFalse(validator.isValid(""));
    }
}
