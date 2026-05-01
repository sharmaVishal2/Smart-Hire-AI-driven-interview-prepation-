package com.smarthire.interview;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SubmitAnswerRequest(
        @NotNull Long questionId,
        @NotBlank @Size(min = 5, max = 5000) String answer
) {
}
