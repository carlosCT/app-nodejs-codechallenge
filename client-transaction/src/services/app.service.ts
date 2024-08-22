import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ANTIFRAUD_SERVICE, TRANSACTION_SERVICE } from 'src/config';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from 'src/constants/app.constant';
import { TransactionCreatedEvent } from 'src/dto/transaction-created.event';
import { CreateTransactionRequest } from '../dto/create-transaction-request.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly client: ClientKafka,
    @Inject(ANTIFRAUD_SERVICE) private readonly antifraudService: ClientProxy,
  ) {}

  async createTransaction(createTransactionRequest: CreateTransactionRequest) {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      AmountValue,
    } = createTransactionRequest;

    const transactionToRegister = new TransactionCreatedEvent(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      AmountValue,
      TRANSACTION_STATUS.PENDING.id,
    );

    try {
      this.client.emit('transaction_created', transactionToRegister);

      console.log("Message sent");

      return {
        transactionExternalId: transactionToRegister.transactionExternalId,
        transactionType: {
          name:
            TRANSACTION_TYPE.DEBIT.id == transactionToRegister.transactionType
              ? TRANSACTION_TYPE.DEBIT.name
              : TRANSACTION_TYPE.CREDIT.name,
        },
        transactionStatus: {
          name: TRANSACTION_STATUS.PENDING,
        },
        value: transactionToRegister.valueTx,
        createdAt: Date.now,
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async updateTransaction(createTransactionRequest: CreateTransactionRequest) {
    try {
      const antifraudResponse = await firstValueFrom(
        this.antifraudService.send(
          'validate-transaction',
          createTransactionRequest,
        ),
      );
      console.log('antifraud response ', antifraudResponse);

      const transaction = antifraudResponse.data;
      return {
        transactionExternalId: transaction.transactionExternalId,
        transactionType: {
          name:
            TRANSACTION_TYPE.DEBIT.id == transaction.transactionType
              ? TRANSACTION_TYPE.DEBIT.name
              : TRANSACTION_TYPE.CREDIT.name,
        },
        transactionStatus: {
          name: antifraudResponse.status
            ? TRANSACTION_STATUS.APPROVED.name
            : TRANSACTION_STATUS.REJECTED.name,
        },
        value: transaction.valueTx,
        createdAt: Date.now,
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
