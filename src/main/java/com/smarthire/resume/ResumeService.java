package com.smarthire.resume;

import com.smarthire.common.AppException;
import com.smarthire.user.User;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final Tika tika = new Tika();

    @Transactional
    public ResumeResponse upload(User user, MultipartFile file) {
        if (file.isEmpty() || file.getOriginalFilename() == null || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Upload a valid PDF resume");
        }
        try {
            String extracted = tika.parseToString(file.getInputStream()).replaceAll("\\s+", " ").trim();
            if (extracted.length() < 50) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Could not extract enough text from the PDF");
            }
            Resume resume = new Resume();
            resume.setUser(user);
            resume.setFileName(file.getOriginalFilename());
            resume.setExtractedText(extracted);
            return ResumeResponse.from(resumeRepository.save(resume));
        } catch (AppException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Failed to parse resume PDF");
        }
    }

    @Transactional(readOnly = true)
    public Resume latest(User user) {
        return resumeRepository.findFirstByUserOrderByUploadedAtDesc(user)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Upload a resume before starting an interview"));
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> list(User user) {
        return resumeRepository.findByUserOrderByUploadedAtDesc(user).stream().map(ResumeResponse::from).toList();
    }
}
