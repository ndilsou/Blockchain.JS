class TransactionPool {
    constructor() {
        // TODO: Use dict or set to get O(1) access.
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        // TODO: How does this support multiple transaction from a given user?
        return this.transactions.find(t => t.input.address === address);
    }
}

module.exports = TransactionPool;