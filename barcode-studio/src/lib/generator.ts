import { getSpec, stripNonDigits, type Symbology } from "./gtin";

export interface PrefixValidation {
  ok: boolean;
  error: string | null;
  productRefLength: number | null;
}

export function validatePrefix(prefix: string, symbology: Symbology): PrefixValidation {
  const digits = stripNonDigits(prefix);
  if (digits.length === 0) {
    return { ok: false, error: null, productRefLength: null };
  }
  if (digits !== prefix) {
    return { ok: false, error: "digits only", productRefLength: null };
  }
  const totalLen = getSpec(symbology).length;
  const minPrefix = 6;
  const maxPrefix = totalLen - 2;
  if (digits.length < minPrefix) {
    return {
      ok: false,
      error: `prefix must be at least ${minPrefix} digits`,
      productRefLength: null,
    };
  }
  if (digits.length > maxPrefix) {
    return {
      ok: false,
      error: `prefix must be at most ${maxPrefix} digits for ${symbology.toUpperCase()}`,
      productRefLength: null,
    };
  }
  return {
    ok: true,
    error: null,
    productRefLength: totalLen - 1 - digits.length,
  };
}
