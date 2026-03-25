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

import { useEffect, useState } from "react";
import ApplicationLayout from "../../layouts/application-layout/application-layout.tsx";
import { useLocation } from "react-router-dom";
import PaymentAccountPageLayout from "../../layouts/payment-account-page-layout/payment-account-page-layout.tsx";
import type { Bank } from "../../hooks/config-interfaces.ts";
import { Box, Button, Card } from "@oxygen-ui/react";
import "./add-account.scss";
import { RedirectionComponent } from "../../components/redirection-component.tsx";
import { api } from "../../utility/api.ts";
import { resolveImageUrl } from "../../utility/image-utils.ts";

/** NavigationState implementation */
interface NavigationState {
    name: string;
}

/**
 * Executes the AddAccountsPage operation and modify the payload if necessary.
 */
const AddAccountsPage = () => {
    const location = useLocation();
    const navigationState = location.state as NavigationState;
    const appName = navigationState?.name;

    const [bankInformations, setBankInformations] = useState<Bank[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

    /**
     * Executes the useEffect operation and modify the payload if necessary.
     *
     * @param (               The ( parameter
     */
    useEffect(() => {
        api.get<Bank[]>("accounts")
            .then((data) => {
                const patched = data.map((bank) => ({
                    ...bank,
                    image: resolveImageUrl(bank.image)
                }));
                /**
                 * Executes the setBankInformations operation and modify the payload if necessary.
                 *
                 * @param patched         The patched parameter
                 */
                setBankInformations(patched);
            })
            .catch((err) => {
                console.error("Failed to fetch bank information:", err);
            })
            .finally(() => {
                /**
                 * Executes the setIsLoading operation and modify the payload if necessary.
                 *
                 * @param false           The false parameter
                 */
                setIsLoading(false);
            });
    }, []);

    /**
     * Executes the onAddAccountsHandler operation and modify the payload if necessary.
     *
     * @param bankName        The bankName parameter
     */
    const onAddAccountsHandler = async (bankName: string) => {
        /**
         * Executes the setIsRedirecting operation and modify the payload if necessary.
         *
         * @param true            The true parameter
         */
        setIsRedirecting(true);
        try {
            const data = await api.post<{ redirect: string }>("addaccounts", { bankName });
            window.location.href = data.redirect;
        } catch (err) {
            console.error("Failed to add account:", err);
            /**
             * Executes the setIsRedirecting operation and modify the payload if necessary.
             *
             * @param false           The false parameter
             */
            setIsRedirecting(false);
        }
    };

    if (isRedirecting) {
        return <RedirectionComponent />;
    }

    const availableBanks = bankInformations.filter((b) => b.flag);
    const addedBanks = bankInformations.filter((b) => !b.flag);

    return (
        <ApplicationLayout name={appName}>
            <PaymentAccountPageLayout title={"Add Account"}>
                <Box className="accounts-outer">
                    {isLoading ? (
                        <p>Loading banks...</p>
                    ) : (
                        <>
                            {}
                            <h3 style={{ marginBottom: "1rem" }}>Select your Bank</h3>
                            <div
                                className="accounts-buttons-container"
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    marginBottom: "2rem"
                                }}
                            >
                                {availableBanks.map((account, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => onAddAccountsHandler(account.name)}
                                    >
                                        <Card>
                                            <Box className={"account-button-outer"}>
                                                <Box
                                                    className={"logo-container"}
                                                    sx={{ marginLeft: "2rem" }}
                                                >
                                                    <img
                                                        src={account.image}
                                                        alt={`${account.name} logo`}
                                                    />
                                                </Box>
                                                <p>{account.name}</p>
                                            </Box>
                                        </Card>
                                    </Button>
                                ))}
                            </div>

                            {}
                            {addedBanks.length > 0 && (
                                <>
                                    <h3 style={{ marginBottom: "1rem" }}>Already Added Banks</h3>
                                    <div
                                        className="accounts-buttons-container"
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
                                            gap: "1rem"
                                        }}
                                    >
                                        {addedBanks.map((account, index) => (
                                            <Card
                                                key={index}
                                                style={{
                                                    opacity: 0.4,
                                                    cursor: "not-allowed"
                                                }}
                                            >
                                                <Box className={"account-button-outer"}>
                                                    <Box
                                                        className={"logo-container"}
                                                        sx={{ marginLeft: "2rem" }}
                                                    >
                                                        <img
                                                            src={account.image}
                                                            alt={`${account.name} logo`}
                                                        />
                                                    </Box>
                                                    <p style={{ color: "#aaa" }}>{account.name}</p>
                                                </Box>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </Box>
            </PaymentAccountPageLayout>
        </ApplicationLayout>
    );
};

export default AddAccountsPage;
