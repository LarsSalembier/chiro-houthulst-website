"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "sonner";
import { addSponsor } from "./actions";
import { Input } from "~/components/ui/input";
import { type CreateSponsor, createSponsorSchema } from "./sponsor-schemas";

export default function AddSponsorForm() {
  const form = useForm<CreateSponsor>({
    mode: "onChange",
    resolver: zodResolver(createSponsorSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await addSponsor(data);
      toast.success("Sponsor succesvol toegevoegd!");
      form.reset();
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het opslaan.");
      console.error("Error saving sponsor:", error);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="grid grid-rows-6 gap-4"
        id="addSponsorForm"
      >
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam onderneming</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyOwnerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam zaakvoerder</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="landline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefoonnummer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    pattern="(^\d{3} \d{2} \d{2} \d{2}$)|(^$)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GSM-nummer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    pattern="(^\d{4} \d{2} \d{2} \d{2}$)|(^$)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="municipality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gemeente</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode</FormLabel>
                <FormControl>
                  <Input {...field} type="number" max={9999} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Straatnaam</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huisnummer</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website-URL</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emailadres</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrag</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paid"
            render={({ field }) => (
              <FormItem className="mt-8 flex h-max flex-row items-end gap-4">
                <FormLabel>Betaald?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* <div>
          {showLogoUpload ? (
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0] !== undefined) {
                  form.setValue("logoUrl", res[0].url);
                  setShowLogoUpload(false);
                }
              }}
            />
          ) : (
            <div className="relative h-[100px] w-[200px]">
              <Image
                src={form.getValues("logoUrl")}
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div> */}
        <Button type="submit" className="align-self-end w-fit">
          Opslaan
        </Button>
      </form>
    </Form>
  );
}

// export default function AddSponsorForm() {
//   const [showLogoUpload, setShowLogoUpload] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof createSponsorSchema>>({
//     resolver: zodResolver(createSponsorSchema),
//     defaultValues: {
//       companyName: "",
//       companyOwnerName: "",
//       municipality: "Houthulst",
//       postalCode: "8650",
//       street: "",
//       number: "",
//       landline: "",
//       mobile: "",
//       email: "",
//       websiteUrl: "",
//       amount: 50,
//       logoUrl: "",
//       paid: false,
//     },
//   });

//   async function onSubmit(data: z.infer<typeof createSponsorSchema>) {
//     setIsLoading(true);
//     try {
//       const ft = async () => {
//         "use server";

//         await addSponsor(data);
//       };
//       await ft();
//       toast.success("Sponsor succesvol toegevoegd!");
//       form.reset();
//       setShowLogoUpload(true);
//     } catch (error) {
//       toast.error("Er is een fout opgetreden bij het opslaan.");
//       console.error("Error saving sponsor:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="grid grid-rows-6 gap-4"
//         id="addSponsorForm"
//       >
//         <div className="flex flex-row gap-4">
//           <TextInput
//             form={form}
//             label="Naam onderneming"
//             name="companyName"
//             type="text"
//             minlength={2}
//             maxlength={256}
//           />
//           <TextInput
//             form={form}
//             label="Naam zaakvoerder"
//             name="companyOwnerName"
//             type="text"
//             maxlength={256}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <TextInput
//             form={form}
//             label="Telefoonnummer"
//             name="landline"
//             type="tel"
//             pattern="(^\d{3} \d{2} \d{2} \d{2}$)|(^$)"
//           />
//           <TextInput
//             form={form}
//             label="GSM-nummer"
//             name="mobile"
//             type="tel"
//             pattern="(^\d{4} \d{2} \d{2} \d{2}$)|(^$)"
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <TextInput
//             form={form}
//             label="Gemeente"
//             name="municipality"
//             type="text"
//             maxlength={256}
//           />
//           <TextInput
//             form={form}
//             label="Postcode"
//             name="postalCode"
//             type="number"
//             max={9999}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <TextInput
//             form={form}
//             label="Straatnaam"
//             name="street"
//             type="text"
//             maxlength={256}
//           />
//           <TextInput
//             form={form}
//             label="Huisnummer"
//             name="number"
//             type="text"
//             maxlength={64}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <TextInput
//             form={form}
//             label="Website-URL"
//             name="websiteUrl"
//             type="url"
//           />
//           <TextInput
//             form={form}
//             label="Emailadres"
//             name="email"
//             type="email"
//             maxlength={256}
//           />
//         </div>
//         <div className="flex flex-row gap-4">
//           <TextInput
//             form={form}
//             label="Bedrag"
//             name="amount"
//             type="number"
//             min={1}
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
//         <div>
//           {showLogoUpload ? (
//             <UploadButton
//               endpoint="imageUploader"
//               onClientUploadComplete={(res) => {
//                 if (res?.[0] !== undefined) {
//                   form.setValue("logoUrl", res[0].url);
//                   setShowLogoUpload(false);
//                 }
//               }}
//             />
//           ) : (
//             <div className="relative h-[100px] w-[200px]">
//               <Image
//                 src={form.getValues("logoUrl")}
//                 alt="Logo"
//                 fill
//                 className="object-contain"
//               />
//             </div>
//           )}
//         </div>
//         <Button
//           type="submit"
//           className="align-self-end w-fit"
//           disabled={isLoading}
//         >
//           {isLoading ? "Opslaan..." : "Sponsor toevoegen"}
//         </Button>
//       </form>
//     </Form>
//   );
// }
