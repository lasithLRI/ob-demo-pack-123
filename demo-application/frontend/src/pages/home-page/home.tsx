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

import React, { useState } from "react";
import { Grid } from "@mui/material";
import HomePageLayout from "../../layouts/home-page-layout/home-page-layout.tsx";
import type {
    AppInfo,
    Bank,
    StandingOrders,
    TableConfigs,
    TransactionData,
    User
} from "../../hooks/config-interfaces.ts";
import type { BanksWithAccounts, ChartData, OverlayDataProp } from "../../hooks/use-config-context.ts";
import { InfographicsContent } from "./infographics-content/infographics-content.tsx";
import ConnectedBanksAccounts from "./connected-banks-accounts/connected-banks-accounts.tsx";
import CustomTitle from "../../components/custom-title/custom-title.tsx";
import { useNavigate } from "react-router-dom";
import OverlayConfirmation from "../../components/overlay-confirmation/overlay-confirmation.tsx";
import TableComponent from "../../components/table-component.tsx";
import ApplicationLayout from "../../layouts/application-layout/application-layout.tsx";
import { DeleteAccountModal } from "./delete-account-model.tsx";

/** AccountsCentralLayoutProps implementation */
interface AccountsCentralLayoutProps {
    children?: React.ReactNode;
    name: string;
    userInfo: User;
    total: number;
    chartData: ChartData;
    banksWithAccounts: BanksWithAccounts[];
    transactions: TransactionData[];
    standingOrderList: StandingOrders[];
    appInfo: AppInfo;
    banksList: Bank[];
    overlayInformation: OverlayDataProp;
    transactionTableHeaderData?: TableConfigs[];
    standingOrdersTableHeaderData?: TableConfigs[];
    onRefetch: () => void;  
}

/**
 * Executes the Home operation and modify the payload if necessary.
 *
 * @param name            The name parameter
 * @param userInfo        The userInfo parameter
 * @param total           The total parameter
 * @param chartData       The chartData parameter
 * @param banksWithAccounts The banksWithAccounts parameter
 * @param transactions    The transactions parameter
 * @param standingOrderList The standingOrderList parameter
 * @param appInfo         The appInfo parameter
 * @param overlayInformation The overlayInformation parameter
 * @param transactionTableHeaderData The transactionTableHeaderData parameter
 * @param onRefetch       The onRefetch parameter
 * @param                 The  parameter
 */
const Home = ({
                  standingOrdersTableHeaderData, name, userInfo, total, chartData,
                  banksWithAccounts, transactions, standingOrderList, appInfo,
                  overlayInformation, transactionTableHeaderData, onRefetch,
              }: AccountsCentralLayoutProps) => {

    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    /**
     * Executes the addAccount operation and modify the payload if necessary.
     */
    const addAccount = () => {
        /**
         * Executes the navigate operation and modify the payload if necessary.
         *
         * @param `/$appInfo.route/accounts` The `/$appInfo.route/accounts` parameter
         */
        navigate(`/${appInfo.route}/accounts`, {
            state: {
                name: appInfo.applicationName,
            }
        });
    };

    /**
     * Executes the viewMore operation and modify the payload if necessary.
     *
     * @param title           The title parameter
     */
    const viewMore = (title?: string) => {
        const route = title === "Latest Transactions" ? "transactions" : "standing-orders";
        /**
         * Executes the navigate operation and modify the payload if necessary.
         *
         * @param `/$appInfo.route/$route` The `/$appInfo.route/$route` parameter
         */
        navigate(`/${appInfo.route}/${route}`);
    };

    /**
     * Executes the onButtonHandler operation and modify the payload if necessary.
     *
     * @param buttonName      The buttonName parameter
     * @param title           The title parameter
     */
    const onButtonHandler = (buttonName: string, title?: string) => {
        if (buttonName === "Add Account") {
            /**
             * Executes the addAccount operation and modify the payload if necessary.
             */
            addAccount();
        } else if (buttonName === "Delete Account") {
            /**
             * Executes the setOpenDeleteModal operation and modify the payload if necessary.
             *
             * @param true            The true parameter
             */
            setOpenDeleteModal(true);
        } else if (buttonName === "View More") {
            /**
             * Executes the viewMore operation and modify the payload if necessary.
             *
             * @param title           The title parameter
             */
            viewMore(title);
        }
    };

    /**
     * Executes the handleAccountDeletedSuccess operation and modify the payload if necessary.
     */
    const handleAccountDeletedSuccess = () => {
        /**
         * Executes the onRefetch operation and modify the payload if necessary.
         */
        onRefetch();
    };

    return (
        <>
            <ApplicationLayout name={name}>
                <HomePageLayout userInfo={userInfo} appInfo={appInfo}>
                    <Grid className={'info-graphic'}>
                        <InfographicsContent total={total} chartInfo={chartData} />
                    </Grid>
                    <Grid className={'accounts-container'}>
                        <CustomTitle title={"Connected Banks"} buttonName={"Accounts"} buttonType={"contained"}
                                     onPress={onButtonHandler} />
                        <ConnectedBanksAccounts bankAndAccountsInfo={banksWithAccounts} />
                    </Grid>
                    <Grid className={'transactions-container'}>
                        <CustomTitle title={"Latest Transactions"} buttonName={"View More"} buttonType={"outlined"}
                                     onPress={onButtonHandler} />
                        <TableComponent tableData={transactions} tableType={"transaction"}
                                        dataConfigs={transactionTableHeaderData} />
                    </Grid>
                    <Grid className={'standing-orders-container'}>
                        <CustomTitle title={"Standing Orders"} buttonName={"View More"} buttonType={"outlined"}
                                     onPress={onButtonHandler} />
                        <TableComponent tableData={standingOrderList} dataConfigs={standingOrdersTableHeaderData}
                                        tableType={""} />
                    </Grid>
                </HomePageLayout>
            </ApplicationLayout>

            {overlayInformation.flag &&
                <OverlayConfirmation
                    onConfirm={overlayInformation.overlayData.onMainButtonClick}
                    onCancel={() => {}}
                    mainButtonText={overlayInformation.overlayData.mainButtonText}
                    secondaryButtonText={overlayInformation.overlayData.secondaryButtonText}
                    content={overlayInformation.overlayData.context}
                    title={overlayInformation.overlayData.title}
                />
            }

            <DeleteAccountModal 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)}
                onSuccess={handleAccountDeletedSuccess}
            />
        </>
    );
};

export default Home;
