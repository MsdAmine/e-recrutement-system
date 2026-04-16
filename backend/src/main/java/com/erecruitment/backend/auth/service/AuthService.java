package com.erecruitment.backend.auth.service;

import com.erecruitment.backend.auth.dto.AuthResponse;
import com.erecruitment.backend.auth.dto.CandidateRegisterRequest;
import com.erecruitment.backend.auth.dto.LoginRequest;
import com.erecruitment.backend.auth.dto.RecruiterRegisterRequest;
import com.erecruitment.backend.candidate.entity.CandidateProfile;
import com.erecruitment.backend.candidate.repository.CandidateProfileRepository;
import com.erecruitment.backend.common.enums.RoleName;
import com.erecruitment.backend.common.exception.EmailAlreadyExistsException;
import com.erecruitment.backend.common.exception.InvalidCredentialsException;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.recruiter.entity.RecruiterProfile;
import com.erecruitment.backend.recruiter.repository.RecruiterProfileRepository;
import com.erecruitment.backend.user.entity.Role;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.RoleRepository;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse registerCandidate(CandidateRegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email is already in use.");
        }

        Role candidateRole = roleRepository.findByName(RoleName.ROLE_CANDIDATE)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate role not found."));

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(candidateRole)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        CandidateProfile candidateProfile = CandidateProfile.builder()
                .user(savedUser)
                .build();

        candidateProfileRepository.save(candidateProfile);

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getName().name())
                .message("Candidate registered successfully.")
                .build();
    }

    public AuthResponse registerRecruiter(RecruiterRegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email is already in use.");
        }

        Role recruiterRole = roleRepository.findByName(RoleName.ROLE_RECRUITER)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter role not found."));

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(recruiterRole)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        RecruiterProfile recruiterProfile = RecruiterProfile.builder()
                .user(savedUser)
                .companyName(request.companyName())
                .build();

        recruiterProfileRepository.save(recruiterProfile);

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getName().name())
                .message("Recruiter registered successfully.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPassword());

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        if (!user.isEnabled()) {
            throw new InvalidCredentialsException("User account is disabled.");
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .message("Login successful.")
                .build();
    }
}