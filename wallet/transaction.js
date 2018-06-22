'use strict';

const ChainUtil =  require("../chain-util");
const { MINING_REWARD } = require("../config");

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }
    static validateInputs(balance, amount, fee) {
        if (fee === null) return false;
        if (fee < 0) return false;

        if (amount + fee > balance) {
            console.log(`Amount: ${amount} plus Fee: ${fee} exceeds balance.`);
            return false;
        }

        return true;
    }

    update(senderWallet, recipient, amount, fee=0) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if (!Transaction.validateInputs(senderOutput.amount, amount, fee)) return;

        senderOutput.amount = senderOutput.amount - amount - fee;
        this.outputs.push({ amount, fee, address: recipient });
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount, fee=0) {

        if (!Transaction.validateInputs(senderWallet.balance, amount, fee)) return;

        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount - fee, address: senderWallet.publicKey },
            { amount, fee, address: recipient }
        ]);
    }

    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD,
            address: minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static  verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }

    static collectTransactionFees(transactions, collectorAddress, blockchainWallet) {
        const fees = transactions.reduce((total, transaction) => {
            const fees = transaction.outputs.reduce((total, output) => {
                if (output.fee !== undefined) {
                    total += output.fee;
                }
                return total;
            }, 0);

            return total + fees;
        }, 0);

        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: fees,
            address: collectorAddress
        }]);
    }
}

module.exports = Transaction;