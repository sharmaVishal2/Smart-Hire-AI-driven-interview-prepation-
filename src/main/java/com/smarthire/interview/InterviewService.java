package com.smarthire.interview;

import com.smarthire.ai.AiService;
import com.smarthire.ai.EvaluationResult;
import com.smarthire.common.AppException;
import com.smarthire.resume.Resume;
import com.smarthire.resume.ResumeService;
import com.smarthire.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {
    private final ResumeService resumeService;
    private final AiService aiService;
    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public StartInterviewResponse start(User user) {
        Resume resume = resumeService.latest(user);
        List<com.smarthire.ai.GeneratedQuestion> generated = aiService.generateQuestions(resume.getExtractedText()).join();
        Interview interview = new Interview();
        interview.setUser(user);
        interview.setResume(resume);
        for (int i = 0; i < generated.size(); i++) {
            Question question = new Question();
            question.setInterview(interview);
            question.setPosition(i + 1);
            question.setText(generated.get(i).question());
            question.setCategory(generated.get(i).category());
            interview.getQuestions().add(question);
        }
        Interview saved = interviewRepository.save(interview);
        return new StartInterviewResponse(saved.getId(), saved.getQuestions().stream().map(QuestionResponse::from).toList());
    }

    @Transactional
    public QuestionResponse submit(User user, Long interviewId, SubmitAnswerRequest request) {
        Interview interview = ownedInterview(user, interviewId);
        Question question = interview.getQuestions().stream()
                .filter(item -> item.getId().equals(request.questionId()))
                .findFirst()
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Question not found"));
        EvaluationResult evaluation = aiService.evaluate(question.getText(), request.answer(), interview.getResume().getExtractedText()).join();
        Answer answer = question.getAnswer() == null ? new Answer() : question.getAnswer();
        answer.setQuestion(question);
        answer.setContent(request.answer().trim());
        Score score = answer.getScore() == null ? new Score() : answer.getScore();
        score.setAnswer(answer);
        score.setValue(evaluation.score());
        score.setFeedback(evaluation.feedback());
        answer.setScore(score);
        question.setAnswer(answer);
        recalculate(interview);
        return QuestionResponse.from(questionRepository.save(question));
    }

    @Transactional(readOnly = true)
    public List<InterviewSummaryResponse> history(User user) {
        return interviewRepository.findByUserOrderByStartedAtDesc(user).stream().map(InterviewSummaryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public InterviewDetailResponse detail(User user, Long id) {
        return InterviewDetailResponse.from(ownedInterview(user, id));
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse stats(User user) {
        List<Interview> interviews = interviewRepository.findByUserOrderByStartedAtDesc(user);
        int completed = (int) interviews.stream().filter(i -> i.getStatus() == InterviewStatus.COMPLETED).count();
        double average = interviews.stream().filter(i -> i.getAverageScore() != null)
                .mapToInt(Interview::getAverageScore).average().orElse(0);
        return new DashboardStatsResponse(interviews.size(), completed, Math.round(average * 10.0) / 10.0);
    }

    private Interview ownedInterview(User user, Long id) {
        Interview interview = interviewRepository.findWithQuestionsById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Interview not found"));
        if (!interview.getUser().getId().equals(user.getId())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Interview does not belong to this user");
        }
        return interview;
    }

    private void recalculate(Interview interview) {
        List<Score> scores = interview.getQuestions().stream()
                .map(Question::getAnswer)
                .filter(answer -> answer != null && answer.getScore() != null)
                .map(Answer::getScore)
                .toList();
        if (!scores.isEmpty()) {
            interview.setAverageScore((int) Math.round(scores.stream().mapToInt(Score::getValue).average().orElse(0)));
        }
        if (scores.size() == interview.getQuestions().size()) {
            interview.setStatus(InterviewStatus.COMPLETED);
            interview.setCompletedAt(Instant.now());
        }
    }
}
