// Country keys stored in ingredients.country_of_origin.
// Keys MUST exactly match KEY_TO_ISO in app/src/data/countryData.ts —
// the customer dashboard map engine looks them up by this key.

export interface ExtractCountry {
  key: string;
  label: string;
}

export const EXTRACT_COUNTRIES: ExtractCountry[] = [
  { key: "bulgaria", label: "Bulgaria" },
  { key: "ukraine", label: "Ukraine" },
  { key: "romania", label: "Romania" },
  { key: "poland", label: "Poland" },
  { key: "hungary", label: "Hungary" },
  { key: "czechia", label: "Czech Republic" },
  { key: "slovakia", label: "Slovakia" },
  { key: "serbia", label: "Serbia" },
  { key: "croatia", label: "Croatia" },
  { key: "bosnia", label: "Bosnia & Herzegovina" },
  { key: "montenegro", label: "Montenegro" },
  { key: "albania", label: "Albania" },
  { key: "north-macedonia", label: "North Macedonia" },
  { key: "moldova", label: "Moldova" },
  { key: "lithuania", label: "Lithuania" },
  { key: "latvia", label: "Latvia" },
  { key: "estonia", label: "Estonia" },
  { key: "slovenia", label: "Slovenia" },
  { key: "greece", label: "Greece" },
  { key: "turkey", label: "Turkey" },
  { key: "belarus", label: "Belarus" },
  { key: "austria", label: "Austria" },
  { key: "germany", label: "Germany" },
  { key: "georgia", label: "Georgia" },
];
