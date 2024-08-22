import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ANTIFRAUD_SERVICE, envs, TRANSACTION_SERVICE} from './config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'billing',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'client-consumer',
          },
        },
      },
      { 
        name: ANTIFRAUD_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.antifraudMicroserviceHost,
          port: envs.antifraudMicroservicePort
        }
      }

    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
