import { getExtractOrigin } from "@/data/extractOrigins";
import type { ExtractOrigin } from "@/data/extractOrigins";

export interface ResolvedExtract {
  ingredientName: string;
  origin: ExtractOrigin;
  landscapesByCountry: Record<string, string>;
  legacyLandscapeUrl: string | null;
  allCountries: string[];
}

export interface DbExtractRow {
  name: string;
  country_of_origin: string[] | null;
  origin_description: string | null;
  landscape_url: string | null;
  country_landscapes: Record<string, string> | null;
}

export const DEFAULT_EXTRACT_COLOR = "#8b7d3c";

export function resolveExtract(ing: DbExtractRow): ResolvedExtract | null {
  const dbCountries = (ing.country_of_origin ?? []).filter(Boolean);
  const staticData = getExtractOrigin(ing.name);
  const countryLandscapes = ing.country_landscapes ?? {};

  if (dbCountries.length > 0) {
    return {
      ingredientName: ing.name,
      origin: {
        name: staticData?.name ?? ing.name,
        country: dbCountries[0],
        region: staticData?.region,
        description: ing.origin_description ?? staticData?.description ?? "",
        color: staticData?.color ?? DEFAULT_EXTRACT_COLOR,
      },
      landscapesByCountry: countryLandscapes,
      legacyLandscapeUrl: ing.landscape_url,
      allCountries: dbCountries,
    };
  }

  if (!staticData) return null;
  return {
    ingredientName: ing.name,
    origin: staticData,
    landscapesByCountry: countryLandscapes,
    legacyLandscapeUrl: ing.landscape_url,
    allCountries: [staticData.country],
  };
}

export function pickLandscape(
  extract: ResolvedExtract,
  countryKey: string | null
): string | null {
  if (countryKey && extract.landscapesByCountry[countryKey]) {
    return extract.landscapesByCountry[countryKey];
  }
  const anyCountryUrl = Object.values(extract.landscapesByCountry)[0];
  return anyCountryUrl ?? extract.legacyLandscapeUrl;
}
