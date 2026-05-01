package com.smarthire.resume;

import com.smarthire.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByUploadedAtDesc(User user);

    Optional<Resume> findFirstByUserOrderByUploadedAtDesc(User user);
}
