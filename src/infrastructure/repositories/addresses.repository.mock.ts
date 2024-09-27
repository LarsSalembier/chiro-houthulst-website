import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { Address, AddressInsert } from "~/domain/entities/address";
import {
  AddressAlreadyExistsError,
  AddressNotFoundError,
  AddressStillReferencedError,
} from "~/domain/errors/addresses";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockAddressesRepository implements IAddressesRepository {
  private addresses: Address[] = mockData.addresses;
  private autoIncrementId: number =
    this.addresses.reduce((maxId, address) => {
      return address.id > maxId ? address.id : maxId;
    }, 0) + 1;

  private getAllParents() {
    return mockData.parents.filter((parent) =>
      this.addresses.some((address) => address.id === parent.addressId),
    );
  }

  private getAllSponsors() {
    return mockData.sponsors.filter((sponsor) =>
      this.addresses.some((address) => address.id === sponsor.addressId),
    );
  }

  private isAddressReferenced(addressId: number): boolean {
    const parentWithAddressExists = this.getAllParents().some(
      (parent) => parent.addressId === addressId,
    );

    const sponsorWithAddressExists = this.getAllSponsors().some(
      (sponsor) => sponsor.addressId === addressId,
    );

    return parentWithAddressExists || sponsorWithAddressExists;
  }

  async createAddress(address: AddressInsert): Promise<Address> {
    return startSpan(
      { name: "MockAddressesRepository > createAddress" },
      () => {
        const existingAddress = this.addresses.find(
          (a) =>
            a.street === address.street &&
            a.houseNumber === address.houseNumber &&
            a.box === address.box &&
            a.municipality === address.municipality &&
            a.postalCode === address.postalCode,
        );

        if (existingAddress) {
          throw new AddressAlreadyExistsError("Address already exists");
        }

        const newAddress: Address = {
          id: this.autoIncrementId++,
          ...address,
        };

        this.addresses.push(newAddress);
        return newAddress;
      },
    );
  }

  async getAddressById(id: number): Promise<Address | undefined> {
    return startSpan(
      { name: "MockAddressesRepository > getAddressById" },
      () => {
        const address = this.addresses.find((a) => a.id === id);
        return address;
      },
    );
  }

  async getAddressByDetails(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined> {
    return startSpan(
      { name: "MockAddressesRepository > getAddressByDetails" },
      () => {
        const address = this.addresses.find(
          (a) =>
            a.street === street &&
            a.houseNumber === houseNumber &&
            a.box === box &&
            a.municipality === municipality &&
            a.postalCode === postalCode,
        );
        return address;
      },
    );
  }

  async getAllAddresses(): Promise<Address[]> {
    return startSpan(
      { name: "MockAddressesRepository > getAllAddresses" },
      () => {
        return this.addresses;
      },
    );
  }

  async deleteAddress(id: number): Promise<void> {
    return startSpan(
      { name: "MockAddressesRepository > deleteAddress" },
      () => {
        const addressIndex = this.addresses.findIndex((a) => a.id === id);
        if (addressIndex === -1) {
          throw new AddressNotFoundError("Address not found");
        }

        if (this.isAddressReferenced(id)) {
          throw new AddressStillReferencedError("Address still referenced");
        }

        this.addresses.splice(addressIndex, 1);
      },
    );
  }

  async deleteAllAddresses(): Promise<void> {
    return startSpan(
      { name: "MockAddressesRepository > deleteAllAddresses" },
      () => {
        if (
          this.addresses.some((address) => this.isAddressReferenced(address.id))
        ) {
          throw new AddressStillReferencedError("Address still referenced");
        }

        this.addresses = [];
      },
    );
  }
}
