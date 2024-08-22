import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { CreateTransactionRequest } from '../dto/create-transaction-request.dto';

@Controller('transaction')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createTransaction(@Body() createTransactionRequest: CreateTransactionRequest) {

    console.log(createTransactionRequest);
    return await this.appService.createTransaction(createTransactionRequest);
  }


  @Patch()
  async updateTransaction(@Body() createTransactionRequest: CreateTransactionRequest) {

    console.log(createTransactionRequest);
    return await this.appService.updateTransaction(createTransactionRequest);
  }
}
