package com.erecruitment.backend.user.controller;

import com.erecruitment.backend.user.dto.UserResponse;
import com.erecruitment.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // TEMPORARY: simulate authenticated user via header
    @GetMapping("/me")
    public UserResponse getCurrentUser(@RequestHeader("X-USER-EMAIL") String email) {
        return userService.getUserByEmail(email);
    }
}