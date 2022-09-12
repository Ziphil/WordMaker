//


export function *parallel<N>(...generators: Array<Generator<unknown, void, N>>): Generator<unknown, void, N> {
  while (true) {
    const elapsed = yield;
    const results = [];
    for (const generator of generators) {
      results.push(generator.next(elapsed));
    }
    if (results.every((result) => result.done)) {
      break;
    }
  }
}