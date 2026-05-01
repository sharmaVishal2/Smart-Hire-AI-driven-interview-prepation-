package com.smarthire.common;

import com.smarthire.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {
    private CurrentUser() {
    }

    public static User get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new AppException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return user;
    }
}
