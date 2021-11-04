import { TransactionAccount } from ".";

export class User {
  code: number;
  username: string;
  password: string;
  idNumber: string;
  name: string;
  surname: string;
  token: string;
  accounts: TransactionAccount[];
}
