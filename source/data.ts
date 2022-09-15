//

import axios from "axios";
import fs from "fs/promises";
import path from "path";
import {
  Dictionary
} from "soxsot";
import {
  SingleLoader
} from "soxsot/dist/io";


const API_URL = "https://dic.ziphil.com/api/dictionary/download?kind=single";
const DICTIONARY_PATH = "source/data/dictionary.xdc";
const DATA_PATH = "source/data/data.json";

async function fetchDictionary(): Promise<Dictionary> {
  const response = await axios.get(API_URL);
  const string = response.data;
  await fs.mkdir(path.dirname(DICTIONARY_PATH), {recursive: true});
  await fs.writeFile(DICTIONARY_PATH, string);
  const loader = new SingleLoader(DICTIONARY_PATH);
  const dictionary = await loader.asPromise();
  return dictionary;
}

function generateNames(dictionary: Dictionary): Array<string> {
  const names = [];
  for (const word of dictionary.words) {
    const name = word.name;
    if (name.length >= 3 && !name.includes("+") && !name.includes("'")) {
      names.push(name);
    }
  }
  names.sort();
  return names;
}

function generateRates(dictionary: Dictionary): Record<string, number> {
  const rateMap = new Map<string, number>();
  let total = 0;
  for (const word of dictionary.words) {
    const name = word.name;
    if (name.length >= 3 && !name.includes("+") && !name.includes("'")) {
      const chars = name.split("");
      for (const char of chars) {
        rateMap.set(char, (rateMap.get(char) ?? 0) + 1);
        total ++;
      }
    }
  }
  const rates = Object.fromEntries([...rateMap.entries()].map(([char, count]) => [char, count / total]));
  return rates;
}

async function run(): Promise<void> {
  const dictionary = await fetchDictionary();
  const names = generateNames(dictionary);
  const rates = generateRates(dictionary);
  const json = {names, rates};
  const jsonString = JSON.stringify(json, undefined, 2);
  await fs.writeFile(DATA_PATH, jsonString);
}

run();