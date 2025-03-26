package com.example.crm.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class RefundStatusResponse {
    private String orderId;
    private RefundStatus refundStatus;
    @JsonProperty("refund_initiated_date")
    private LocalDateTime refundInitiatedDate;
    @JsonProperty("refund_completed_date")
    private LocalDateTime refundCompletedDate;
    private String transactionId;

} 