export interface GetImagesParams {
  /**
   * Key param is injected in every request. This value should be in the config file
   */
  // key: string;

  /**
   * A URL encoded search term. If omitted, all images are returned. This value may not exceed 100 characters.
    Example: "yellow+flower"
   */
  q?: string;

  /**
   * 	How the results should be ordered.
      Accepted values: "popular", "latest"
      Default: "popular"
   */
  order?: "popular" | "latest";

  /**
   * 	Returned search results are paginated. Use this parameter to select the page number.
      Default: 1
   */
  page?: number;

  /**
   * 	Determine the number of results per page.
      Accepted values: 3 - 200
      Default: 20
   */
  per_page?: number;
}

export interface GetImagesJsonResult {
  total: number;
  totalHits: number;
  hits: ImageJsonResult[];
}

export interface ImageJsonResult {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  favorites: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}
