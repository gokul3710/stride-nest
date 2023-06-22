import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { UserGuard } from '../../guards/auth.guard';
import { addAddressDto } from '../../dtos/user/address/add-address.dto';
import { changeDefaultAddressDto } from '../../dtos/user/address/change-default-address.dto';
import { ObjectId } from 'mongodb';

@Controller('user/address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  @UseGuards(UserGuard)
  getAddresses(@Request() request) {
    return this.addressService.allAddresses(request.user);
  }

  // @Get(':addressId')
  // @UseGuards(UserGuard)
  // getAddressById(
  //   @Request() request,
  //   @Param() { addressId }: { addressId: string },
  // ) {
  //   return this.addressService.addressById(request.user,addressId);
  // }

  @Post()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  addAddress(@Request() request, @Body() address: addAddressDto) {
    return this.addressService.addAddress(request.user, {...address,_id: new ObjectId()});
  }

  @Patch()
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  editAddress(@Request() request, @Body() address: addAddressDto) {
    return this.addressService.editAddress(request.user, address);
  }

  @Patch('default')
  @UseGuards(UserGuard)
  @UsePipes(ValidationPipe)
  setDefaultAddress(
    @Request() request,
    @Body() addresses: changeDefaultAddressDto,
  ) {
    return this.addressService.setDefaultAddress(request.user, addresses);
  }

  @Delete(':addressId')
  @UseGuards(UserGuard)
  deleteAddress(
    @Request() request,
    @Param() { addressId }: { addressId: string },
  ) {
    return this.addressService.deleteAddress(request.user, addressId);
  }
}
