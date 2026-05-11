package com.shinefiling.it.model;

import jakarta.persistence.*;
import lombok.Data;

@Embeddable
@Data
public class PortfolioItem {
    private String title;
    private String image;
}
