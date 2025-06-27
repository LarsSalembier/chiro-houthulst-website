export function capitalize(text: string) {
  const words = text.split(/(\s+)/);

  return words
    .map((word) => {
      if (word.length === 0) {
        return word;
      }

      if (word.startsWith("'") && word[1]) {
        return word[0] + word[1].toUpperCase() + word.slice(2);
      }

      return word[0]!.toUpperCase() + word.slice(1);
    })
    .join("");
}
