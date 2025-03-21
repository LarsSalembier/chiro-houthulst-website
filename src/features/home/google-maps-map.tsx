"use client";

interface GoogleMapsMapProps {
  searchQuery: string;
}

export default function GoogleMapsMap({ searchQuery }: GoogleMapsMapProps) {
  return (
    <iframe
      id="gmap_canvas"
      src={`https://maps.google.com/maps?width=750&height=400&hl=nl-BE&q=${searchQuery}&t=h&z=17&ie=UTF8&amp;iwloc=B&output=embed`}
      className="h-96 w-full rounded-3xl"
    />
  );
}
