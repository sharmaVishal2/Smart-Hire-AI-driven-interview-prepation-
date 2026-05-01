package com.smarthire.resume;

import java.time.Instant;

public record ResumeResponse(Long id, String fileName, String preview, Instant uploadedAt) {
    public static ResumeResponse from(Resume resume) {
        String text = resume.getExtractedText();
        String preview = text.length() > 500 ? text.substring(0, 500) + "..." : text;
        return new ResumeResponse(resume.getId(), resume.getFileName(), preview, resume.getUploadedAt());
    }
}
