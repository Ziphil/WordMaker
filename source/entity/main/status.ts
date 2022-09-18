//

import {
  Engine,
  Entity
} from "excalibur";
import {
  StoriesComponent,
  StoryGenerator
} from "/source/component";
import {
  clamp,
  lerp
} from "/source/util/misc";
import {
  searchString
} from "/source/util/word";


export class Status extends Entity {

  public score: number;
  private temporalScores: [number, ...Array<number | null>];
  public time: number;
  private timer: number;
  public foundNames: Array<string>;

  public constructor() {
    super();
    this.score = 0;
    this.temporalScores = [0];
    this.time = 50;
    this.timer = 0;
    this.foundNames = [];
    this.initializeComponents();
  }

  public override onPreUpdate(engine: Engine, delta: number): void {
    this.updateTime(delta);
  }

  private initializeComponents(): void {
    const actionComponent = new StoriesComponent();
    this.addComponent(actionComponent);
  }

  private updateTime(delta: number): void {
    this.time -= delta * 0.001;
    this.timer += delta;
  }

  public clear(name: string): void {
    const found = searchString(this.foundNames, name);
    const gainedScore = (name.length / ((found) ? 3 : 1)) ** 2;
    this.score += gainedScore;
    this.time += gainedScore;
    this.stories.addStory(() => this.storyAddScore(gainedScore, 300));
    if (!found) {
      this.foundNames.push(name);
      this.foundNames.sort();
    }
  }

  public *storyAddScore(gainedScore: number, duration: number): StoryGenerator {
    let timer = 0;
    const emptyIndex = this.temporalScores.findIndex((score) => score === null);
    const index = (emptyIndex >= 0) ? emptyIndex : this.temporalScores.length;
    this.temporalScores[index] = 0;
    while (true) {
      timer += yield;
      const ratio = clamp(timer / duration, 0, 1);
      const temporalScore = lerp(0, gainedScore, ratio);
      this.temporalScores[index] = temporalScore;
      if (timer >= duration) {
        this.temporalScores[0] += gainedScore;
        this.temporalScores[index] = null;
        break;
      }
    }
  }

  public get displayScore(): number {
    return this.temporalScores.reduce<number>((previous, current) => previous + (current ?? 0), 0);
  }

  private get stories(): StoriesComponent {
    return this.get(StoriesComponent)!;
  }

}