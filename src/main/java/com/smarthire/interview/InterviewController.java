package com.smarthire.interview;

import com.smarthire.common.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {
    private final InterviewService interviewService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/start")
    StartInterviewResponse start() {
        return interviewService.start(CurrentUser.get());
    }

    @PostMapping("/{id}/answers")
    QuestionResponse submit(@PathVariable Long id, @Valid @RequestBody SubmitAnswerRequest request) {
        QuestionResponse response = interviewService.submit(CurrentUser.get(), id, request);
        messagingTemplate.convertAndSend("/topic/interviews/" + id, response);
        return response;
    }

    @GetMapping
    List<InterviewSummaryResponse> history() {
        return interviewService.history(CurrentUser.get());
    }

    @GetMapping("/{id}")
    InterviewDetailResponse detail(@PathVariable Long id) {
        return interviewService.detail(CurrentUser.get(), id);
    }

    @GetMapping("/stats")
    DashboardStatsResponse stats() {
        return interviewService.stats(CurrentUser.get());
    }
}
