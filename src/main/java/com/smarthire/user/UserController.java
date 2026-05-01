package com.smarthire.user;

import com.smarthire.common.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping
    UserProfileResponse me() {
        return UserProfileResponse.from(CurrentUser.get());
    }

    @PutMapping
    UserProfileResponse update(@Valid @RequestBody ProfileUpdateRequest request) {
        User user = CurrentUser.get();
        user.setName(request.name().trim());
        return UserProfileResponse.from(userRepository.save(user));
    }
}
