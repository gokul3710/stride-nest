import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
