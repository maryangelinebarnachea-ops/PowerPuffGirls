package com.nuluminate.nuluminate.validator;

import org.springframework.stereotype.Component;

@Component
public class NUEmailValidator implements EmailValidator {

    private static final String ALLOWED_DOMAIN = "@student.nu-laguna.edu.ph";

    @Override
    public boolean isValid(String email) {
        return email != null && email.endsWith(ALLOWED_DOMAIN);
    }
}
