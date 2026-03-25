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
 * Executes the generateTransactionId operation and modify the payload if necessary.
 *
 * @param existingTransactions The existingTransactions parameter
 */
export const generateTransactionId = (existingTransactions: any[] = []): string => {
    const existingIds = new Set(
        existingTransactions.map(txn => txn.id)
    );

    let newId: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        
        const randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
        newId = `T${randomNumber}`;
        attempts++;

        if (attempts >= maxAttempts) {
            
            const timestamp = Date.now().toString().slice(-8);
            newId = `T${timestamp}`;
            break;
        }
    } while (existingIds.has(newId));

    return newId;
};

/**
 * Executes the getNextTransactionId operation and modify the payload if necessary.
 *
 * @param existingTransactions The existingTransactions parameter
 */
export const getNextTransactionId = (existingTransactions: any[]): string => {
    return generateTransactionId(existingTransactions);
};
