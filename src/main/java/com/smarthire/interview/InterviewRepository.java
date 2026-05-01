package com.smarthire.interview;

import com.smarthire.user.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserOrderByStartedAtDesc(User user);

    long countByUser(User user);

    @EntityGraph(attributePaths = {"questions", "questions.answer", "questions.answer.score", "resume"})
    @Query("select i from Interview i where i.id = :id")
    Optional<Interview> findWithQuestionsById(Long id);
}
