import { injectable } from "inversify";
import { type IAddressesRepository } from "~/application/repositories/addresses.repository.interface";
import { type Address, type AddressInsert } from "~/domain/entities/address";
import {
  AddressAlreadyExistsError,
  AddressNotFoundError,
  AddressStillReferencedError,
} from "~/domain/errors/addresses";

@injectable()
export class MockAddressesRepository implements IAddressesRepository {
  private _addresses: Address[] = [];
  private _nextId = 1;
  private _addressReferences = new Map<number, number>();

  /**
   * Creates a new address.
   *
   * @param address - The address data to insert.
   * @returns The created address.
   * @throws {AddressAlreadyExistsError} If an address with the same details already exists.
   */
  async createAddress(address: AddressInsert): Promise<Address> {
    // Check if the address already exists
    const existingAddress = await this.getAddress(
      address.street,
      address.houseNumber,
      address.box,
      address.municipality,
      address.postalCode,
    );

    if (existingAddress) {
      throw new AddressAlreadyExistsError(
        "Address with the same details already exists",
      );
    }

    // Create and store the new address
    const newAddress: Address = { ...address, id: this._nextId++ };
    this._addresses.push(newAddress);

    // Initialize the reference count for the new address
    this._addressReferences.set(newAddress.id, 0);

    return newAddress;
  }

  /**
   * Gets an address by its ID.
   *
   * @param addressId The ID of the address to retrieve.
   * @returns The address if found, undefined otherwise.
   */
  async getAddressById(addressId: number): Promise<Address | undefined> {
    return this._addresses.find((address) => address.id === addressId);
  }

  /**
   * Gets an address by its details.
   *
   * @param street The street of the address.
   * @param houseNumber The house number of the address.
   * @param box The box of the address.
   * @param municipality The municipality of the address.
   * @param postalCode The postal code of the address.
   * @returns The address if found, undefined otherwise.
   */
  async getAddress(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined> {
    return this._addresses.find(
      (address) =>
        address.street === street &&
        address.houseNumber === houseNumber &&
        address.box === box &&
        address.municipality === municipality &&
        address.postalCode === postalCode,
    );
  }

  /**
   * Deletes an address by its ID.
   *
   * @param addressId The ID of the address to delete.
   * @throws {AddressNotFoundError} If the address is not found.
   * @throws {AddressStillReferencedError} If the address is still referenced by other entities.
   */
  async deleteAddress(addressId: number): Promise<void> {
    const index = this._addresses.findIndex(
      (address) => address.id === addressId,
    );

    if (index === -1) {
      throw new AddressNotFoundError("Address not found");
    }

    // Check if the address is still referenced
    const referenceCount = this._addressReferences.get(addressId) ?? 0;
    if (referenceCount > 0) {
      throw new AddressStillReferencedError(
        "Address is still referenced by other entities",
      );
    }

    // Remove the address and its reference count
    this._addresses.splice(index, 1);
    this._addressReferences.delete(addressId);
  }

  /**
   * Increments the reference count for an address.
   *
   * @param addressId The ID of the address.
   * @throws {AddressNotFoundError} If the address is not found.
   */
  async incrementReference(addressId: number): Promise<void> {
    const address = await this.getAddressById(addressId);
    if (!address) {
      throw new AddressNotFoundError("Address not found");
    }

    const count = this._addressReferences.get(addressId) ?? 0;
    this._addressReferences.set(addressId, count + 1);
  }

  /**
   * Decrements the reference count for an address.
   *
   * @param addressId The ID of the address.
   * @throws {AddressNotFoundError} If the address is not found.
   */
  async decrementReference(addressId: number): Promise<void> {
    const address = await this.getAddressById(addressId);
    if (!address) {
      throw new AddressNotFoundError("Address not found");
    }

    const count = this._addressReferences.get(addressId) ?? 0;
    if (count > 0) {
      this._addressReferences.set(addressId, count - 1);
    }
  }
}
