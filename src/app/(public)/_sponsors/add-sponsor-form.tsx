// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import { Button } from "~/components/ui/button";
// import { Checkbox } from "~/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/components/ui/form";
// import { Input } from "~/components/ui/input";
// import {
//   type CreateSponsorData,
//   createSponsorSchema,
// } from "~/server/schemas/sponsor-schemas";
// import { addSponsorAndRevalidate as createSponsorAndRevalidate } from "../actions";
// import { toast } from "sonner";
// import { AuthenticationError, AuthorizationError } from "~/lib/errors";

// export default function AddSponsorForm() {
//   const form = useForm<CreateSponsorData>({
//     mode: "onChange",
//     resolver: zodResolver(createSponsorSchema),
//   });

//   const onSubmit = form.handleSubmit(async (data) => {
//     try {
//       await createSponsorAndRevalidate(data);
//       toast.success(`Sponsor ${data.companyName} succesvol toegevoegd!`);
//     } catch (error) {
//       if (error instanceof AuthenticationError) {
//         toast.error("Je bent niet ingelogd.");
//       } else if (error instanceof AuthorizationError) {
//         toast.error("Je hebt geen toestemming om een sponsor toe te voegen.");
//       } else {
//         toast.error(
//           `Er is een fout opgetreden bij het toevoegen van sponsor ${data.companyName}.`,
//         );
//       }

//       console.error(`Error adding sponsor ${data.companyName}:`, error);
//     }
//   });

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={onSubmit}
//         className="grid grid-rows-6 gap-4"
//         id="addSponsorForm"
//       >
//         <div className="flex flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="companyName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Naam onderneming</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="companyOwnerName"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Naam zaakvoerder</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="landline"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Telefoonnummer</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     type="tel"
//                     pattern="(^\d{3} \d{2} \d{2} \d{2}$)|(^$)"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="mobile"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>GSM-nummer</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     type="tel"
//                     pattern="(^\d{4} \d{2} \d{2} \d{2}$)|(^$)"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="municipality"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Gemeente</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="postalCode"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Postcode</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="number" max={9999} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="street"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Straatnaam</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="number"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Huisnummer</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="text" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="websiteUrl"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Website-URL</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="url" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Emailadres</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="email" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="amount"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Bedrag</FormLabel>
//                 <FormControl>
//                   <Input {...field} type="number" min={1} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="paid"
//             render={({ field }) => (
//               <FormItem className="mt-8 flex h-max flex-row items-end gap-4">
//                 <FormLabel>Betaald?</FormLabel>
//                 <FormControl>
//                   <Checkbox
//                     checked={field.value}
//                     onCheckedChange={field.onChange}
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit" className="align-self-end w-fit">
//           Opslaan
//         </Button>
//       </form>
//     </Form>
//   );
// }
