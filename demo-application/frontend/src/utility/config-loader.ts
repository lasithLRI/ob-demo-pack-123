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

import type {Config} from "../hooks/config-interfaces";

export const baseConfigFileLocation = '/ob-demo-backend-1.0.0/configurations/config.json';

let config : Config | null = null;

/**
 * Executes the loadConfigFile operation and modify the payload if necessary.
 */
export async function loadConfigFile(): Promise<Config> {
    if(config) return config;
    const response = await fetch(baseConfigFileLocation)
    if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
    }
    config = await response.json();
    return config as Config;
}
