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

import java.util.List;

/** LoadPaymentPageResponse implementation */
public class LoadPaymentPageResponse {
    List<BankInfoInPayments> banks;
    List<Payee> payees;
    List<String> currencies;

    public LoadPaymentPageResponse(List<BankInfoInPayments> banks, List<Payee> payees, List<String> currencies) {
        this.banks = banks;
        this.payees = payees;
        this.currencies = currencies;
    }

    /**
     * Executes the getBanks operation and modify the payload if necessary.
     */
    public List<BankInfoInPayments> getBanks() {
        return banks;
    }

    /**
     * Executes the setBanks operation and modify the payload if necessary.
     *
     * @param banks           The banks parameter
     */
    public void setBanks(List<BankInfoInPayments> banks) {
        this.banks = banks;
    }

    /**
     * Executes the getPayees operation and modify the payload if necessary.
     */
    public List<Payee> getPayees() {
        return payees;
    }

    /**
     * Executes the setPayees operation and modify the payload if necessary.
     *
     * @param payees          The payees parameter
     */
    public void setPayees(List<Payee> payees) {
        this.payees = payees;
    }

    /**
     * Executes the getCurrencies operation and modify the payload if necessary.
     */
    public List<String> getCurrencies() {
        return currencies;
    }

    /**
     * Executes the setCurrencies operation and modify the payload if necessary.
     *
     * @param currencies      The currencies parameter
     */
    public void setCurrencies(List<String> currencies) {
        this.currencies = currencies;
    }
}
