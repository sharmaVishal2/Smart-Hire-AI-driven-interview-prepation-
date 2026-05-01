package com.smarthire.interview;

public record AnswerResponse(Long id, String content, Integer score, String feedback) {
    public static AnswerResponse from(Answer answer) {
        Score score = answer.getScore();
        return new AnswerResponse(answer.getId(), answer.getContent(), score == null ? null : score.getValue(),
                score == null ? null : score.getFeedback());
    }
}
