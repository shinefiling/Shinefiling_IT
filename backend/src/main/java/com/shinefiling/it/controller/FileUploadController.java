package com.shinefiling.it.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileUploadController {

    private final String BASE_UPLOAD_DIR = "./uploads/";

    @PostMapping("/chat")
    public ResponseEntity<String> uploadChatFile(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "chat");
    }

    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        return uploadFile(file, "resumes");
    }

    private ResponseEntity<String> uploadFile(MultipartFile file, String subDir) {
        try {
            Path uploadPath = Paths.get(BASE_UPLOAD_DIR + subDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "/uploads/" + subDir + "/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}
