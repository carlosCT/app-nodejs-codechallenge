import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateTransactionRequest {
  @IsString()
  public accountExternalIdDebit: string;

  @IsString()
  public accountExternalIdCredit: string;


  @IsNumber()
  @Type(()=> Number)
  public tranferTypeId: number;
  
  @IsNumber()
  @Type(()=> Number)
  public AmountValue: number;
   
}
