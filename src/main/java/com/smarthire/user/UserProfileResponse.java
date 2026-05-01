package com.smarthire.user;

public record UserProfileResponse(Long id, String name, String email) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail());
    }
}
