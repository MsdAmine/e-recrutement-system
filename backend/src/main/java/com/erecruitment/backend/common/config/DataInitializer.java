package com.erecruitment.backend.common.config;

import com.erecruitment.backend.common.enums.RoleName;
import com.erecruitment.backend.user.entity.Role;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.RoleRepository;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Initialize Roles
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
            }
        }

        // Initialize Admin User
        String adminEmail = "admin@talentbridge.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));

            User admin = User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
            System.out.println("Admin user created: " + adminEmail + " / admin123");
        }
    }
}
