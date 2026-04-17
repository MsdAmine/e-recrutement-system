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
import com.erecruitment.backend.security.jwt.JwtService;
import com.erecruitment.backend.user.entity.Role;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.RoleRepository;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities(savedUser.getRole().getName().name())
                .build();

        String jwtToken = jwtService.generateToken(userDetails, savedUser.getRole().getName().name());

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getName().name())
                .token(jwtToken)
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

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities(savedUser.getRole().getName().name())
                .build();

        String jwtToken = jwtService.generateToken(userDetails, savedUser.getRole().getName().name());

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getName().name())
                .token(jwtToken)
                .message("Recruiter registered successfully.")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (Exception ex) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().getName().name())
                .build();

        String jwtToken = jwtService.generateToken(userDetails, user.getRole().getName().name());

        return AuthResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .token(jwtToken)
                .message("Login successful.")
                .build();
    }
}