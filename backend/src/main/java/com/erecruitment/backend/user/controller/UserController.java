package com.erecruitment.backend.user.controller;

import com.erecruitment.backend.user.dto.UserResponse;
import com.erecruitment.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }
}