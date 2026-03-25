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

/**
 * Executes the calculateNextDate operation and modify the payload if necessary.
 *
 * @param daysToAdd       The daysToAdd parameter
 */
export const calculateNextDate = (daysToAdd: number): string => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + daysToAdd);

    return futureDate.toISOString().split('T')[0];
};

/**
 * Executes the processStandingOrders operation and modify the payload if necessary.
 *
 * @param standingOrders  The standingOrders parameter
 */
export const processStandingOrders = (standingOrders: any[]): any[] => {
    return standingOrders.map(order => ({
        ...order,
        nextDate: typeof order.nextDate === 'number'
            ? calculateNextDate(order.nextDate)
            : order.nextDate
    }));
};

/**
 * Executes the calculatePastDate operation and modify the payload if necessary.
 *
 * @param daysAgo         The daysAgo parameter
 */
export const calculatePastDate = (daysAgo: number): string => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - daysAgo);

    return pastDate.toISOString().split('T')[0];
};

/**
 * Executes the processTransactions operation and modify the payload if necessary.
 *
 * @param transactions    The transactions parameter
 */
export const processTransactions = (transactions: any[]): any[] => {
    return transactions.map(txn => ({
        ...txn,
        date: typeof txn.date === 'number'
            ? calculatePastDate(txn.date)
            : txn.date
    }));
};

/**
 * Executes the processAllBankDates operation and modify the payload if necessary.
 *
 * @param banks           The banks parameter
 */
export const processAllBankDates = (banks: any[]): any[] => {
    return banks.map(bank => {
        const processedAccounts = bank.accounts?.map((account: any) => ({
            ...account,
            transactions: account.transactions
                ? processTransactions(account.transactions)
                : []
        })) || [];

        const processedStandingOrders = bank.standingOrders
            ? processStandingOrders(bank.standingOrders)
            : [];

        return {
            ...bank,
            accounts: processedAccounts,
            standingOrders: processedStandingOrders
        };
    });
};
