package com.wso2.openbanking.demo.service;

import com.wso2.openbanking.demo.exceptions.BankInfoLoadException;
import com.wso2.openbanking.demo.models.*;

import java.util.List;
import java.util.Optional;

public interface BankInfoInterface {
    List<Bank> getBanks();
    void loadBanks() throws BankInfoLoadException;
    boolean isBankExists(String bankName);
    void addBank(Bank bank);
    Optional<Account> findAccount(String bankName, String accountId);
    void addTransactionToAccount(Account account, Transaction transaction);
    ConfigResponse getConfigurations();
    LoadPaymentPageResponse getPaymentPageInfo();
    List<AddAccountBankInfo> getAddAccountBanksInformation() throws BankInfoLoadException;
}
