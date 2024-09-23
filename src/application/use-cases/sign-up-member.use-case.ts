import { captureException, startSpan } from "@sentry/nextjs";

import { getInjection } from "di/container";
import { type RegistrationFormData } from "~/app/(public)/leidingsportaal/nieuw-lid-inschrijven/schemas";
import { type Address } from "~/domain/entities/address";
import { AddressAlreadyExistsError } from "~/domain/errors/addresses";
import { MemberAlreadyHasEmergencyContactError } from "~/domain/errors/emergency-contacts";
import { MemberAlreadyHasMedicalInformationError } from "~/domain/errors/medical-information";
import { MemberAlreadyExistsError } from "~/domain/errors/members";
import {
  ParentAlreadyExistsError,
  ParentAlreadyLinkedToMemberError,
} from "~/domain/errors/parents";
import { MemberAlreadyHasYearlyMembershipError } from "~/domain/errors/yearly-memberships";
import { isLeiding, isLoggedIn } from "~/lib/auth";

export function signUpMemberUseCase(input: { formData: RegistrationFormData }) {
  console.log("signUpMemberUseCase gestart met input:", input);

  return startSpan(
    { name: "signUpMember Use Case", op: "function" },

    async () => {
      try {
        console.log("Initialiseren van repositories...");

        const membersRepository = getInjection("IMembersRepository");
        const parentsRepository = getInjection("IParentsRepository");
        const addressesRepository = getInjection("IAddressesRepository");
        const emergencyContactsRepository = getInjection(
          "IEmergencyContactsRepository",
        );
        const medicalInformationRepository = getInjection(
          "IMedicalInformationRepository",
        );
        const yearlyMembershipsRepository = getInjection(
          "IYearlyMembershipsRepository",
        );

        if (!isLoggedIn()) {
          console.log("Gebruiker is niet ingelogd");
          return { error: "Je moet ingelogd zijn om een lid in te schrijven." };
        }

        if (!isLeiding()) {
          console.log("Gebruiker is geen leiding");
          return {
            error:
              "Je moet leiding zijn om een lid in te schrijven. Als je denkt dat dit een fout is, neem dan contact op met de beheerder.",
          };
        }

        let member;

        console.log("Aanmaken van lid...");

        // Aanmaken van lid
        try {
          member = await membersRepository.createMember({
            name: {
              firstName: input.formData.memberFirstName,
              lastName: input.formData.memberLastName,
            },
            gender: input.formData.memberGender,
            dateOfBirth: input.formData.memberDateOfBirth,
            phoneNumber: input.formData.memberPhoneNumber ?? null,
            emailAddress: input.formData.memberEmailAddress ?? null,
            gdprPermissionToPublishPhotos: input.formData.permissionPhotos,
          });

          console.log("Lid aangemaakt:", member);
        } catch (error) {
          console.log("Fout bij het aanmaken van lid:", error);

          if (error instanceof MemberAlreadyExistsError) {
            console.log("Lid bestaat al, ophalen van bestaand lid...");

            // Haal bestaand lid op zonder te updaten
            const existingMember =
              await membersRepository.getMemberByNameAndDateOfBirth(
                input.formData.memberFirstName,
                input.formData.memberLastName,
                input.formData.memberDateOfBirth,
              );

            if (existingMember) {
              member = existingMember;
              console.log("Bestaand lid opgehaald:", member);
            } else {
              console.log("Geen bestaand lid gevonden.");
              throw new Error(
                "Lid bestaat al, maar kon niet worden opgehaald.",
              );
            }
          } else {
            console.error("Onverwachte fout bij het aanmaken van lid:", error);
            throw error;
          }
        }

        if (!member) {
          console.error("Lid is undefined na aanmaak/ophalen.");
          throw new Error("Lid kon niet worden aangemaakt of opgehaald.");
        }

        console.log("Aanmaken van ouders...");

        // Aanmaken van ouders
        for (let i = 0; i < input.formData.parents.length; i++) {
          const parent = input.formData.parents[i]!;
          const isPrimary = i === 0;

          console.log(`Verwerken van ouder ${i + 1}:`, parent);

          let address: Address;

          try {
            address = await addressesRepository.createAddress({
              street: parent.street,
              houseNumber: parent.houseNumber,
              box: parent.bus ?? null,
              postalCode: parent.postalCode,
              municipality: parent.municipality,
            });

            console.log("Adres aangemaakt:", address);
          } catch (error) {
            console.log("Fout bij het aanmaken van adres:", error);

            if (error instanceof AddressAlreadyExistsError) {
              console.log("Adres bestaat al, ophalen van bestaand adres...");

              const result = await addressesRepository.getAddress(
                parent.street,
                parent.houseNumber,
                parent.bus ?? null,
                parent.municipality,
                parent.postalCode,
              );

              console.log("Bestaand adres:", result);

              if (result) {
                address = result;
              } else {
                console.error(
                  "Adres niet gevonden na AddressAlreadyExistsError.",
                );
                throw new Error(
                  "Adres niet gevonden na AddressAlreadyExistsError.",
                );
              }
            } else {
              console.error(
                "Onverwachte fout bij het aanmaken van adres:",
                error,
              );
              throw error;
            }
          }

          if (!address) {
            console.error("Adres is undefined na aanmaak/ophalen.");
            throw new Error("Adres kon niet worden aangemaakt of opgehaald.");
          }

          try {
            const createdParent = await parentsRepository.createParent({
              name: {
                firstName: parent.firstName,
                lastName: parent.lastName,
              },
              phoneNumber: parent.phoneNumber,
              emailAddress: parent.emailAddress,
              relationship: parent.type,
              addressId: address!.id,
            });

            console.log("Ouder aangemaakt:", createdParent);

            await parentsRepository.addMemberToParent(
              member.id,
              createdParent.id - 1,
              isPrimary,
            );

            console.log(`Lid gekoppeld aan ouder (ID: ${createdParent.id}).`);
          } catch (error) {
            console.log(
              "Fout bij het aanmaken van ouder of koppelen aan lid:",
              error,
            );

            if (error instanceof ParentAlreadyExistsError) {
              console.log("Ouder bestaat al, ophalen van bestaand ouder...");

              const existingParent = await parentsRepository.getParentByEmail(
                parent.emailAddress,
              );

              console.log("Bestaande ouder:", existingParent);

              if (existingParent) {
                // Koppel bestaand ouder aan lid zonder te updaten
                try {
                  await parentsRepository.addMemberToParent(
                    member.id,
                    existingParent.id,
                    isPrimary,
                  );

                  console.log(
                    `Lid gekoppeld aan bestaande ouder (ID: ${existingParent.id}).`,
                  );
                } catch (error) {
                  if (error instanceof ParentAlreadyLinkedToMemberError) {
                    console.log("Ouder is al gekoppeld aan lid, overslaan.");
                    // Do nothing
                  } else {
                    console.error(
                      "Onverwachte fout bij het koppelen van lid aan ouder:",
                      error,
                    );
                    throw error;
                  }
                }
              } else {
                console.error(
                  "Ouder niet gevonden na ParentAlreadyExistsError.",
                );
                throw new Error(
                  "Ouder niet gevonden na ParentAlreadyExistsError.",
                );
              }
            } else if (error instanceof ParentAlreadyLinkedToMemberError) {
              console.log("Ouder is al gekoppeld aan lid, overslaan.");
              // Do nothing
            } else {
              console.error(
                "Onverwachte fout bij het aanmaken van ouder:",
                error,
              );
              throw error;
            }
          }
        }

        console.log("Aanmaken van noodcontactpersoon...");

        // Aanmaken van extra contactpersoon
        try {
          await emergencyContactsRepository.createEmergencyContact({
            memberId: member.id,
            name: {
              firstName: input.formData.extraContactPersonFirstName,
              lastName: input.formData.extraContactPersonLastName,
            },
            phoneNumber: input.formData.extraContactPersonPhoneNumber,
            relationship: input.formData.extraContactPersonRelationship ?? null,
          });

          console.log("Noodcontactpersoon aangemaakt.");
        } catch (error) {
          console.log("Fout bij het aanmaken van noodcontactpersoon:", error);

          if (error instanceof MemberAlreadyHasEmergencyContactError) {
            console.log("Lid heeft al een noodcontactpersoon, overslaan.");
            // Do nothing
          } else {
            console.error(
              "Onverwachte fout bij het aanmaken van noodcontactpersoon:",
              error,
            );
            throw error;
          }
        }

        console.log("Aanmaken van medische informatie...");

        // Aanmaken van medische informatie
        try {
          await medicalInformationRepository.createMedicalInformation({
            memberId: member.id,
            pastMedicalHistory: input.formData.pastMedicalHistory ?? null,
            tetanusVaccination:
              input.formData.tetanusVaccination === "true" ? true : false,
            tetanusVaccinationYear:
              input.formData.tetanusVaccinationYear ?? null,
            asthma: {
              hasCondition: input.formData.asthma,
              info: input.formData.asthmaInfo ?? null,
            },
            bedwetting: {
              hasCondition: input.formData.bedwetting,
              info: input.formData.bedwettingInfo ?? null,
            },
            epilepsy: {
              hasCondition: input.formData.epilepsy,
              info: input.formData.epilepsyInfo ?? null,
            },
            heartCondition: {
              hasCondition: input.formData.heartCondition,
              info: input.formData.heartConditionInfo ?? null,
            },
            hayFever: {
              hasCondition: input.formData.hayFever,
              info: input.formData.hayFeverInfo ?? null,
            },
            skinCondition: {
              hasCondition: input.formData.skinCondition,
              info: input.formData.skinConditionInfo ?? null,
            },
            rheumatism: {
              hasCondition: input.formData.rheumatism,
              info: input.formData.rheumatismInfo ?? null,
            },
            sleepwalking: {
              hasCondition: input.formData.sleepwalking,
              info: input.formData.sleepwalkingInfo ?? null,
            },
            diabetes: {
              hasCondition: input.formData.diabetes,
              info: input.formData.diabetesInfo ?? null,
            },
            otherMedicalConditions:
              input.formData.otherMedicalConditions ?? null,
            foodAllergies: input.formData.foodAllergiesInfo ?? null,
            substanceAllergies: input.formData.substanceAllergiesInfo ?? null,
            medicationAllergies: input.formData.medicationAllergiesInfo ?? null,
            medication: input.formData.medication ?? null,
            getsTiredQuickly:
              input.formData.getsTiredQuickly === "true" ? true : false,
            canParticipateSports:
              input.formData.canParticipateSports === "true" ? true : false,
            canSwim: input.formData.canSwim === "true" ? true : false,
            otherRemarks: input.formData.otherRemarks ?? null,
            permissionMedication:
              input.formData.hasToTakeMedication === "true" ? true : false,
            doctor: {
              name: {
                firstName: input.formData.doctorFirstName,
                lastName: input.formData.doctorLastName,
              },
              phoneNumber: input.formData.doctorPhoneNumber,
            },
          });

          console.log("Medische informatie aangemaakt.");
        } catch (error) {
          console.log("Fout bij het aanmaken van medische informatie:", error);

          if (error instanceof MemberAlreadyHasMedicalInformationError) {
            console.log("Lid heeft al medische informatie, overslaan.");
            // Do nothing
          } else {
            console.error(
              "Onverwachte fout bij het aanmaken van medische informatie:",
              error,
            );
            throw error;
          }
        }

        console.log("Ophalen van het huidige werkjaar...");

        // Huidig werkjaar ophalen
        const workYearsRepository = getInjection("IWorkyearsRepository");
        const currentWorkYear = await workYearsRepository.getWorkyearByDate(
          new Date(),
        );

        console.log("Huidig werkjaar:", currentWorkYear);

        if (!currentWorkYear) {
          console.error("Geen huidig werkjaar gevonden.");
          return {
            error:
              "Er is nog geen werkjaar opgestart, dus je kan geen lid inschrijven.",
          };
        }

        console.log("Aanmaken van jaarlijks lidmaatschap...");

        // Aanmaken van inschrijving voor huidig werkjaar
        try {
          await yearlyMembershipsRepository.createYearlyMembership({
            memberId: member.id,
            groupId: input.formData.memberGroupId,
            workYearId: currentWorkYear.id,
            paymentReceived: false,
            paymentMethod: null,
            paymentDate: null,
          });

          console.log("Jaarlijks lidmaatschap aangemaakt.");
        } catch (error) {
          console.log(
            "Fout bij het aanmaken van jaarlijks lidmaatschap:",
            error,
          );

          if (error instanceof MemberAlreadyHasYearlyMembershipError) {
            console.log(
              "Lid heeft al een jaarlijks lidmaatschap, overslaan...",
            );
            // Do nothing
          } else {
            console.error(
              "Onverwachte fout bij het aanmaken van jaarlijks lidmaatschap:",
              error,
            );
            throw error;
          }
        }

        console.log("Inschrijving succesvol afgerond.");

        return member;
      } catch (error) {
        console.error("Fout in signUpMemberUseCase:", error);
        captureException(error);
        return {
          error:
            "Er is een onbekende fout opgetreden bij het aanmaken van het lid. De beheerder is op de hoogte gebracht. Probeer het later opnieuw.",
        };
      }
    },
  );
}
