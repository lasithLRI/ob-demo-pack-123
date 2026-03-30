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

package com.wso2.openbanking.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

import java.util.ArrayList;
import java.util.List;

/** Account implementation. */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Account {
    private String id;
    private String name;
    private Double balance;
    private List<Transaction> transactions;
    private List<StandingOrder> standingOrders;
    private String bank;
    private String account;
    private String consentId;

    public Account() {
    }

    @SuppressFBWarnings(value = "EI_EXPOSE_REP2",
            justification = "Internal service mutates these lists directly; exposure is intentional within the package")
    public Account(String id, String name, Double balance, List<Transaction> transactions) {
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.transactions = transactions != null ? new ArrayList<>(transactions) : null;
    }

    @SuppressFBWarnings(value = "EI_EXPOSE_REP2",
            justification = "Internal service mutates these lists directly; exposure is intentional within the package")
    public Account(String id, String name, Double balance, List<Transaction> transactions,
                   List<StandingOrder> standingOrders) {
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.transactions = transactions != null ? new ArrayList<>(transactions) : null;
        this.standingOrders = standingOrders != null ? new ArrayList<>(standingOrders) : null;
    }

    /**
     * Executes the getId operation and modify the payload if necessary.
     */
    public String getId() {
        return id;
    }
    /**
     * Executes the setId operation and modify the payload if necessary.
     *
     * @param id              The id parameter
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Executes the getName operation and modify the payload if necessary.
     */
    public String getName() {
        return name;
    }
    /**
     * Executes the setName operation and modify the payload if necessary.
     *
     * @param name            The name parameter
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Executes the getBalance operation and modify the payload if necessary.
     */
    public Double getBalance() {
        return balance;
    }
    /**
     * Executes the setBalance operation and modify the payload if necessary.
     *
     * @param balance         The balance parameter
     */
    public void setBalance(Double balance) {
        this.balance = balance;
    }

    /**
     * Executes the getTransactions operation and modify the payload if necessary.
     */
    @SuppressFBWarnings(value = "EI_EXPOSE_REP",
            justification = "Internal service mutates these lists directly; exposure is intentional within the package")
    public List<Transaction> getTransactions() {
        return transactions;
    }

    /**
     * Executes the setTransactions operation and modify the payload if necessary.
     *
     * @param transactions    The transactions parameter
     */
    @SuppressFBWarnings(value = "EI_EXPOSE_REP2",
            justification = "Internal service mutates these lists directly; exposure is intentional within the package")
    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    /**
     * Executes the getStandingOrders operation and modify the payload if necessary.
     */
    @SuppressFBWarnings(value = "EI_EXPOSE_REP",
            justification = "Internal service mutates these lists directly; exposure is intentional within the package")
    public List<StandingOrder> getStandingOrders() {
        return standingOrders;
    }

    /**
     * Executes the setStandingOrders operation and modify the payload if necessary.
     *
     * @param standingOrders  The standingOrders parameter
     */
    @SuppressFBWarnings(value = "EI_EXPOSE_REP2",
            justification = "Internal service mutates these lists directly; exposure is intentional within the package")
    public void setStandingOrders(List<StandingOrder> standingOrders) {
        this.standingOrders = standingOrders;
    }

    /**
     * Executes the getBank operation and modify the payload if necessary.
     */
    public String getBank() {
        return bank;
    }
    /**
     * Executes the setBank operation and modify the payload if necessary.
     *
     * @param bank            The bank parameter
     */
    public void setBank(String bank) {
        this.bank = bank;
    }

    /**
     * Executes the getAccount operation and modify the payload if necessary.
     */
    public String getAccount() {
        return account;
    }
    /**
     * Executes the setAccount operation and modify the payload if necessary.
     *
     * @param account         The account parameter
     */
    public void setAccount(String account) {
        this.account = account;
    }

    /**
     * Executes the getConsentId operation and modify the payload if necessary.
     */
    public String getConsentId() {
        return consentId;
    }
    /**
     * Executes the setConsentId operation and modify the payload if necessary.
     *
     * @param consentId       The consentId parameter
     */
    public void setConsentId(String consentId) {
        this.consentId = consentId;
    }
}
