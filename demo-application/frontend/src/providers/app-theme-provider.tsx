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

import {ThemeProvider, extendTheme} from '@oxygen-ui/react';
import type {CustomColors} from "../hooks/config-interfaces.ts";

/** ApplicationThemeProviderProps implementation */
interface ApplicationThemeProviderProps {
    children?: React.ReactNode;
    color?: CustomColors[];
}

/**
 * Executes the AppThemeProvider operation and modify the payload if necessary.
 *
 * @param children        The children parameter
 * @param color           The color parameter
 */
const AppThemeProvider = ({children,color}:ApplicationThemeProviderProps) => {
    /**
     * Executes the customColors operation and modify the payload if necessary.
     */
    const customColors = (color || []).reduce((acc, currentObject) => {
        return { ...acc, ...currentObject };
    }, {});
    const theme = extendTheme({
        typography: {
            fontFamily: 'Inter',
        },
        colorSchemes: {
            light: {
                palette: {
                    primary: {
                        main: customColors.primary,
                        secondaryColor:customColors.secondaryColor,
                        button: customColors.button,
                        backgroundColor: customColors.backgroundColor,
                        tableBackground: customColors.tableBackground,
                        innerButtonBackground: customColors.innerButtonBackground,
                        bankColor1:customColors.bankColor1,
                        bankColor2:customColors.bankColor2,
                        bankColor3:customColors.bankColor3,
                        bankBackground:customColors.bankBackground,
                        formValidationError: customColors.formValidationError,
                        tableHeaderBackground: customColors.tableHeaderBackground,
                        tableHeaderFontColor: customColors.tableHeaderFontColor,
                        tableBodyColor: customColors.tableBackgroundColor,
                        greenArrowColor: customColors.greenArrowColor,
                        redArrowColor: customColors.redArrowColor,
                        requiredStar: customColors.requiredStar
                    },
                    fontColor: {
                        white: customColors.fontWhite,
                    },
                },
            },
            dark: {
                palette: {
                    primary: {
                        main: '#FF5456',
                    },
                },
            },
        },
    });

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;
