package com.smarthire.interview;

import java.util.List;

public record StartInterviewResponse(Long interviewId, List<QuestionResponse> questions) {
}
