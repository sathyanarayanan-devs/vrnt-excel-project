package com.example.Vrnt.Repository;

import com.example.Vrnt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    Optional<User> findByAadhaar(String aadhaar);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    boolean existsByAadhaar(String aadhaar);

    boolean existsByUsername(String username);

    List<User> findByRole(String role);

    List<User> findByStatus(String status);

    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContainingOrUsernameContainingIgnoreCase(
            String firstName, String lastName, String email, String mobile, String username);
}