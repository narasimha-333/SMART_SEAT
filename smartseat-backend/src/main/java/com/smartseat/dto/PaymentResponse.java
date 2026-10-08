package com.smartseat.dto;

import com.smartseat.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponse {

    private Long paymentId;

    private Long bookingId;

    private double amount;

    private PaymentStatus status;

    private String transactionReference;

    private LocalDateTime paidAt;
}