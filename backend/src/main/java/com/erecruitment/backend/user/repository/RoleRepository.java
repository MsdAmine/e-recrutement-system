package com.erecruitment.backend.user.repository;

import com.erecruitment.backend.common.enums.RoleName;
import com.erecruitment.backend.user.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}