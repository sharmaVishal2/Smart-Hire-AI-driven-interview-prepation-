package com.smarthire.interview;

import java.time.Instant;
import java.util.List;

public record InterviewDetailResponse(Long id, InterviewStatus status, Integer averageScore, Instant startedAt,
                                      Instant completedAt, List<QuestionResponse> questions) {
    public static InterviewDetailResponse from(Interview interview) {
        return new InterviewDetailResponse(interview.getId(), interview.getStatus(), interview.getAverageScore(),
                interview.getStartedAt(), interview.getCompletedAt(),
                interview.getQuestions().stream().map(QuestionResponse::from).toList());
    }
}
