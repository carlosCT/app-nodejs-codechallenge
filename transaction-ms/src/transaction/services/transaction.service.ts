import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { DataCreated } from '../models/transaction-created.event';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  @Inject(ConfigService)
  public config: ConfigService;

  async handleTransactionCreated(transaccionEvent: DataCreated) {
    try {
      console.log('transaction created ...... ', transaccionEvent);

      const newTransaction = this.transactionRepo.create(transaccionEvent);
      return this.transactionRepo.save(newTransaction);
    } catch (error) {
      console.log(error);
    }
  }

  async handleTransactionUpdated(transaccionEvent: DataCreated) {
    try {
      console.log('transaction updated ...... ', transaccionEvent);
      const result = await this.transactionRepo.findOne({
        where: {
          transactionExternalId: transaccionEvent.transactionExternalId,
        },
      });
      console.log('Result handleTransactionUpdated', result);

      if (result) {
        this.transactionRepo.merge(result, transaccionEvent);
        this.transactionRepo.save(result);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: string) {
    const product = await this.transactionRepo.findOne({
      where: { transactionExternalId: id },
    });

    if (!product) {
      throw new RpcException({
        message: `Transaction with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return product;
  }
}
