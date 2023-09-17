import { HttpException, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { DatabaseService } from 'src/shared/database/database.service';
import { collections } from 'src/core/constants/collections';
import { changeDefaultAddressDto } from '../../../core/dtos/user/address/change-default-address.dto';
import { Address, AddressDocument } from 'src/core/models/address.model';

@Injectable()
export class AddressService {
  private address: Collection<AddressDocument>;

  constructor(private readonly db: DatabaseService) {}

  async allAddresses(userId: string): Promise<AddressDocument> {
    this.address = this.db.getCollection(collections.ADDRESS_COLLECTION);
    const addresses = await this.address?.findOne({
      userId: new ObjectId(userId),
    });
    return addresses;
  }

  // async addressById(userId: string, addressId: string): Promise<any> {
  //   this.address = this.db.getCollection(collections.ADDRESS_COLLECTION);
  //   const addresses = await this.address?.findOne({
  //     userId: new ObjectId(userId),
  //   });
  //   return addresses.addresses.filter(
  //     (address) => address._id.toString() === addressId,
  //   );
  // }

  async addAddress(
    userId: string,
    address: Address,
  ): Promise<{ status: 'Done'; response: string }> {
    this.address = this.db.getCollection(collections.ADDRESS_COLLECTION);
    const addresses = await this.address?.findOne({
      userId: new ObjectId(userId),
    });
    if (addresses) {
      address.default = false;
      const response = await this.address?.updateOne(
        { userId: new ObjectId(userId) },
        {
          $push: {
            addresses: address,
          },
        },
      );
      if (response.modifiedCount) {
        return { status: 'Done', response: address._id.toString() };
      } else {
        throw new HttpException('Could not add address', 400);
      }
    } else {
      address.default = true;
      const a: any = {
        userId: new ObjectId(userId),
        addresses: [address],
      };
      const response = await this.address?.insertOne(a);
      if (response.insertedId) {
        return { status: 'Done', response: response.insertedId.toString() };
      } else {
        throw new HttpException('Error in adding address', 400);
      }
    }
  }

  async deleteAddress(
    userId: string,
    addressId: string,
  ): Promise<{ status: 'Done' }> {
    this.address = this.db.getCollection(collections.ADDRESS_COLLECTION);

    if (!addressId.trim()) {
      throw new HttpException('AddressId cannot be empty', 400);
    }
    const response = await this.address?.updateOne(
      { userId: new ObjectId(userId) },
      { $pull: { addresses: { _id: new ObjectId(addressId) } } },
    );
    return { status: 'Done' };
  }

  async editAddress(userId: string, address: any): Promise<{ status: 'Done' }> {
    this.address = this.db.getCollection(collections.ADDRESS_COLLECTION);

    const response = await this.address?.updateOne(
      {
        userId: new ObjectId(userId),
        'addresses._id': new ObjectId(address._id),
      },
      {
        $set: {
          'addresses.$.name': address.name,
          'addresses.$.phone': address.phone,
          'addresses.$.house': address.house,
          'addresses.$.street': address.street,
          'addresses.$.city': address.city,
          'addresses.$.state': address.state,
          'addresses.$.pincode': address.pincode,
          'addresses.$.landmark': address.landmark,
        },
      },
    );
    return { status: 'Done' };
  }

  async setDefaultAddress(
    userId: string,
    addresses: changeDefaultAddressDto,
  ): Promise<AddressDocument> {
    this.address = this.db.getCollection(collections.ADDRESS_COLLECTION);

    const removeOlddefault = await this.address.updateOne(
      {
        userId: new ObjectId(userId),
        'addresses._id': new ObjectId(addresses.current),
      },
      {
        $set: { 'addresses.$.default': false },
      },
    );

    const setNewDefault = await this.address.updateOne(
      {
        userId: new ObjectId(userId),
        'addresses._id': new ObjectId(addresses.new),
      },
      {
        $set: { 'addresses.$.default': true },
      },
    );

    const address = await this.address.findOne({
      userId: new ObjectId(userId),
    });

    return address;
  }
}
