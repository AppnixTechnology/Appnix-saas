import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UnlockWorkflowDto {
  @IsString()
  @IsNotEmpty({ message: 'License key is required' })
  @Matches(/^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$|^[A-Za-z0-9\-_]{10,32}$/, {
    message: 'License key must follow the format WFLW-XXXX-XXXX-XXXX',
  })
  licenseKey: string;
}
