package com.wso2.openbanking.demo.service;

import java.io.IOException;

public interface HttpTlsClientInterface {
    String postJwt(String url, String body) throws IOException;
    String postAccessToken(String url, String body) throws IOException;
    String postConsentInit(String url, String body, String token) throws IOException;
    String postConsentAuthRequest(String requestObjectJwt, String clientId, String scope) throws IOException;
    String getWithAuth(String url, String token) throws IOException;
    String postPaymentConsentInit(String url, String body, String token) throws IOException;
    String postPayments(String url, String body, String token) throws IOException;
    boolean deleteWithAuth(String url, String token) throws IOException;
}
