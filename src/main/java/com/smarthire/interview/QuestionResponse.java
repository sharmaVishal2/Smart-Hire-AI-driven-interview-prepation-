package com.smarthire.interview;

public record QuestionResponse(Long id, int position, String text, String category, AnswerResponse answer) {
    public static QuestionResponse from(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getPosition(),
                question.getText(),
                question.getCategory(),
                question.getAnswer() == null ? null : AnswerResponse.from(question.getAnswer())
        );
    }
}
