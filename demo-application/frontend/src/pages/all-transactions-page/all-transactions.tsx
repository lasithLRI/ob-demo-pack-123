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

import ApplicationLayout from "../../layouts/application-layout/application-layout.tsx";
import PaymentAccountPageLayout from "../../layouts/payment-account-page-layout/payment-account-page-layout.tsx";
import {Box, Button} from "@oxygen-ui/react";
import type {TableConfigs, TransactionData} from "../../hooks/config-interfaces.ts";
import {useState, useEffect} from "react";
import TableComponent from "../../components/table-component.tsx";

/** AllTransactionsProps implementation */
interface AllTransactionsProps {
    name: string;
    transactions: TransactionData[];
    transactionTableHeaderData?: TableConfigs[];
}

/**
 * Executes the AllTransactionsPage operation and modify the payload if necessary.
 *
 * @param name            The name parameter
 * @param transactions    The transactions parameter
 * @param transactionTableHeaderData The transactionTableHeaderData parameter
 */
const AllTransactionsPage = ({name, transactions,
                                 transactionTableHeaderData}: AllTransactionsProps) => {

    const itemsPerPage = 10;

    /**
     * Executes the getInitialPage operation and modify the payload if necessary.
     */
    const getInitialPage = () => {
        const savedPage = sessionStorage.getItem('allTransactionsCurrentPage');
        return savedPage ? parseInt(savedPage, 10) : 1;
    };
    const [currentPage, setCurrentPage] = useState(getInitialPage);
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    /**
     * Executes the startIndex operation and modify the payload if necessary.
     */
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const transactionsToDisplay = transactions.slice(startIndex, endIndex);
    /**
     * Executes the useEffect operation and modify the payload if necessary.
     *
     * @param (               The ( parameter
     */
    useEffect(() => {
        sessionStorage.setItem('allTransactionsCurrentPage', currentPage.toString());
    }, [currentPage]);
    /**
     * Executes the useEffect operation and modify the payload if necessary.
     *
     * @param (               The ( parameter
     */
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            /**
             * Executes the setCurrentPage operation and modify the payload if necessary.
             *
             * @param totalPages      The totalPages parameter
             */
            setCurrentPage(totalPages);
        }
    }, [transactions, currentPage, totalPages]);
    /**
     * Executes the handlePageChange operation and modify the payload if necessary.
     *
     * @param newPage         The newPage parameter
     */
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            /**
             * Executes the setCurrentPage operation and modify the payload if necessary.
             *
             * @param newPage         The newPage parameter
             */
            setCurrentPage(newPage);
            
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    /**
     * Executes the handlePrevious operation and modify the payload if necessary.
     */
    const handlePrevious = () => {
        if (currentPage > 1) {
            /**
             * Executes the handlePageChange operation and modify the payload if necessary.
             */
            handlePageChange(currentPage - 1);
        }
    }
    /**
     * Executes the handleNext operation and modify the payload if necessary.
     */
    const handleNext = () => {
        if (currentPage < totalPages) {
            /**
             * Executes the handlePageChange operation and modify the payload if necessary.
             */
            handlePageChange(currentPage + 1);
        }
    }
    const showPrevButton = currentPage > 1;
    const showNextButton = currentPage < totalPages;
    return (
        <>
            <ApplicationLayout name={name}>
                <PaymentAccountPageLayout title={"Transactions"}>
                    <Box className={'table-container'}>
                        <TableComponent
                            dataLimit={9}
                            tableData={transactionsToDisplay}
                            tableType={"transaction"}
                            dataConfigs={transactionTableHeaderData}
                        />
                        {}
                        {totalPages > 1 && (
                            <Box className="pagination-container" sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1rem',
                                marginTop: '2rem',
                                flexWrap: 'wrap'
                            }}>
                                {}
                                {showPrevButton && (
                                    <Button
                                        onClick={handlePrevious}
                                        variant="outlined"
                                        sx={{
                                            minWidth: '100px',
                                            height: '40px',
                                        }}
                                    >
                                        Previous
                                    </Button>
                                )}

                                {}
                                <Box sx={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center'
                                }}>
                                    {Array.from({length: totalPages}, (_, i) => i + 1)
                                        .map((page) => (
                                        <Button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            variant={currentPage === page ? "contained" : "outlined"}
                                            sx={{
                                                minWidth: '40px',
                                                height: '40px',
                                                fontWeight: currentPage === page ? 'bold' : 'normal'
                                            }}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </Box>

                                {}
                                {showNextButton && (
                                    <Button
                                        onClick={handleNext}
                                        variant="outlined"
                                        sx={{
                                            minWidth: '100px',
                                            height: '40px',
                                        }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        )}

                        {}
                        {totalPages > 1 && (
                            <Box sx={{
                                textAlign: 'center',
                                marginTop: '1rem',
                                color: 'text.secondary',
                                fontSize: '0.875rem'
                            }}>
                                Page {currentPage} of {totalPages} | Showing {startIndex + 1}-
                                {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
                            </Box>
                        )}
                    </Box>
                </PaymentAccountPageLayout>
            </ApplicationLayout>
        </>
    )
}

export default AllTransactionsPage;
