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

export const baseUrl = '/ob-demo-backend-1.0.0/init';

/**
 * Executes the fetchData operation and modify the payload if necessary.
 *
 * @param endpoint        The endpoint parameter
 * @param options         The options parameter
 */
const fetchData = async (endpoint: string, options?: RequestInit) => {
    
    const url = new URL(`${window.location.origin}${baseUrl}/${endpoint}`);
    if (!options || !options.method || options.method === 'GET') {
        url.searchParams.append('t', new Date().getTime().toString());
    }
    
    try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (e) {
        console.error(`error in fetchData: ${e}`);
        throw e;
    }
};

/** ApiService implementation */
interface ApiService {
    get: <T>(endpoint: string) => Promise<T>;
    post: <T>(endpoint: string, body: unknown) => Promise<T>;
    delete: <T>(endpoint: string) => Promise<T>;  

}

export const api: ApiService = {
    get: <T>(endpoint: string): Promise<T> => fetchData(endpoint),
    post: <T>(endpoint: string, body: unknown): Promise<T> =>
        /**
         * Executes the fetchData operation and modify the payload if necessary.
         *
         * @param endpoint        The endpoint parameter
         * @param headers         The headers parameter
         * @param                 The  parameter
         * @param body            The body parameter
         */
        fetchData(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string): Promise<T> =>   
        /**
         * Executes the fetchData operation and modify the payload if necessary.
         *
         * @param endpoint        The endpoint parameter
         */
        fetchData(endpoint, { method: "DELETE" }),
};
