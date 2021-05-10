import config from "../config";
import {
  GetImagesJsonResult,
  GetImagesParams,
  ImageJsonResult,
} from "../models";

export const getImages = async (
  params: GetImagesParams
): Promise<ImageJsonResult[]> => {
  const { order = "popular", page = 1, per_page = 20, q = "" } = params;
  const url = `https://pixabay.com/api?key=${config.pixabay.apiKey}&editors_choice=true&order=${order}&page=${page}&per_page=${per_page}&q=${q}`;
  console.log(url);

  const fetchResult = await fetch(url);
  const jsonResult: GetImagesJsonResult = await fetchResult.json();

  return jsonResult?.hits;
};
