// src/api.ts
export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  date_start: number | null;
  date_end: number | null;
}

export interface ApiResponse {
  data: Array<Artwork>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
    next_url: string | null;
  } | null;
}

// Fetch artworks from the Art Institute API
export async function fetchArtworksPage(
  page: number,
  limit = 12
): Promise<{
  items: Artwork[];
  totalPages: number;
  total: number;
  currentPage: number;
}> {
  const url = `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch artworks");
  }

  const json: ApiResponse = await res.json();
  const data = json.data || [];
  const pagination = json.pagination;

  const items: Artwork[] = data.map((d) => ({
    id: d.id,
    title: d.title ?? "Untitled",
    place_of_origin: d.place_of_origin ?? "Unknown",
    artist_display: d.artist_display ?? "Unknown",
    inscriptions: d.inscriptions ?? "-",
    date_start: d.date_start ?? null,
    date_end: d.date_end ?? null,
  }));

  return {
    items,
    totalPages: pagination?.total_pages ?? 1,
    total: pagination?.total ?? items.length,
    currentPage: pagination?.current_page ?? page,
  };
}
