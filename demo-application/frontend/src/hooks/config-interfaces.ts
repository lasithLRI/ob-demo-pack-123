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

/** User implementation */
export interface User {
    name: string;
    image: string;
    background: string;
}

/** DynamicBanks implementation */
export interface DynamicBanks {
    name: string;
    route: string;
    startingAccountNumbers: string;
}

/** AppInfo implementation */
export interface AppInfo {
    route: string;
    applicationName: string;
}

/** Bank implementation */
export interface Bank {
    name: string;
    image: string;
    currency: string;
    color: string;
    border: string;
    startingAccountNumbers: string;
    accounts: Account[];
    route: string;
    bankThemeId: number;
    standingOrders: StandingOrders[];
    flag: boolean;
}

/** Account implementation */
export interface Account {
    id: string;
    bank: string;
    name: string;
    balance: number;
    transactions: TransactionData[];
    notPermitedActions?: string[];
}

/** Payee implementation */
export interface Payee {
    name: string;
    bank: string;
    accountNumber: string;
}

/** TransactionData implementation */
export interface TransactionData {
    "id": string,
    "date": string,
    "reference": string,
    "bank": string,
    "account": string,
    "amount": string,
    "currency": string,
    "creditDebitStatus": string
}

/** StandingOrders implementation */
export interface StandingOrders {
    "id": string,
    "reference": string,
    "bank": string,
    "nextDate": string,
    "status": string,
    "amount": string,
    "currency": string,
}

/** Step implementation */
export interface Step {
    id: string;
    name: string;
    component: string;
}

/** UseCase implementation */
export interface UseCase {
    id: string;
    title: string;
    userVerification: string;
    consentDisplay: string;
    steps: Step[];
}

/** Type implementation */
export interface Type {
    id: string;
    title: string;
    useCases: UseCase[];
}

/** TableConfigs implementation */
export interface TableConfigs {
    [key: string]: string;
}

/** CustomColors implementation */
export interface CustomColors {
    [key: string]: string;
}

/** LocalConfig implementation */
export interface LocalConfig {
    user: User;
    name: AppInfo;
    types: Type[];
    transactionTableHeaderData: TableConfigs[];
    standingOrdersTableHeaderData: TableConfigs[];
    colors: CustomColors[];
    accountNumbersToAdd: string[];
}

/** ConfigResponse implementation */
export interface ConfigResponse {
    banks: Bank[];
    payees: Payee[];
    transactions: TransactionData[];
    standingOrders: StandingOrders[];
}

export type Config = LocalConfig & ConfigResponse;
