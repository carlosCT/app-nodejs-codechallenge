import { Controller, Logger, ParseIntPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionController {
  public readonly logger = new Logger('transaction-ms');

  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('transaction_created')
  handleTransactionCreated(data: any) {
    this.logger.log('transaction_created', data);
    this.transactionService.handleTransactionCreated(data.value);
  }

  @EventPattern('transaction_updated')
  handleTransactionUpdated(data: any) {
    this.logger.log('transaction_updated', data);
    this.transactionService.handleTransactionUpdated(data.value);
  }

  @MessagePattern('get-transaction')
  findOne(@Payload('id', ParseIntPipe) id: string) {
    return this.transactionService.findOne(id);
  }
}
