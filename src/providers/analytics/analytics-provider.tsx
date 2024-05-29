"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "~/env";
import PostHogAuthWrapper from "./posthog-auth-wrapper";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://app.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export default function CSPostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
    </PostHogProvider>
  );
}
