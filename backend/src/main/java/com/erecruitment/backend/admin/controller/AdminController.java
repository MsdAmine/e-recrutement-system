package com.erecruitment.backend.admin.controller;

import com.erecruitment.backend.admin.dto.PlatformStatsResponse;
import com.erecruitment.backend.admin.service.AdminService;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobOffer>> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobOffers());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        adminService.deleteJobOffer(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getPlatformStats());
    }
}
