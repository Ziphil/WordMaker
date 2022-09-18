//

import {
  Engine,
  Text,
  vec
} from "excalibur";
import {
  SPRITE_FONTS
} from "/source/core/asset";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  Status
} from "/source/entity/main/status";


export class ScoreLabel extends FloatingActor {

  private text!: Text;
  public status!: Status;

  public constructor({x, y}: {x: number, y: number}) {
    super({
      pos: vec(x, y),
      anchor: vec(0.5, 0)
    });
  }

  public override onInitialize(engine: Engine): void {
    this.initializeGraphics();
  }

  public override onPreUpdate(engine: Engine): void {
    this.updateScore();
  }

  private initializeGraphics(): void {
    const string = this.status.displayScore.toFixed(0);
    const text = new Text({text: string, font: SPRITE_FONTS.char});
    this.text = text;
    this.graphics.use(text);
  }

  private updateScore(): void {
    const string = this.status.displayScore.toFixed(0);
    this.text.text = string;
  }

}