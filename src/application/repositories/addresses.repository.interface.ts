import { type Address, type AddressInsert } from "~/domain/entities/address";

export interface IAddressesRepository {
  /**
   * Creates a new address.
   *
   * @param address - The address data to insert.
   * @returns The created address.
   * @throws {AddressAlreadyExistsError} If an address with the same details already exists.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  createAddress(address: AddressInsert): Promise<Address>;

  /**
   * Gets an address by its ID.
   *
   * @param id The ID of the address to retrieve.
   * @returns The address if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getAddressById(id: number): Promise<Address | undefined>;

  /**
   * Gets an address by its details.
   *
   * @param street The street name.
   * @param houseNumber The house number.
   * @param box The box number.
   * @param municipality The municipality.
   * @param postalCode The postal code.
   * @returns The address if found, undefined otherwise.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  getAddress(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined>;

  /**
   * Deletes an address by its ID.
   *
   * @param id The ID of the address to delete.
   * @throws {AddressNotFoundError} If the address is not found.
   * @throws {DatabaseOperationError} If the operation fails.
   */
  deleteAddress(id: number): Promise<void>;
}
