import { toUnicode } from "./lib/punycode.js";

export = function domainToUnicode(input: string): string {
  return toUnicode(input);
};
