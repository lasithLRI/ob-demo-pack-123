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

import {Box, Button, Menu, MenuItem} from "@oxygen-ui/react";

// @ts-ignore
import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import React, { useState } from "react";

/** TitleProps implementation */
interface TitleProps {
    title: string;
    buttonName?: string;
    buttonType?: "contained"|"outlined";
    onPress?: (buttonName:string,title?:string) => void;
}

/**
 * Executes the CustomTitle operation and modify the payload if necessary.
 *
 * @param title           The title parameter
 * @param buttonName      The buttonName parameter
 * @param buttonType      The buttonType parameter
 * @param onPress         The onPress parameter
 */
const CustomTitle = ({title,buttonName,buttonType, onPress}:TitleProps)=>{

    const visibility = buttonName? "flex" : "none";

    let onboardingClass;

    if (buttonName === "Add Account"){
        onboardingClass = "add-account-btn"
    }else if(buttonName === "View More" && title === "Latest Transactions"){
        onboardingClass = "view-all-transactions"
    }else if(buttonName === "View More" && title === "Standing Orders"){
        onboardingClass = "view-all-standing-orders"
    }else{
        onboardingClass = ""
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    /**
     * Executes the handleClick operation and modify the payload if necessary.
     *
     * @param event           The event parameter
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        /**
         * Executes the setAnchorEl operation and modify the payload if necessary.
         *
         * @param event.currentTarget The event.currentTarget parameter
         */
        setAnchorEl(event.currentTarget);
    };

    /**
     * Executes the handleClose operation and modify the payload if necessary.
     */
    const handleClose = () => {
        /**
         * Executes the setAnchorEl operation and modify the payload if necessary.
         *
         * @param null            The null parameter
         */
        setAnchorEl(null);
    };

    /**
     * Executes the handleMenuClick operation and modify the payload if necessary.
     *
     * @param action          The action parameter
     */
    const handleMenuClick = (action: string) => {
        /**
         * Executes the handleClose operation and modify the payload if necessary.
         */
        handleClose();
        onPress?.(action, title);
    };

    if (buttonName === "Accounts") {
        return (
            <Box className={"title-container"}>
                <p>{title}</p>
                <Button 
                    className="add-account-btn"
                    variant={buttonType} 
                    onClick={handleClick}
                    endIcon={<ChevronDownIcon />}
                >
                    {buttonName}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleMenuClick("Add Account")}>Add Account</MenuItem>
                    <MenuItem onClick={() => handleMenuClick("Delete Account")}>Delete Account</MenuItem>
                </Menu>
            </Box>
        );
    }

    return(
        <>
            <Box className={"title-container"}>
                <p>{title}</p>
                <Button className={`${onboardingClass}`} sx={{display:visibility}} variant={buttonType} onClick={()=>{onPress?.(buttonName||'',title)}}>{buttonName}</Button>
            </Box>
        </>
    );
}

export default CustomTitle;
