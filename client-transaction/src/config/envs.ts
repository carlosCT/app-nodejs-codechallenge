import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: string;
  ANTIFRAUD_MICROSERVICE_HOST: string;
  ANTIFRAUD_MICROSERVICE_PORT: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    ANTIFRAUD_MICROSERVICE_HOST: joi.string().required(),
    ANTIFRAUD_MICROSERVICE_PORT: joi.number().required()
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config  validation error : ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  antifraudMicroserviceHost: envVars.ANTIFRAUD_MICROSERVICE_HOST,
  antifraudMicroservicePort: envVars.ANTIFRAUD_MICROSERVICE_PORT,
};
