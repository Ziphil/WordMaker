//


const CHARS = ["s", "z", "t", "d", "k", "g", "f", "v", "p", "b", "c", "q", "x", "j", "l", "r", "n", "m", "y", "h", "a", "á", "à", "â", "e", "é", "è", "ê", "i", "í", "ì", "î", "o", "ò", "ô", "u", "ù", "û"];
const INVERT_CHARS = Object.fromEntries(CHARS.map((char, index) => [char, index]));

export function convertIndexToChar(index: number): string {
  const char = CHARS[index] ?? "";
  if (char === "") {
    console.warn(`invalid index: ${index}`);
  }
  return char;
}

export function convertCharToIndex(char: string): number {
  const index = INVERT_CHARS[char] ?? -1;
  if (index === -1) {
    console.warn(`invalid char: ${char}`);
  }
  return index;
}

export function convertIndicesToString(indices: Array<number>): string {
  const string = indices.map(convertIndexToChar).join("");
  return string;
}

export function convertStringToIndices(string: string): Array<number> {
  const indices = string.split("").map(convertCharToIndex);
  return indices;
}

export function searchString(strings: Array<string>, string: string): boolean {
  let start = 0;
  let end = strings.length - 1;
  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    if (strings[middle] < string) {
      start = middle + 1;
    } else if (strings[middle] > string) {
      end = middle - 1;
    } else {
      return true;
    }
  }
  return false;
}