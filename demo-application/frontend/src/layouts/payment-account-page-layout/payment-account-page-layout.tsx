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

import {Box, IconButton} from "@oxygen-ui/react";
import { useNavigate } from "react-router-dom";

// @ts-ignore
import {ChevronLeftIcon} from "@oxygen-ui/react-icons";

/** PageLayoutProps implementation */
interface PageLayoutProps {
    children?: React.ReactNode;
    title: string;
}

/**
 * Executes the PaymentAccountPageLayout operation and modify the payload if necessary.
 *
 * @param children        The children parameter
 * @param title           The title parameter
 */
const PaymentAccountPageLayout = ({children,title}:PageLayoutProps)=>{
    const navigate = useNavigate();
    /**
     * Executes the handleBackNavigation operation and modify the payload if necessary.
     */
    const handleBackNavigation = ()=>{
        /**
         * Executes the navigate operation and modify the payload if necessary.
         *
         * @param -1              The -1 parameter
         */
        navigate(-1);
    }
    return (
        <>
            <Box className='title-and-back-container'>
                <IconButton onClick={handleBackNavigation}>
                    <ChevronLeftIcon size={'24'}/>
                </IconButton>
                <h3>{title}</h3>
            </Box>
            <Box className={'payments-layout'}>
                {children}
            </Box>
        </>
    );
}

export default PaymentAccountPageLayout;
