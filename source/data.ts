//

import axios from "axios";
import fs from "fs/promises";
import {
  SingleLoader
} from "soxsot/dist/io";


async function fetchDictionary(): Promise<void> {
  const response = await axios.get("https://dic.ziphil.com/api/dictionary/download?kind=single");
  const string = response.data;
  await fs.mkdir("source/data", {recursive: true});
  await fs.writeFile("source/data/dictionary.xdc", string);
}

async function saveData(): Promise<void> {
  const loader = new SingleLoader("source/data/dictionary.xdc");
  const dictionary = await loader.asPromise();
  const names = [];
  for (const word of dictionary.words) {
    const name = word.name;
    if (name.length >= 3 && !name.includes("+") && !name.includes("'")) {
      names.push(name);
    }
  }
  names.sort();
  const json = {names};
  const jsonString = JSON.stringify(json, undefined, 2);
  await fs.writeFile("source/data/data.json", jsonString);
}

async function run(): Promise<void> {
  await fetchDictionary();
  await saveData();
}

run();