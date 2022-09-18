//

import {
  Engine,
  vec
} from "excalibur";
import {
  ASSETS
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


export class StatusPane extends FloatingActor {

  public status!: Status;

  public constructor() {
    super({
      pos: vec(26, 6)
    });
    this.graphics.use(ASSETS.statusBackground.toSprite());
  }

  public override onInitialize(engine: Engine): void {
    this.addChildren();
  }

  public override onPreUpdate(engine: Engine): void {
  }

  private addChildren(): void {
    const graphic = this.graphics.current[0].graphic;
    const scoreLabel = new ScoreLabel({x: graphic.width / 2, y: 12});
    scoreLabel.status = this.status;
    this.addChild(scoreLabel);
  }

}