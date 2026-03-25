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

package com.wso2.openbanking.demo.services;

import com.wso2.openbanking.demo.exceptions.BankInfoLoadException;
import com.wso2.openbanking.demo.models.Account;
import com.wso2.openbanking.demo.models.Bank;
import com.wso2.openbanking.demo.models.Transaction;
import com.wso2.openbanking.demo.utils.ConfigLoader;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/** AccountService implementation */
public class AccountService {

    private final BankInfoService bankInfoService;
    private final HttpTlsClient client;
    private final OAuthTokenService oauthService;
    private String accessToken;
    private String currentConsentId;

    private static final DateTimeFormatter ISO_DATETIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String FIELD_ACCOUNT = "Account";
    private static final String FIELD_AMOUNT = "Amount";
    private static final String ACCOUNTS_PATH = "/accounts/";

    public AccountService(BankInfoService bankInfoService, HttpTlsClient client) throws Exception {
        this.bankInfoService = bankInfoService;
        this.client = client;
        this.oauthService = new OAuthTokenService(client);
    }

    /**
     * Executes the setAccessToken operation and modify the payload if necessary.
     *
     * @param accessToken     The accessToken parameter
     */
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    /**
     * Executes the addMockBankAccountsInformation operation and modify the payload if necessary.
     *
     * @throws IOException    When an error occurs during the operation
     * @throws BankInfoLoadException When an error occurs during the operation
     */
    public void addMockBankAccountsInformation() throws IOException, BankInfoLoadException {
        if (bankInfoService.getBanks() == null) {
            bankInfoService.loadBanks();
        }
        String bankName = ConfigLoader.getMockBankName();
        boolean bankExists = bankInfoService.isBankExists(bankName);
        List<String> fetchedAccountIds = fetchAccountIds();
        Set<String> existingAccountIds = getExistingAccountIds(bankName);
        List<String> newAccountIds = fetchedAccountIds.stream()
                .filter(id -> !existingAccountIds.contains(id))
                .collect(Collectors.toList());
        if (newAccountIds.isEmpty()) {
            return;
        }
        List<Account> newAccounts = fetchAccountsWithTransactions(newAccountIds, bankName);
        if (bankExists) {
            addAccountsToExistingBank(bankName, newAccounts);
        } else {
            addNewBank(bankName, newAccounts);
        }
    }

    /**
     * Executes the processAddAccount operation and modify the payload if necessary.
     *
     * @param bankName        The bankName parameter
     * @throws Exception      When an error occurs during the operation
     */
    public String processAddAccount(String bankName) throws Exception {
        if (!bankName.equals(ConfigLoader.getMockBankName())) {
            return null;
        }
        String addAccountUrl = ConfigLoader.getAccountBaseUrl() + "/account-access-consents";
        String consentBody = createAccountConsentBody();
        String token = oauthService.getToken("accounts openid");

        String consentResponse = oauthService.initializeConsent(token, consentBody, addAccountUrl);
        currentConsentId = new JSONObject(consentResponse).getJSONObject("Data").getString("ConsentId");

        String redirectUrl = oauthService.authorizeConsent(consentResponse, "accounts openid");

        System.out.println("========== REDIRECT URL ==========");
        System.out.println(redirectUrl);
        System.out.println("==================================");

        return redirectUrl;
    }

    /**
     * Executes the getExistingAccountIds operation and modify the payload if necessary.
     *
     * @param bankName        The bankName parameter
     */
    private Set<String> getExistingAccountIds(String bankName) {
        Set<String> existingIds = new HashSet<>();
        if (bankInfoService.getBanks() == null) {
            return existingIds;
        }
        bankInfoService.getBanks().stream()
                .filter(bank -> bank.getName().equals(bankName))
                .flatMap(bank -> bank.getAccounts().stream())
                .forEach(account -> existingIds.add(account.getId()));
        return existingIds;
    }

    /**
     * Executes the addAccountsToExistingBank operation and modify the payload if necessary.
     *
     * @param bankName        The bankName parameter
     * @param newAccounts     The newAccounts parameter
     */
    private void addAccountsToExistingBank(String bankName, List<Account> newAccounts) {
        bankInfoService.getBanks().stream()
                .filter(bank -> bank.getName().equals(bankName))
                .findFirst()
                .ifPresent(bank -> {
                    List<Account> currentAccounts = bank.getAccounts();
                    if (currentAccounts == null) {
                        currentAccounts = new ArrayList<>();
                    }
                    Set<String> currentIds = currentAccounts.stream()
                            .map(Account::getId)
                            .collect(Collectors.toSet());
                    newAccounts.stream()
                            .filter(account -> !currentIds.contains(account.getId()))
                            .forEach(bank::addAccount);
                });
    }

    /**
     * Executes the fetchAccountIds operation and modify the payload if necessary.
     *
     * @throws IOException    When an error occurs during the operation
     */
    private List<String> fetchAccountIds() throws IOException {
        String response = client.getWithAuth(
                ConfigLoader.getAccountBaseUrl() + "/accounts",
                this.accessToken
        );
        JSONArray accountsArray = new JSONObject(response)
                .getJSONObject("Data")
                .getJSONArray(FIELD_ACCOUNT);
        List<String> accountIds = new ArrayList<>();
        for (int i = 0; i < accountsArray.length(); i++) {
            accountIds.add(accountsArray.getJSONObject(i).getString("AccountId"));
        }
        return accountIds;
    }

    /**
     * Executes the fetchAccountsWithTransactions operation and modify the payload if necessary.
     *
     * @param accountIds      The accountIds parameter
     * @param bankName        The bankName parameter
     * @throws IOException    When an error occurs during the operation
     */
    private List<Account> fetchAccountsWithTransactions(List<String> accountIds, String bankName) throws IOException {
        List<Account> accounts = new ArrayList<>();
        for (String accountId : accountIds) {
            String accountName = fetchAccountName(accountId);
            double balance = fetchAccountBalance(accountId);
            List<Transaction> transactions = fetchAccountTransactions(accountId, bankName);
            Account account = new Account(accountId, accountName, balance, transactions);
            account.setBank(bankName);
            account.setConsentId(currentConsentId);
            accounts.add(account);
        }
        currentConsentId = null;
        return accounts;
    }

    /**
     * Executes the fetchAccountName operation and modify the payload if necessary.
     *
     * @param accountId       The accountId parameter
     * @throws IOException    When an error occurs during the operation
     */
    private String fetchAccountName(String accountId) throws IOException {
        String url = ConfigLoader.getAccountBaseUrl() + ACCOUNTS_PATH + accountId;
        String response = client.getWithAuth(url, this.accessToken);
        JSONObject accountDataNode = new JSONObject(response)
                .getJSONObject("Data")
                .getJSONArray(FIELD_ACCOUNT)
                .getJSONObject(0);
        if (accountDataNode.has(FIELD_ACCOUNT)) {
            return accountDataNode.getJSONArray(FIELD_ACCOUNT)
                    .getJSONObject(0)
                    .optString("Name", "Open Banking Account");
        }
        return accountDataNode.optString("Nickname", "Standard Account");
    }

    /**
     * Executes the fetchAccountBalance operation and modify the payload if necessary.
     *
     * @param accountId       The accountId parameter
     * @throws IOException    When an error occurs during the operation
     */
    private double fetchAccountBalance(String accountId) throws IOException {
        String url = ConfigLoader.getAccountBaseUrl() + ACCOUNTS_PATH + accountId + "/balances";
        String response = client.getWithAuth(url, this.accessToken);
        String amount = new JSONObject(response)
                .getJSONObject("Data")
                .getJSONArray("Balance")
                .getJSONObject(0)
                .getJSONObject(FIELD_AMOUNT)
                .getString(FIELD_AMOUNT);
        return Double.parseDouble(amount);
    }

    /**
     * Executes the fetchAccountTransactions operation and modify the payload if necessary.
     *
     * @param accountId       The accountId parameter
     * @param bankName        The bankName parameter
     * @throws IOException    When an error occurs during the operation
     */
    private List<Transaction> fetchAccountTransactions(String accountId, String bankName) throws IOException {
        String url = ConfigLoader.getAccountBaseUrl() + ACCOUNTS_PATH + accountId + "/transactions";
        String response = client.getWithAuth(url, this.accessToken);
        JSONArray transactionsArray = new JSONObject(response)
                .getJSONObject("Data")
                .getJSONArray("Transaction");
        List<Transaction> transactions = new ArrayList<>();
        for (int i = 0; i < transactionsArray.length(); i++) {
            transactions.add(parseTransaction(transactionsArray.getJSONObject(i), bankName, accountId));
        }
        return transactions;
    }

    /**
     * Executes the parseTransaction operation and modify the payload if necessary.
     *
     * @param txn             The txn parameter
     * @param bankName        The bankName parameter
     * @param accountId       The accountId parameter
     */
    private Transaction parseTransaction(JSONObject txn, String bankName, String accountId) {
        Transaction transaction = new Transaction();
        transaction.setId(txn.getString("TransactionId"));
        transaction.setDate(convertIsoDateTimeToDate(txn.getString("BookingDateTime")));
        transaction.setReference(txn.getString("TransactionInformation"));
        JSONObject amountObj = txn.getJSONObject(FIELD_AMOUNT);
        transaction.setAmount(amountObj.getString(FIELD_AMOUNT));
        transaction.setCurrency(amountObj.getString("Currency"));
        transaction.setCreditDebitStatus(txn.getString("CreditDebitIndicator"));
        transaction.setBank(bankName);
        transaction.setAccount(accountId);
        return transaction;
    }

    /**
     * Executes the convertIsoDateTimeToDate operation and modify the payload if necessary.
     *
     * @param isoDateTime     The isoDateTime parameter
     */
    private String convertIsoDateTimeToDate(String isoDateTime) {
        try {
            return ZonedDateTime.parse(isoDateTime, ISO_DATETIME_FORMATTER).format(DATE_FORMATTER);
        } catch (Exception e1) {
            try {
                return LocalDateTime.parse(isoDateTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        .format(DATE_FORMATTER);
            } catch (Exception e2) {
                if (isoDateTime.length() >= 10) {
                    return isoDateTime.substring(0, 10);
                }
                return isoDateTime;
            }
        }
    }

    /**
     * Executes the addNewBank operation and modify the payload if necessary.
     *
     * @param bankName        The bankName parameter
     * @param accounts        The accounts parameter
     */
    private void addNewBank(String bankName, List<Account> accounts) {
        Bank newBank = new Bank(
                bankName,
                ConfigLoader.getMockBankLogo(),
                ConfigLoader.getMockBankPrimaryColor(),
                ConfigLoader.getMockBankSecondaryColor(),
                accounts
        );
        bankInfoService.addBank(newBank);
    }

    /**
     * Executes the createAccountConsentBody operation and modify the payload if necessary.
     */
    private String createAccountConsentBody() {
        ZonedDateTime now = ZonedDateTime.now(java.time.ZoneOffset.of("+05:30"));
        JSONObject permissions = new JSONObject()
                .put("Permissions", new JSONArray()
                        .put("ReadAccountsBasic")
                        .put("ReadAccountsDetail")
                        .put("ReadBalances")
                        .put("ReadTransactionsDetail"))
                .put("ExpirationDateTime", now.plusDays(90).format(ISO_DATETIME_FORMATTER))
                .put("TransactionFromDateTime", now.minusDays(30).format(ISO_DATETIME_FORMATTER))
                .put("TransactionToDateTime", now.format(ISO_DATETIME_FORMATTER));
        return new JSONObject()
                .put("Data", permissions)
                .put("Risk", new JSONObject())
                .toString();
    }

    /**
     * Executes the revokeAccountConsent operation and modify the payload if necessary.
     *
     * @param accountId       The accountId parameter
     * @param bankName        The bankName parameter
     * @throws Exception      When an error occurs during the operation
     */
    public boolean revokeAccountConsent(String accountId, String bankName) throws Exception {
        System.out.println("[DELETE] Attempting to revoke consent for accountId: " + accountId + ", bankName: " + bankName);

        Bank bank = bankInfoService.getBanks().stream()
                .filter(b -> b.getName().equals(bankName))
                .findFirst()
                .orElse(null);

        if (bank == null) {
            System.out.println("[DELETE] Bank not found: " + bankName);
            return false;
        }

        String consentId = bank.getConsentIdForAccount(accountId);
        if (consentId == null) {
            System.out.println("[DELETE] No consentId found for accountId: " + accountId);
            return false;
        }

        System.out.println("[DELETE] Resolved consentId: " + consentId);

        String tokenResponse = oauthService.getToken("accounts openid");
        String token = new JSONObject(tokenResponse).getString("access_token");

        String revokeUrl = ConfigLoader.getAccountBaseUrl() + "/account-access-consents/" + consentId;
        System.out.println("[DELETE] Calling revoke URL: " + revokeUrl);

        boolean success = client.deleteWithAuth(revokeUrl, token);
        System.out.println("[DELETE] OB backend revocation success: " + success);

        if (success) {
            List<String> allAccountIds = bank.getAccountIdsByConsentId(consentId);
            System.out.println("[DELETE] Removing accounts: " + allAccountIds);
            allAccountIds.forEach(bank::removeAccount);
            bank.removeConsent(consentId);
        }

        return success;
    }
}
