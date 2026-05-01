package com.smarthire.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smarthire.config.AiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class AiService {
    private final AiProperties properties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Async
    public CompletableFuture<List<GeneratedQuestion>> generateQuestions(String resumeText) {
        String context = resumeText.substring(0, Math.min(resumeText.length(), 6000));
        String prompt = """
                Based only on this resume context, generate 5 contextual technical interview questions.
                Avoid generic questions. Return JSON only as {"questions":[{"question":"...","category":"..."}]}.
                Resume:
                %s
                """.formatted(context);
        try {
            JsonNode root = callModel(prompt);
            List<GeneratedQuestion> questions = new ArrayList<>();
            for (JsonNode item : objectMapper.readTree(root.path("content").asText()).path("questions")) {
                questions.add(new GeneratedQuestion(item.path("question").asText(), item.path("category").asText("Resume")));
            }
            if (!questions.isEmpty()) {
                return CompletableFuture.completedFuture(questions);
            }
        } catch (Exception ignored) {
            // Fallback keeps local development usable without an API key.
        }
        return CompletableFuture.completedFuture(fallbackQuestions(resumeText));
    }

    @Async
    public CompletableFuture<EvaluationResult> evaluate(String question, String answer, String resumeText) {
        String prompt = """
                Evaluate the candidate answer for the resume-driven interview question.
                Score from 0 to 100 using clarity, correctness, and depth. Return JSON only as {"score":85,"feedback":"..."}.
                Resume context: %s
                Question: %s
                Answer: %s
                """.formatted(resumeText.substring(0, Math.min(resumeText.length(), 2500)), question, answer);
        try {
            JsonNode root = callModel(prompt);
            JsonNode content = objectMapper.readTree(root.path("content").asText());
            return CompletableFuture.completedFuture(new EvaluationResult(
                    Math.max(0, Math.min(100, content.path("score").asInt())),
                    content.path("feedback").asText("Feedback unavailable")));
        } catch (Exception ignored) {
            int score = Math.min(95, Math.max(35, answer.trim().split("\\s+").length * 4));
            return CompletableFuture.completedFuture(new EvaluationResult(score,
                    "Local fallback score based on answer detail. Configure AI_API_KEY for model-based feedback."));
        }
    }

    private JsonNode callModel(String prompt) {
        if (properties.apiKey() == null || properties.apiKey().isBlank()) {
            throw new IllegalStateException("AI API key is not configured");
        }
        Map<String, Object> body = Map.of(
                "model", properties.model(),
                "temperature", 0.3,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a precise technical interviewer."),
                        Map.of("role", "user", "content", prompt)
                )
        );
        JsonNode response = restClient.post()
                .uri(properties.url())
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + properties.apiKey())
                .body(body)
                .retrieve()
                .body(JsonNode.class);
        return response.path("choices").get(0).path("message");
    }

    private List<GeneratedQuestion> fallbackQuestions(String resumeText) {
        String lower = resumeText.toLowerCase();
        String focus = lower.contains("spring") ? "Spring Boot" : lower.contains("react") ? "React" : "your strongest project";
        return List.of(
                new GeneratedQuestion("Walk me through a resume project where you used " + focus + " and the main tradeoff you made.", "Projects"),
                new GeneratedQuestion("Which technical decision in your resume had the largest impact, and how did you validate it?", "Architecture"),
                new GeneratedQuestion("Describe a bug or failure from your resume experience and how you debugged it.", "Problem Solving"),
                new GeneratedQuestion("How would you scale one system or feature mentioned in your resume for more users?", "Scalability"),
                new GeneratedQuestion("What would you improve if you rebuilt your most recent resume project today?", "Reflection")
        );
    }
}
