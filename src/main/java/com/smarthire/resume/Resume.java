package com.smarthire.resume;

import com.smarthire.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "resumes")
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @Column(nullable = false)
    private String fileName;

    @Lob
    @Column(nullable = false)
    private String extractedText;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt = Instant.now();
}
