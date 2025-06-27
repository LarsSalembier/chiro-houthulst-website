import { normalize } from "./normalize";

export function isFuzzyMatch(text: string, search: string): boolean {
  text = normalize(text);
  search = normalize(search);

  let searchIndex = 0;

  for (let i = 0; i < text.length && searchIndex < search.length; i++) {
    if (text[i] === search[searchIndex]) {
      searchIndex++;
    }
  }

  return searchIndex === search.length;
}
