package com.example.Vrnt.Repository;

import com.example.Vrnt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Optional<User> findByAadhaar(String aadhaar);

    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    boolean existsByAadhaar(String aadhaar);

    List<User> findByStatus(String status);
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContaining(
            String firstName, String lastName, String email, String mobile);
}