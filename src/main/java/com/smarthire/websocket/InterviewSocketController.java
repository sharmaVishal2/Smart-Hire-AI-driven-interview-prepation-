package com.smarthire.websocket;

import com.smarthire.common.CurrentUser;
import com.smarthire.interview.InterviewService;
import com.smarthire.interview.QuestionResponse;
import com.smarthire.interview.SubmitAnswerRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class InterviewSocketController {
    private final InterviewService interviewService;

    @MessageMapping("/interviews/{id}/answers")
    @SendTo("/topic/interviews/{id}")
    QuestionResponse submit(@DestinationVariable Long id, @Valid SubmitAnswerRequest request) {
        return interviewService.submit(CurrentUser.get(), id, request);
    }
}
