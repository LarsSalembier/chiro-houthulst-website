// "use client";

// import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
// import {
//   PageHeader,
//   PageHeaderHeading,
//   PageHeaderDescription,
// } from "~/components/page-header";
// import AddGroupForm from "./add-group-form";

// export default function CreateNewGroupPage() {
//   return (
//     <div className="container relative flex flex-col gap-6">
//       <SignedOut>
//         <RedirectToSignIn />
//       </SignedOut>
//       <SignedIn>
//         <PageHeader>
//           <PageHeaderHeading>Voeg nieuwe groep toe</PageHeaderHeading>
//           <PageHeaderDescription>
//             Vul onderstaand formulier in om een nieuwe groep toe te voegen
//           </PageHeaderDescription>
//         </PageHeader>
//         <div className="pb-8 md:pb-12 lg:pb-12">
//           <AddGroupForm />
//         </div>
//       </SignedIn>
//     </div>
//   );
// }
