//

import {
  Engine,
  vec
} from "excalibur";
import {
  SPRITE_SHEETS
} from "/source/core/asset";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  Status
} from "/source/entity/main/status";
import {
  ScoreLabel
} from "/source/entity/status/score-label";
import {
  TimeBar
} from "/source/entity/status/time-bar";


export class StatusPane extends FloatingActor {

  public status!: Status;

  public constructor() {
    super({
      pos: vec(26, 6)
    });
    this.graphics.use(SPRITE_SHEETS.status.sprites[0]);
  }

  public override onInitialize(engine: Engine): void {
    this.addChildren();
  }

  public override onPreUpdate(engine: Engine): void {
  }

  private addChildren(): void {
    const graphic = this.graphics.current[0].graphic;
    const scoreLabel = new ScoreLabel({x: graphic.width / 2, y: 10});
    const timeBar = new TimeBar({x: 3, y: 3});
    scoreLabel.status = this.status;
    timeBar.status = this.status;
    this.addChild(scoreLabel);
    this.addChild(timeBar);
  }

}