import { type Address, type AddressInsert } from "~/domain/entities/address";

/**
 * Repository interface for accessing and managing addresses.
 */
export interface IAddressesRepository {
  /**
   * Creates a new address.
   *
   * @param address - The address data to insert.
   * @returns The created address.
   *
   * @throws {AddressAlreadyExistsError} If an address with the same details already exists.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  createAddress(address: AddressInsert): Promise<Address>;

  /**
   * Retrieves an address by its unique identifier.
   *
   * @param id - The ID of the address to retrieve.
   * @returns The address matching the given ID, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAddressById(id: number): Promise<Address | undefined>;

  /**
   * Retrieves an address by its unique details.
   *
   * @param street The street of the address.
   * @param houseNumber The house number of the address.
   * @param box The box of the address.
   * @param municipality The municipality of the address.
   * @param postalCode The postal code of the address.
   * @returns The address matching the given details, or `undefined` if not found.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAddressByDetails(
    street: string,
    houseNumber: string,
    box: string | null,
    municipality: string,
    postalCode: number,
  ): Promise<Address | undefined>;

  /**
   * Retrieves all addresses.
   *
   * @returns A list of all addresses.
   *
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  getAllAddresses(): Promise<Address[]>;

  /**
   * Deletes an address by its unique identifier.
   *
   * @param id - The ID of the address to delete.
   *
   * @throws {AddressNotFoundError} If no address with the given ID exists.
   * @throws {AddressStillReferencedError} If the address is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any other reason.
   */
  deleteAddress(id: number): Promise<void>;

  /**
   * Deletes all addresses.
   *
   * @throws {AddressStillReferencedError} If any address is still referenced by other entities and cannot be deleted.
   * @throws {DatabaseOperationError} If the operation fails for any reason.
   */
  deleteAllAddresses(): Promise<void>;
}
