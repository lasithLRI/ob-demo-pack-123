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

import {Controller, useForm} from "react-hook-form";
import type { FieldError } from "react-hook-form";
import {Box, Button, FormControl, MenuItem, OutlinedInput, Select} from "@oxygen-ui/react";
import {NumericFormat} from "react-number-format";
import {useState, useEffect, useRef} from "react";

import type {AppInfo, Bank, Payee} from "../../../hooks/config-interfaces.ts";
import OverlayConfirmation from "../../../components/overlay-confirmation/overlay-confirmation.tsx";
import '../payments-page.scss'
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material";
import type {BanksWithAccounts} from "../../../hooks/use-config-context.ts";
import { RedirectionComponent } from "../../../components/redirection-component.tsx";
import { api } from "../../../utility/api.ts";

/** PaymentFormData implementation */
export interface PaymentFormData {
    userAccount: string;
    payeeAccount: string;
    currency: string;
    amount: number;
    reference: string;
    appInfo: AppInfo;
}

/** PaymentFormProps implementation */
interface PaymentFormProps {
    banksWithAllAccounts: BanksWithAccounts[];
    payeeData: Payee[];
    banksList: Bank[];
}

/** LoadPaymentResponse implementation */
interface LoadPaymentResponse {
    [key: string]: unknown;
}

/** PaymentResponse implementation */
interface PaymentResponse {
    redirect?: string;
}

/**
 * Executes the ErrorMessage operation and modify the payload if necessary.
 */
export const ErrorMessage = ({ error }: { error: FieldError | undefined }) => {
    if (!error) return null;
    return <p className={"error-message-payments"}>{error.message}</p>
}

/**
 * Executes the PaymentForm operation and modify the payload if necessary.
 *
 * @param banksWithAllAccounts The banksWithAllAccounts parameter
 * @param payeeData       The payeeData parameter
 * @param banksList       The banksList parameter
 */
const PaymentForm = ({banksWithAllAccounts, payeeData, banksList}: PaymentFormProps) => {

    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('md'));
    const responsiveDirection = isSmallScreen ? 'column' : 'row';
    const {control, handleSubmit, formState: {errors}, reset} = useForm<PaymentFormData>({
        defaultValues: {
            userAccount: '',
            payeeAccount: '',
            currency: 'GBP',
            amount: 0,
            reference: ''
        }
    });

    const [isConfirming, setIsConfirming] = useState(false);
    const [formDataToSubmit, setFormDataToSubmit] = useState<PaymentFormData | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Executes the useEffect operation and modify the payload if necessary.
     *
     * @param (               The ( parameter
     */
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                /**
                 * Executes the clearTimeout operation and modify the payload if necessary.
                 *
                 * @param timerRef.current The timerRef.current parameter
                 */
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    /**
     * Executes the useEffect operation and modify the payload if necessary.
     *
     * @param (               The ( parameter
     */
    useEffect(() => {
        api.get<LoadPaymentResponse>('load-payment')
            .then(data => {
                console.log('Loaded payment data from /load-payment:', data);
            })
            .catch((err: unknown) => {
                console.error('Failed to load payment data', err);
            });
    }, []);

    /**
     * Executes the onSubmit operation and modify the payload if necessary.
     *
     * @param data            The data parameter
     */
    const onSubmit = (data: PaymentFormData) => {
        /**
         * Executes the setFormDataToSubmit operation and modify the payload if necessary.
         *
         * @param data            The data parameter
         */
        setFormDataToSubmit(data);
        /**
         * Executes the setIsConfirming operation and modify the payload if necessary.
         *
         * @param true            The true parameter
         */
        setIsConfirming(true);
    };

    /**
     * Executes the handleConfirmedAndRedirect operation and modify the payload if necessary.
     */
    const handleConfirmedAndRedirect = async () => {
        if (formDataToSubmit) {
            /**
             * Executes the setIsConfirming operation and modify the payload if necessary.
             *
             * @param false           The false parameter
             */
            setIsConfirming(false);
            /**
             * Executes the setIsRedirecting operation and modify the payload if necessary.
             *
             * @param true            The true parameter
             */
            setIsRedirecting(true);
            const bankName = formDataToSubmit.userAccount.split('-')[0];
            const target = banksList.find((bank) => bank.name === bankName);
            if (!target) {
                console.log(`Bank "${bankName}" not found in banksList`);
                /**
                 * Executes the setIsRedirecting operation and modify the payload if necessary.
                 *
                 * @param false           The false parameter
                 */
                setIsRedirecting(false);
                return;
            }

            try {
                const payload = {
                    userAccount: formDataToSubmit.userAccount,
                    payeeAccount: formDataToSubmit.payeeAccount,
                    currency: formDataToSubmit.currency,
                    amount: formDataToSubmit.amount.toString(),
                    reference: formDataToSubmit.reference
                };

                const res = await api.post<PaymentResponse>('payment', payload);
                if (res && res.redirect) {
                    timerRef.current = setTimeout(() => {
                        window.location.href = res.redirect as string;
                    }, 1000);
                } else {
                    console.error("No redirect URL found in the response.", res);
                    /**
                     * Executes the setIsRedirecting operation and modify the payload if necessary.
                     *
                     * @param false           The false parameter
                     */
                    setIsRedirecting(false);
                }
            } catch (err: unknown) {
                console.error("Payment API error:", err);
                /**
                 * Executes the setIsRedirecting operation and modify the payload if necessary.
                 *
                 * @param false           The false parameter
                 */
                setIsRedirecting(false);
            }
        }
    };

    /**
     * Executes the handleCancelConfirmation operation and modify the payload if necessary.
     */
    const handleCancelConfirmation = () => {
        /**
         * Executes the setIsConfirming operation and modify the payload if necessary.
         *
         * @param false           The false parameter
         */
        setIsConfirming(false);
        /**
         * Executes the setFormDataToSubmit operation and modify the payload if necessary.
         *
         * @param null            The null parameter
         */
        setFormDataToSubmit(null);
    };

    const paymentConfirmationMsg = `Do you wish to proceed with the payment 
    of ${formDataToSubmit?.currency} ${formDataToSubmit?.amount} to payee ${formDataToSubmit?.payeeAccount}? `;

    if (isRedirecting) {
        return <RedirectionComponent/>;
    }

    return (
        <>
            <h2 className={"payment-form-heading"}>Payment Information</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth={true} margin={'dense'}>
                    <label>Select Account <span style={{color: "var(--oxygen-palette-primary-requiredStar)"}}>*</span></label>
                    <Controller name={'userAccount'} control={control} rules={{required: true}} render={({field}) => (
                        <Select {...field}
                                displayEmpty
                                renderValue={(value) => {
                                    const selected = value as string;
                                    if (selected === "") {
                                        return (
                                            <span style={{color: 'rgba(0, 0, 0, 0.38)'}}>Select your account</span>
                                        );
                                    }
                                    return selected;
                                }}
                                error={!!errors.userAccount}>
                            {banksWithAllAccounts.map((bankWithAccounts) =>
                                bankWithAccounts.accounts.map((account) => {
                                    const isEnabled = bankWithAccounts.bank.flag;
                                    return (
                                        <MenuItem
                                            key={`${bankWithAccounts.bank.name}-${account.id}`}
                                            value={`${bankWithAccounts.bank.name}-${account.id}`}
                                            disabled={!isEnabled}
                                            style={{
                                                opacity: isEnabled ? 1 : 0.4,
                                                cursor: isEnabled ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            {bankWithAccounts.bank.name}-{account.id}
                                        </MenuItem>
                                    );
                                })
                            )}
                        </Select>
                    )}/>
                    <ErrorMessage error={errors.userAccount}/>
                </FormControl>

                <FormControl fullWidth={true} margin={'dense'}>
                    <label>Biller <span style={{color: "var(--oxygen-palette-primary-requiredStar)"}}>*</span></label>
                    <Controller name={'payeeAccount'} control={control} rules={{required: true}} render={({field}) => (
                        <Select {...field}
                                displayEmpty
                                renderValue={(value) => {
                                    const selected = value as string;
                                    if (selected === "") {
                                        return (
                                            <span style={{color: 'rgba(0, 0, 0, 0.38)'}}>Select biller account</span>
                                        );
                                    }
                                    return selected;
                                }}
                                error={!!errors.payeeAccount}>
                            {payeeData.map((payee, index) => (
                                <MenuItem key={index} value={`${payee.name}-${payee.accountNumber}`}>
                                    {payee.name}-{payee.accountNumber}
                                </MenuItem>
                            ))}
                        </Select>
                    )}/>
                    <ErrorMessage error={errors.payeeAccount}/>
                </FormControl>

                <div style={{display: 'flex', gap: '1rem'}}>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <label>Currency</label>
                        <OutlinedInput value="GBP" disabled/>
                    </FormControl>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <label>Amount <span style={{color: "var(--oxygen-palette-primary-requiredStar)"}}>*</span></label>
                        <Controller name={'amount'} control={control}
                                    rules={{required: true, min: 0.01}}
                                    render={({field}) => (
                                        <NumericFormat
                                            {...field}
                                            value={field.value === 0 ? '' : field.value}
                                            customInput={OutlinedInput}
                                            thousandSeparator={true}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            allowLeadingZeros={false}
                                            allowNegative={false}
                                            onValueChange={(values) => {
                                                field.onChange(values.floatValue || 0);
                                            }}
                                            error={!!errors.amount}
                                            placeholder="0.00"
                                            type="text"
                                        />
                                    )}/>
                        <ErrorMessage error={errors.amount}/>
                    </FormControl>
                </div>

                <FormControl fullWidth={true} margin={'dense'} sx={{height: '2vh'}}>
                    <label>Reference <span style={{color: "var(--oxygen-palette-primary-requiredStar)"}}>*</span></label>
                    <Controller name={'reference'} control={control} rules={{required: true}}
                                render={({field}) => (
                                    <OutlinedInput
                                        {...field}
                                        placeholder={"Enter your reference"}
                                        type={"text"}
                                        error={!!errors.reference}
                                    />
                                )}/>
                    <ErrorMessage error={errors.reference}/>
                </FormControl>

                <Box className={"payment-button-container"} flexDirection={responsiveDirection}>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <Button variant={"contained"} type={"submit"}>Pay Now</Button>
                    </FormControl>
                    <FormControl fullWidth={true} margin={'dense'}>
                        <Button variant={"outlined"} type={"button"} onClick={() => {reset()}}>Reset</Button>
                    </FormControl>
                </Box>

                {isConfirming && (
                    <OverlayConfirmation title={"Payment Confirmation"} content={paymentConfirmationMsg}
                                         onConfirm={handleConfirmedAndRedirect} onCancel={handleCancelConfirmation}
                                         mainButtonText={"Confirm"} secondaryButtonText={"Cancel"}/>
                )}
            </form>
        </>
    );
};

export default PaymentForm;
