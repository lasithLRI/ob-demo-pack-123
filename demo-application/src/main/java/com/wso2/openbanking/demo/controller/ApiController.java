/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package com.wso2.openbanking.demo.controller;

import com.wso2.openbanking.demo.exceptions.AuthorizationException;
import com.wso2.openbanking.demo.exceptions.BankInfoLoadException;
import com.wso2.openbanking.demo.exceptions.SSLContextCreationException;
import com.wso2.openbanking.demo.models.Account;
import com.wso2.openbanking.demo.models.Bank;
import com.wso2.openbanking.demo.models.ConfigResponse;
import com.wso2.openbanking.demo.models.LoadPaymentPageResponse;
import com.wso2.openbanking.demo.models.Payment;
import com.wso2.openbanking.demo.service.AccountService;
import com.wso2.openbanking.demo.service.AuthService;
import com.wso2.openbanking.demo.service.serviceIMPLs.BankInfoService;
import com.wso2.openbanking.demo.service.serviceIMPLs.HttpTlsClient;
import com.wso2.openbanking.demo.service.PaymentService;
import com.wso2.openbanking.demo.utils.ConfigLoader;
import com.wso2.openbanking.demo.utils.HtmlResponseBuilder;
import org.json.JSONArray;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import static org.reflections.Reflections.log;

/** ApiController implementation. */
@Path("")
public final class ApiController {

    private final BankInfoService bankInfoService;
    private final AccountService accountService;
    private final AuthService authService;
    private final PaymentService paymentService;

    public ApiController() throws BankInfoLoadException {

        this.bankInfoService = new BankInfoService();

        try {
            HttpTlsClient httpClient = new HttpTlsClient(
                    ConfigLoader.getCertificatePath(),
                    ConfigLoader.getKeyPath(),
                    ConfigLoader.getTruststorePath(),
                    ConfigLoader.getTruststorePassword()
            );

            this.accountService = AccountService.create(bankInfoService, httpClient);
            this.paymentService = PaymentService.create(bankInfoService, httpClient);
            this.authService = new AuthService(accountService, paymentService);

        } catch (SSLContextCreationException | GeneralSecurityException | IOException e) {
            throw new BankInfoLoadException("Failed to initialize API controller: " + e.getMessage(), e);
        }
    }


    /**
     * Executes the getData operation and modify the payload if necessary.
     */
    @GET
    @Path("/data")
    @Produces(MediaType.APPLICATION_JSON)
    public String getData() {
        return "Server works";
    }

    /**
     * Executes the initializeApplication operation and modify the payload if necessary.
     */
    @GET
    @Path("/initialize")
    @Produces(MediaType.APPLICATION_JSON)
    public Response initializeApplication() {
        try {
            bankInfoService.loadBanks();
            ConfigResponse config = bankInfoService.getConfigurations();
            return Response.ok(config).build();
        } catch (BankInfoLoadException e) {
            return Response.serverError().entity(e.getMessage()).build();
        }
    }

    /**
     * Executes the getBankData operation and modify the payload if necessary.
     */
    @GET
    @Path("/bank")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBankData() {
        try {
            bankInfoService.loadBanks();
            return Response.ok(bankInfoService.getConfigurations()).build();
        } catch (BankInfoLoadException e) {
            return Response.serverError().entity(e.getMessage()).build();
        }
    }

    /**
     * Executes the getAddAccountBanks operation and modify the payload if necessary.
     */
    @GET
    @Path("/accounts")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAddAccountBanks() {
        try {
            return Response.ok(bankInfoService.getAddAccountBanksInformation()).build();
        } catch (BankInfoLoadException e) {
            return Response.serverError().entity(e.getMessage()).build();
        }
    }

    /**
     * Executes the selectAccountToAdd operation and modify the payload if necessary.
     *
     * @param requestBody     The requestBody parameter
     * @throws Exception      When an error occurs during the operation
     */
    @POST
    @Path("/addaccounts")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response selectAccountToAdd(Map<String, String> requestBody) throws Exception {
        String redirectUrl = accountService.processAddAccount(requestBody.get("bankName"));
        authService.setRequestStatus("accounts");

        System.out.println("================================================+");

        return Response.ok(createRedirectResponse(redirectUrl)).build();
    }

    private Map<String, String> createRedirectResponse(String url) {
        Map<String, String> response = new HashMap<>();
        response.put("redirect", url);
        return response;
    }

    /**
     * Executes the getLoadPaymentData operation and modify the payload if necessary.
     */
    @GET
    @Path("/load-payment")
    @Produces(MediaType.APPLICATION_JSON)
    public LoadPaymentPageResponse getLoadPaymentData() {
        return bankInfoService.getPaymentPageInfo();
    }

    /**
     * Executes the makePayment operation and modify the payload if necessary.
     *
     * @param payment         The payment parameter
     * @throws Exception      When an error occurs during the operation
     */
    @POST
    @Path("/payment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response makePayment(Payment payment) throws Exception {
        String redirectUrl = paymentService.processPaymentRequest(payment);
        authService.setRequestStatus("payments");
        return Response.ok(createRedirectResponse(redirectUrl)).build();
    }

    /**
     * Executes the redirectedPath operation and modify the payload if necessary.
     */
    @GET
    @Path("/redirected")
    @Produces("text/html")
    public Response redirectedPath() {
        String html = HtmlResponseBuilder.buildAuthRedirectPage();
        return Response.ok(html).build();
    }

    /**
     * Executes the processAuth operation and modify the payload if necessary.
     *
     * @param @QueryParam("code" The @QueryParam("code" parameter
     */
    @GET
    @Path("/processAuth")
    public Response processAuth(@QueryParam("code") String code) {
        try {
            authService.processAuthorizationCallback(code);
            return Response.ok().build();
        } catch (AuthorizationException e) {
            return Response.serverError().entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/revoke-consent")
    @Produces(MediaType.APPLICATION_JSON)
    public Response revokeConsent(@QueryParam("accountId") String accountId,
                                  @QueryParam("bankName") String bankName) {
        try {
            if (accountId == null || accountId.isEmpty() || bankName == null || bankName.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\":\"accountId and bankName are required\"}")
                        .build();
            }
            boolean success = accountService.revokeAccountConsent(accountId, bankName);
            if (success) {
                return Response.ok("{\"status\":\"revoked\"}").build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\":\"Account not found or revocation failed\"}")
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Executes the getDeleteAccountInfo operation and modify the payload if necessary.
     */
    @GET
    @Path("/get-delete-account-info")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDeleteAccountInfo() {
        try {
            List<Map<String, Object>> groups = new ArrayList<>();
            List<Bank> banks = Optional.ofNullable(bankInfoService.getBanks())
                    .orElse(Collections.emptyList());

            Map<String, List<Account>> byConsent = new LinkedHashMap<>();
            for (Bank bank : banks) {
                if (bank == null) continue;
                List<Account> accounts = Optional.ofNullable(bank.getAccounts())
                        .orElse(Collections.emptyList());
                for (Account acc : accounts) {
                    if (acc == null || acc.getConsentId() == null) continue;
                    byConsent.computeIfAbsent(acc.getConsentId(), k -> new ArrayList<>())
                            .add(acc);
                }
            }

            for (Map.Entry<String, List<Account>> entry : byConsent.entrySet()) {
                List<Account> consentAccounts = entry.getValue();
                if (consentAccounts.isEmpty()) continue;

                Map<String, Object> group = new LinkedHashMap<>();
                group.put("consentId", entry.getKey());
                group.put("bankName", consentAccounts.get(0).getBank());

                List<Map<String, String>> accountList = new ArrayList<>();
                for (Account acc : consentAccounts) {
                    Map<String, String> a = new LinkedHashMap<>();
                    a.put("id", acc.getId());
                    a.put("name", acc.getName());
                    accountList.add(a);
                }
                group.put("accounts", accountList);
                groups.add(group);
            }

            return Response.ok(new JSONArray(groups).toString()).build();

        } catch (IllegalStateException e) {
            log.error("Failed to build delete account info response", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Unable to retrieve account information\"}")
                    .build();
        }
    }
}
