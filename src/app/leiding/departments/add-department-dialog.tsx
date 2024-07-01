"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import { UploadButton } from "~/utils/uploadthing";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import addDepartment from "./_actions/add-department";
import ColorPicker from "~/components/ui/color-picker";
// import { useUploadThing } from "~/utils/uploadthing";

// function capitalizeFirstLetter(str: string) {
//   const firstChar = str.charAt(0).toUpperCase();
//   const rest = str.slice(1).toLowerCase();

//   return firstChar + rest;
// }

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vul de naam van de afdeling in.")
    .max(255, "Naam van de afdeling is te lang.")
    .regex(
      /^[a-zA-Z0-9\s'-]+$/,
      "De naam van de afdeling mag alleen letters, cijfers, - en ' en bevatten.",
    ),
  color: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Geef een geldige hexadecimale kleurcode in (bijv. #FF0000).",
      )
      .optional(),
  ),
  // mascotImage: z.any(),
  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(1000, "Beschrijving is te lang.").optional(),
  ),
});

export default function AddDepartmentDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "000000",
      // mascotImage: [] as File[],
      description: "",
    },
  });

  // const { startUpload } = useUploadThing("imageUploader", {
  //   onClientUploadComplete: () => {
  //     toast.success("Mascotte geüpload!");
  //     form.resetField("mascotImage");
  //   },
  //   onUploadError: () => {
  //     toast.error(
  //       "Er is een fout opgetreden bij het uploaden van de mascotte.",
  //     );
  //   },
  //   onUploadBegin: () => {
  //     toast.info("Mascotte wordt geüpload...");
  //   },
  // });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // const result = await startUpload([data.mascotImage] as File[]);

      // await addDepartment(
      //   formSchema.parse({
      //     ...data,
      //     mascotImageUrl: result?.[0]?.url,
      //   }),
      // );
      await addDepartment(data);
      toast.success("Afdeling succesvol toegevoegd!");
      form.reset();
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het opslaan.");
      console.error("Error saving department:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">Voeg een afdeling toe</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voeg een afdeling toe</DialogTitle>
          <DialogDescription>
            Vul de gegevens van de nieuwe afdeling in.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kleur</FormLabel>
                  <FormControl>
                    <ColorPicker
                      {...field}
                      value={field.value ? field.value : "000000"}
                      onChange={(color) =>
                        form.setValue(
                          "color",
                          color === "000000" ? undefined : color,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="mascotImage"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Upload mascotte"
                      type="file"
                      {...fieldProps}
                      onChange={(event) => onChange(event.target.files?.[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    De mascotte van de afdeling.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschrijving</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-fit" disabled={isLoading}>
              {isLoading ? "Opslaan..." : "Afdeling toevoegen"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
