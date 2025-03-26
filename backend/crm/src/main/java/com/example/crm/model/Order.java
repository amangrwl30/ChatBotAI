package com.example.crm.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
public class Order {
    private Long orderId;
    private String name;
    private BigDecimal amount;
    private String description;
    private OrderStatus status;
    @JsonProperty("created_on")
    private LocalDateTime createdOn;
    @JsonProperty("updated_on")
    private LocalDateTime updatedOn;
}
