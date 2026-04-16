package com.erecruitment.backend.auth.controller;

import com.erecruitment.backend.auth.dto.AuthResponse;
import com.erecruitment.backend.auth.dto.CandidateRegisterRequest;
import com.erecruitment.backend.auth.dto.LoginRequest;
import com.erecruitment.backend.auth.dto.RecruiterRegisterRequest;
import com.erecruitment.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/candidate")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerCandidate(@Valid @RequestBody CandidateRegisterRequest request) {
        return authService.registerCandidate(request);
    }

    @PostMapping("/register/recruiter")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse registerRecruiter(@Valid @RequestBody RecruiterRegisterRequest request) {
        return authService.registerRecruiter(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}