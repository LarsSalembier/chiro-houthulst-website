import { useAuth, useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useEffect } from "react";

export default function PostHogAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = useUser();

  useEffect(() => {
    if (userInfo.user) {
      posthog.identify(userInfo.user.id, {
        emails: userInfo.user.emailAddresses[0]?.emailAddress,
        username: userInfo.user.fullName,
      });
    } else if (!userInfo.isSignedIn) {
      posthog.reset();
    }
  }, [userInfo]);

  return children;
}
