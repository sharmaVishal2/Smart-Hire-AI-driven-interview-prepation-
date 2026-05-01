package com.smarthire.interview;

import java.time.Instant;

public record InterviewSummaryResponse(Long id, InterviewStatus status, Integer averageScore, Instant startedAt,
                                       Instant completedAt, int questionCount) {
    public static InterviewSummaryResponse from(Interview interview) {
        return new InterviewSummaryResponse(interview.getId(), interview.getStatus(), interview.getAverageScore(),
                interview.getStartedAt(), interview.getCompletedAt(), interview.getQuestions().size());
    }
}
