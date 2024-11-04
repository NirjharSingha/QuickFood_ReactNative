package com.example.quickFood.services.impl;

import com.example.quickFood.services.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

        // only for web version
        String stripeSecretKey = "";

        // only for web version
        String clientUrl = "";

        @Override
        public String createPaymentLink(double amount) throws StripeException {
                Stripe.apiKey = stripeSecretKey;

                SessionCreateParams params = SessionCreateParams.builder()
                                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                                .setMode(SessionCreateParams.Mode.PAYMENT)
                                .setSuccessUrl(clientUrl + "/validation")
                                .setCancelUrl(clientUrl + "/validation")
                                .addLineItem(
                                                SessionCreateParams.LineItem.builder()
                                                                .setQuantity(1L)
                                                                .setPriceData(
                                                                                SessionCreateParams.LineItem.PriceData
                                                                                                .builder()
                                                                                                .setCurrency("bdt")
                                                                                                .setUnitAmount((long) (amount
                                                                                                                * 100))
                                                                                                .setProductData(
                                                                                                                SessionCreateParams.LineItem.PriceData.ProductData
                                                                                                                                .builder()
                                                                                                                                .setName("Order")
                                                                                                                                .build())
                                                                                                .build())
                                                                .build())
                                .build();

                Session session = Session.create(params);
                return session.getUrl();
        }
}
