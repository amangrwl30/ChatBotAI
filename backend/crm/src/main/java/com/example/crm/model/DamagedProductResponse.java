package com.example.crm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DamagedProductResponse {
    @JsonProperty("isReturnApplicable")
    private boolean isReturnApplicable;
    
    private String description;
} 