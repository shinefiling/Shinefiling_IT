package com.shinefiling.it.controller;

import com.shinefiling.it.model.News;
import com.shinefiling.it.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NewsController {
    private final NewsRepository newsRepository;

    @GetMapping("/latest")
    public ResponseEntity<News> getLatestNews() {
        News news = newsRepository.findTopByOrderByUpdatedAtDesc();
        if (news == null) {
            news = News.builder()
                    .content("Welcome to Shinefiling IT Marketplace! Stay tuned for daily IT news updates.")
                    .build();
        }
        return ResponseEntity.ok(news);
    }

    @PostMapping("/update")
    public ResponseEntity<News> updateNews(@RequestBody String content) {
        News news = newsRepository.findTopByOrderByUpdatedAtDesc();
        if (news == null) {
            news = new News();
        }
        news.setContent(content);
        return ResponseEntity.ok(newsRepository.save(news));
    }
}
