// import { auth } from "@clerk/nextjs/server";
// import { isLoggedIn } from "~/lib/auth";
// import { AuthenticationError } from "~/lib/errors";
// import { db } from "../db";
// import { addresses, parentAddresses, auditLogs } from "../db/schema";
// import { type CreateAddressData } from "../schemas/address-schemas";

// export async function addAddressToParent(
//   addressData: CreateAddressData,
//   parentId: number,
// ) {
//   if (!isLoggedIn()) throw new AuthenticationError();

//   await db.transaction(async (tx) => {
//     const [address] = await tx
//       .insert(addresses)
//       .values(addressData)
//       .returning();

//     if (!address) return;

//     const [link] = await tx
//       .insert(parentAddresses)
//       .values({ parentId, addressId: address.id })
//       .returning();

//     await tx.insert(auditLogs).values({
//       tableName: "addresses",
//       recordId: address.id,
//       action: "INSERT",
//       newValues: JSON.stringify(address),
//       userId: auth().userId!,
//     });

//     await tx.insert(auditLogs).values({
//       tableName: "parent_addresses",
//       recordId: parentId,
//       action: "INSERT",
//       newValues: JSON.stringify(link),
//       userId: auth().userId!,
//     });
//   });
// }
