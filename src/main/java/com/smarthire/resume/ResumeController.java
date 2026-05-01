package com.smarthire.resume;

import com.smarthire.common.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;

    @PostMapping
    ResumeResponse upload(@RequestParam("file") MultipartFile file) {
        return resumeService.upload(CurrentUser.get(), file);
    }

    @GetMapping
    List<ResumeResponse> list() {
        return resumeService.list(CurrentUser.get());
    }
}
