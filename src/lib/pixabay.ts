export interface PixabayImage {
  id: number;
  pageURL: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  likes: number;
  views: number;
  user: string;
}

const PIXABAY_KEY =
  process.env.PIXABAY_API_KEY ||
  process.env.NEXT_PUBLIC_PIXABAY_API_KEY ||
  "";

export async function searchPixabayImages(
  query: string,
  category: string = "interior",
  perPage: number = 12
): Promise<PixabayImage[]> {
  if (!PIXABAY_KEY) {
    return [];
  }
  try {
    const encoded = encodeURIComponent(`${query} interior bedroom room design`);
    const res = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encoded}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      console.warn("Pixabay API response not ok:", res.status);
      return [];
    }
    const data = await res.json();
    return data.hits || [];
  } catch (error) {
    console.warn("Error fetching from Pixabay:", error);
    return [];
  }
}

