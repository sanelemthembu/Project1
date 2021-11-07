import { Transaction } from ".";

export class TransactionAccount {
  code: number;
  personCode: number;
  accountNumber: string;
  outstandingBalance: number;
  transactions: Transaction[];
  isActive: string;
}
