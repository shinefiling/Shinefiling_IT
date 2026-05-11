package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;

@Embeddable
@Data
public class Experience {
    private String title;
    private String company;
    private String startDate;
    private String endDate;
    private String period; // Kept for backward compatibility if needed, or derived
    private String location;
    @Column(columnDefinition = "TEXT")
    private String description;
}
