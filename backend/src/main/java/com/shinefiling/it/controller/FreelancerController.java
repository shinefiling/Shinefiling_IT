package com.shinefiling.it.controller;

import com.shinefiling.it.model.User;
import com.shinefiling.it.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
public class FreelancerController {

    private final UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllFreelancers() {
        List<User> freelancers = userRepository.findAll().stream()
                .filter(u -> "FREELANCER".equalsIgnoreCase(u.getUserRole()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(freelancers);
    }
}
