import { type Address, type AddressInsert } from "~/domain/entities/address";

export interface IAddressesRepository {
  createAddress(address: AddressInsert): Promise<Address>;
  getAddressById(id: number): Promise<Address | undefined>;
  getAddress(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<void>;
}
