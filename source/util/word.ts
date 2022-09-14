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

export function convertIndexToKey(index: number): string {
  const key = String.fromCodePoint(index + 0x30);
  return key;
}

export function convertCharToKey(char: string): string {
  const key = convertIndexToKey(convertCharToIndex(char));
  return key;
}

export function convertIndicesToString(indices: Array<number>): string {
  const string = indices.map(convertIndexToChar).join("");
  return string;
}

export function convertStringToIndices(string: string): Array<number> {
  const indices = string.split("").map(convertCharToIndex);
  return indices;
}

export function convertStringToKey(string: string): string {
  const key = string.split("").map(convertCharToKey).join("");
  return key;
}

export function searchString(keys: Array<string>, key: string): boolean {
  let start = 0;
  let end = keys.length - 1;
  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    if (keys[middle] < key) {
      start = middle + 1;
    } else if (keys[middle] > key) {
      end = middle - 1;
    } else {
      return true;
    }
  }
  return false;
}