//

import {
  Engine,
  Entity
} from "excalibur";
import {
  searchString
} from "/source/util/word";


export class Status extends Entity {

  public score: number;
  public time: number;
  private timer: number;
  public foundNames: Array<string>;

  public constructor() {
    super();
    this.score = 0;
    this.time = 50;
    this.timer = 0;
    this.foundNames = [];
  }

  public override onPreUpdate(engine: Engine, delta: number): void {
    this.updateTime(delta);
  }

  private updateTime(delta: number): void {
    this.time -= delta * 0.001;
    this.timer += delta;
  }

  public clear(name: string): void {
    const found = searchString(this.foundNames, name);
    const gainedScore = Math.floor((name.length / ((found) ? 3 : 1)) ** 2);
    this.score += gainedScore;
    this.time += gainedScore;
    if (!found) {
      this.foundNames.push(name);
      this.foundNames.sort();
    }
  }

}