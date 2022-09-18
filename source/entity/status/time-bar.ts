//

import {
  Engine,
  Sprite,
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


export class TimeBar extends FloatingActor {

  private sprite!: Sprite;
  public status!: Status;

  public constructor({x, y}: {x: number, y: number}) {
    super({
      pos: vec(x, y)
    });
  }

  public override onInitialize(engine: Engine): void {
    this.initializeGraphics();
  }

  public override onPreUpdate(engine: Engine): void {
    this.updateScore();
  }

  private initializeGraphics(): void {
    const sprite = SPRITE_SHEETS.status.sprites[1];
    this.sprite = sprite;
    this.graphics.use(sprite);
  }

  private updateScore(): void {
    this.sprite.sourceView.width = 268 * (this.status.time / 50);
    this.sprite.destSize.width = 268 * (this.status.time / 50);
  }

}