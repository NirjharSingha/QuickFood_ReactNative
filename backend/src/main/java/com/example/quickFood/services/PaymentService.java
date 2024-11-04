package com.example.quickFood.services;

import com.stripe.exception.StripeException;

public interface PaymentService {
    String createPaymentLink(double amount) throws StripeException;
}
