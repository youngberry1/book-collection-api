export interface Review {
  name: string;
  body: string;
  _id?: string;
}

export interface Book {
  _id?: string;
  title: string;
  author: string;
  pages: number;
  rating: number;
  genres: string[];
  reviews?: Review[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse {
  data: Book[];
  totalBooks: number;
  totalPages: number;
  currentPage: number;
}

/** Server configuration response */
export interface ConfigResponse {
  apiUrl: string;
  isDev: boolean;
}
