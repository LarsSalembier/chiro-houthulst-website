import { type Metadata } from "next";

const siteConfig = {
  name: "Chiro Sint-Jan Houthulst",
  baseUrl: "https://chirohouthulst.be",
  description:
    "Chiro Houthulst is een leuke en actieve jeugdbeweging voor kinderen vanaf het derde kleuter. Kom elke zondag tussen 14u en 17u spelen en nieuwe vrienden maken!",
  author: "Lars Salembier",
  authorUrl: "https://github.com/LarsSalembier",
  twitterHandle: "@chirohouthulst",
  defaultImage: {
    url: "https://chirohouthulst.be/kampgroepsfoto.jpg",
    width: 2048,
    height: 1536,
    alt: "Chiro Houthulst op kamp",
  },
  baseKeywords: [
    "Chiro Houthulst",
    "Chiro Sint-Jan Houthulst",
    "Jeugdbeweging Houthulst",
    "Chiro Sint-Jan",
    "Chiro",
    "Houthulst",
    "Jeugdbeweging",
  ],
};

type GenerateMetadataProps = {
  urlAfterBaseUrl?: string;
  title?: string;
  description?: string;
  extraKeywords?: string[];
};

export function generateMetadata({
  urlAfterBaseUrl,
  title,
  description,
  extraKeywords,
}: GenerateMetadataProps): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description ?? siteConfig.description;
  const pageKeywords = [...siteConfig.baseKeywords, ...(extraKeywords ?? [])];
  const pageUrl = `${siteConfig.baseUrl}${urlAfterBaseUrl ? "" : `/${urlAfterBaseUrl}`}`;

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: siteConfig.name,
    authors: [
      {
        name: siteConfig.author,
        url: siteConfig.authorUrl,
      },
    ],
    keywords: pageKeywords,
    creator: siteConfig.author,
    publisher: siteConfig.name,
    robots: "index, follow",
    icons: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "icons/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "icons/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "icons/favicon-16x16.png",
      },
      {
        rel: "mask-icon",
        url: "icons/safari-pinned-tab.svg",
        color: "#104f29",
      },
    ],
    manifest: "icons/manifest.json",
    openGraph: {
      type: "website",
      locale: "nl_BE",
      url: pageUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      images: [siteConfig.defaultImage],
    },
    twitter: {
      site: siteConfig.twitterHandle,
      creator: siteConfig.author,
      description: pageDescription,
      title: pageTitle,
      images: [siteConfig.defaultImage],
      card: "summary_large_image",
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      startupImage: [
        {
          url: "icons/apple-touch-icon.png",
        },
      ],
      statusBarStyle: "black-translucent",
    },
  };
}
