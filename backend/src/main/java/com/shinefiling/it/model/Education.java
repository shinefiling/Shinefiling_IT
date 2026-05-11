package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;

@Embeddable
@Data
public class Education {
    private String institution;
    private String degree;
    private String startDate;
    private String endDate;
    private String period;
    private String location;
}
