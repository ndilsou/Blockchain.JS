const Transaction = require("./transaction");
const Wallet = require("./index");
const { MINING_REWARD } = require("../config");

describe("Transaction", () => {
   let transaction, wallet, recipient, amount;

   beforeEach(() => {
      wallet = new Wallet();
      amount = 100;
      recipient = "r3c1p13nt";
      transaction = Transaction.newTransaction(wallet, recipient, amount);
   });

   it("outputs the `amount` substracted from the wallet balance", () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - amount);
   });

   it("outputs the `amount` added to the recipient", () => {
       expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount)
   });

   it("inputs the balance of the wallet", () => {
      expect(transaction.input.amount).toEqual(wallet.balance);
   });

   it("validates a valid transaction", () => {
      expect(Transaction.verifyTransaction(transaction)).toBe(true);
   });

   it("invalidates a corrupt transaction", () => {
      transaction.outputs[0].amount = 50000;
      expect(Transaction.verifyTransaction(transaction)).toBe(false);
   });

   describe("transacting with an amount that exceeds the balance", () => {
      beforeEach(() => {
         amount = 50000;
         transaction = Transaction.newTransaction(wallet, recipient, amount);
      });

      it("does not create the transaction", () => {
         expect(transaction).toEqual(undefined);
      });
   });

   describe("and updating a transaction", () => {
       let nextAmount, nextRecipient;

       beforeEach(() => {
          nextAmount = 20;
          nextRecipient = "n3xt-4ddr355";
          transaction = transaction.update(wallet, nextRecipient, nextAmount);
       });

       it(`substract's the next amount frm the sender's output`, () => {
           expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
               .toEqual(wallet.balance - amount - nextAmount);
       })

       it("outputs an amount for the next recipient", () => {
           expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
       })

   });

    describe('creating a reward transaction', () => {
        beforeEach(() => {
           transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

        it("rewards the miner's wallet", () => {
           expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD)
        });

    });

    describe("transaction with a fee", () => {
        let fee;

        beforeEach(() => {
          fee = 10;
          transaction = Transaction.newTransaction(wallet, recipient, amount, fee);
        });

        it("contains the fee in the recipient amount.", () => {
           expect(transaction.outputs.find(output => output.address === recipient).fee).toEqual(fee);
        });

        it("outputs the `fee` and `amount` substracted from the wallet balance", () => {
           expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
               .toEqual(wallet.balance - amount - fee);
        });

        describe("transaction with a negative fee", () => {
           beforeEach(() => {
              fee = -10;
              transaction = Transaction.newTransaction(wallet, recipient, amount, fee);
           });

           it("rejects negative fees", () => {
              expect(transaction).toBeUndefined()
           });
        });

        describe("transacting with a fee that exceeds the balance", () => {
            beforeEach(() => {
                fee = 9999;
                transaction = Transaction.newTransaction(wallet, recipient, amount, fee);
            });

            it('should reject excessive fees', () => {
                expect(transaction).toBeUndefined();
            });
        });

        describe("transacting with a null fee", () => {
            beforeEach(() => {
                fee = null;
                transaction = Transaction.newTransaction(wallet, recipient, amount, fee);
            });

            it('should reject null fees', () => {
                expect(transaction).toBeUndefined();
            });
        });

        describe('creating collecting the transaction fee', () => {
            let transactions, countT, collectorTransaction;

            beforeEach(() => {
                countT = 5;
                transactions = []
                for (let i=0; i<countT; ++i) {
                    transactions.push(Transaction.newTransaction(wallet, `r3c1p13nt${i}`, amount, fee));
                }
                collectorTransaction = Transaction.collectTransactionFees(transactions,
                    wallet.publicKey, Wallet.blockchainWallet());
            });

            it('should countain the total fee as amount', () => {
                expect(collectorTransaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(fee * countT);

            });
        });
    });


});