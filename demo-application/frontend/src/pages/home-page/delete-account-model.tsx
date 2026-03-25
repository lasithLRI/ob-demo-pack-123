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

import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    CircularProgress,
    Box,
    Alert
} from "@oxygen-ui/react";
import useConfigContext from "../../hooks/use-config-context.ts";

/** DeleteAccountModalProps implementation */
interface DeleteAccountModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

/** SelectedAccount implementation */
interface SelectedAccount {
    accountId: string;
    accountName: string;
    bankName: string;
}

/**
 * Executes the DeleteAccountModal operation and modify the payload if necessary.
 *
 * @param onClose         The onClose parameter
 */
export const DeleteAccountModal = ({ open, onClose, onSuccess }: DeleteAccountModalProps) => {
    const { banksWithAccounts, getAffectedAccounts, revokeConsent } = useConfigContext();

    const [selected, setSelected] = useState<SelectedAccount | null>(null);
    const [affectedAccounts, setAffectedAccounts] = useState<{ id: string; name: string }[]>([]);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletableBanks = banksWithAccounts.filter(({ bank }) => bank.flag === true);

    /**
     * Executes the handleSelect operation and modify the payload if necessary.
     *
     * @param accountId       The accountId parameter
     * @param accountName     The accountName parameter
     * @param bankName        The bankName parameter
     */
    const handleSelect = async (accountId: string, accountName: string, bankName: string) => {
        /**
         * Executes the setSelected operation and modify the payload if necessary.
         *
         * @param accountName     The accountName parameter
         */
        setSelected({ accountId, accountName, bankName });
        /**
         * Executes the setError operation and modify the payload if necessary.
         *
         * @param null            The null parameter
         */
        setError(null);
        /**
         * Executes the setPreviewLoading operation and modify the payload if necessary.
         *
         * @param true            The true parameter
         */
        setPreviewLoading(true);
        try {
            const affected = await getAffectedAccounts(accountId, bankName);
            /**
             * Executes the setAffectedAccounts operation and modify the payload if necessary.
             *
             * @param affected        The affected parameter
             */
            setAffectedAccounts(affected);
        } catch {
            /**
             * Executes the setError operation and modify the payload if necessary.
             */
            setError("Failed to load linked accounts. Please try again.");
        } finally {
            /**
             * Executes the setPreviewLoading operation and modify the payload if necessary.
             *
             * @param false           The false parameter
             */
            setPreviewLoading(false);
        }
    };

    /**
     * Executes the handleConfirm operation and modify the payload if necessary.
     */
    const handleConfirm = async () => {
        if (!selected) return;
        /**
         * Executes the setDeleteLoading operation and modify the payload if necessary.
         *
         * @param true            The true parameter
         */
        setDeleteLoading(true);
        /**
         * Executes the setError operation and modify the payload if necessary.
         *
         * @param null            The null parameter
         */
        setError(null);
        try {
            const success = await revokeConsent(selected.accountId, selected.bankName);
            if (success) {
                /**
                 * Executes the handleClose operation and modify the payload if necessary.
                 */
                handleClose();
                /**
                 * Executes the onSuccess operation and modify the payload if necessary.
                 */
                onSuccess();
            } else {
                /**
                 * Executes the setError operation and modify the payload if necessary.
                 */
                setError("Failed to revoke consent. Please try again.");
            }
        } catch {
            /**
             * Executes the setError operation and modify the payload if necessary.
             */
            setError("An unexpected error occurred. Please try again.");
        } finally {
            /**
             * Executes the setDeleteLoading operation and modify the payload if necessary.
             *
             * @param false           The false parameter
             */
            setDeleteLoading(false);
        }
    };

    /**
     * Executes the handleClose operation and modify the payload if necessary.
     */
    const handleClose = () => {
        /**
         * Executes the setSelected operation and modify the payload if necessary.
         *
         * @param null            The null parameter
         */
        setSelected(null);
        /**
         * Executes the setAffectedAccounts operation and modify the payload if necessary.
         *
         * @param []              The [] parameter
         */
        setAffectedAccounts([]);
        /**
         * Executes the setError operation and modify the payload if necessary.
         *
         * @param null            The null parameter
         */
        setError(null);
        /**
         * Executes the onClose operation and modify the payload if necessary.
         */
        onClose();
    };

    const linkedAccounts = affectedAccounts.filter((acc) => acc.id !== selected?.accountId);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">

            {}
            <DialogTitle sx={{ pb: 1.5 }}>
                <Typography variant="h6" fontWeight={600}>
                    Delete Account
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.25}>
                    Select an account to revoke its bank consent.
                </Typography>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 2, pb: 1 }}>

                {}
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                        This action will revoke the bank&apos;s permission
                    </Typography>
                    <Typography variant="body2">
                        Deleting an account permanently removes the bank&apos;s consent to access your data.
                        You will need to re-authorise to reconnect.
                    </Typography>
                </Alert>

                {}
                {deletableBanks.length === 0 ? (
                    <Box
                        sx={{
                            py: 4,
                            textAlign: "center",
                            color: "text.secondary",
                            bgcolor: "action.hover",
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body2">No accounts available for deletion.</Typography>
                    </Box>
                ) : (
                    deletableBanks.map(({ bank, accounts }) => (
                        <Box key={bank.name} mb={2}>
                            <Typography
                                variant="overline"
                                color="text.secondary"
                                sx={{ fontWeight: 600, letterSpacing: "0.06em" }}
                            >
                                {bank.name}
                            </Typography>
                            <Divider sx={{ mt: 0.5, mb: 0.75 }} />
                            <List disablePadding>
                                {accounts.map((account) => {
                                    const isSelected = selected?.accountId === account.id;
                                    return (
                                        <ListItem key={account.id} disablePadding sx={{ mb: 0.5 }}>
                                            <ListItemButton
                                                selected={isSelected}
                                                onClick={() =>
                                                    handleSelect(account.id, account.name, bank.name)
                                                }
                                                sx={{
                                                    borderRadius: 1,
                                                    border: "1px solid",
                                                    borderColor: isSelected ? "error.main" : "divider",
                                                    bgcolor: isSelected ? "error.lighter" : "transparent",
                                                    "&:hover": {
                                                        bgcolor: isSelected ? "error.lighter" : "action.hover",
                                                    },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={isSelected ? 600 : 400}
                                                        >
                                                            {account.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{ fontFamily: "monospace" }}
                                                        >
                                                            {account.id}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>
                    ))
                )}

                {}
                {previewLoading && (
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <CircularProgress size={14} />
                        <Typography variant="caption" color="text.secondary">
                            Checking linked accounts…
                        </Typography>
                    </Box>
                )}

                {}
                {!previewLoading && selected && linkedAccounts.length > 0 && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            Linked accounts will also lose access
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            The following accounts share the same consent as{" "}
                            <strong>{selected.accountName}</strong> and will also be revoked:
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2 }}>
                            {linkedAccounts.map((acc) => (
                                <Typography key={acc.id} component="li" variant="body2">
                                    {acc.name}{" "}
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontFamily: "monospace" }}
                                    >
                                        ({acc.id})
                                    </Typography>
                                </Typography>
                            ))}
                        </Box>
                    </Alert>
                )}

                {}
                {error && (
                    <Alert severity="error" sx={{ mt: 1.5 }}>
                        <Typography variant="body2">{error}</Typography>
                    </Alert>
                )}
            </DialogContent>

            {}
            <Divider />
            <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={deleteLoading}
                    variant="outlined"
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!selected || previewLoading || deleteLoading}
                    color="error"
                    variant="contained"
                    sx={{ minWidth: 130 }}
                >
                    {deleteLoading ? (
                        <Box display="flex" alignItems="center" gap={1}>
                            <CircularProgress size={15} color="inherit" />
                            <span>Revoking…</span>
                        </Box>
                    ) : (
                        "Revoke & Delete"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
