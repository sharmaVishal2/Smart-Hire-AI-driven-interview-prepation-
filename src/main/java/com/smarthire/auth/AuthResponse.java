package com.smarthire.auth;

import com.smarthire.user.UserProfileResponse;

public record AuthResponse(String token, UserProfileResponse user) {
}
