"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton } from "~/utils/uploadthing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

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
import { Input } from "~/components/ui/input";
import { saveSponsor } from "./actions";
import { useState } from "react";

const formSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Vul de bedrijfsnaam in.")
    .max(256, "Bedrijfsnaam is te lang."),
  companyOwnerName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(2, "Vul de naam van de zaakvoerder in.")
      .max(256, "Naam van de zaakvoerder is te lang.")
      .optional(),
  ),
  municipality: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(2, "Vul de gemeente in.")
      .max(256, "Gemeente is te lang.")
      .optional(),
  ),
  postalCode: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Geef een geldige postcode in.")
      .optional(),
  ),
  street: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .min(2, "Vul de straatnaam in.")
      .max(256, "Straatnaam is te lang.")
      .optional(),
  ),
  number: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().trim().max(64, "Huisnummer is te lang.").optional(),
  ),
  landline: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^\d{3} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer in in het formaat 051 12 34 56.",
      )
      .optional(),
  ),
  mobile: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .regex(
        /^\d{4} \d{2} \d{2} \d{2}$/,
        "Geef een geldig telefoonnummer in in het formaat 0495 12 34 56.",
      )
      .optional(),
  ),
  email: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .email("Geef een geldig emailadres in.")
      .max(256, "Emailadres is te lang.")
      .optional(),
  ),
  websiteUrl: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .trim()
      .url("Geef een geldige URL in.")
      .max(256, "URL is te lang.")
      .optional(),
  ),
  amount: z.preprocess(
    (val) => (Number.isNaN(val) ? undefined : Number(val)),
    z.number().min(0, "Bedrag moet positief zijn."),
  ),
  logoUrl: z
    .string()
    .trim()
    .url("Geef een geldige URL in.")
    .max(256, "URL is te lang."),
  paid: z.boolean(),
});

export default function AddSponsorForm() {
  const [showLogoUpload, setShowLogoUpload] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyOwnerName: "",
      municipality: "Houthulst",
      postalCode: "8650",
      street: "",
      number: "",
      landline: "",
      mobile: "",
      email: "",
      websiteUrl: "",
      amount: 50,
      logoUrl: "",
      paid: false,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await saveSponsor(data);

    form.reset();
    setShowLogoUpload(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-rows-6 gap-4"
      >
        <div className="flex flex-row gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam onderneming</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input type="number" {...field} />
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
          <Image
            src={form.getValues("logoUrl")}
            alt="Logo"
            width={200}
            height={100}
          />
        )}

        <Button type="submit" className="align-self-end">
          Sponsor toevoegen
        </Button>
      </form>
    </Form>
  );
}
