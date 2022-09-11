//

import {
  Circle,
  Color,
  Engine,
  vec
} from "excalibur";
import {
  InputManagerComponent
} from "/source/component";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  TILE_DIMENSTION
} from "/source/entity/main/field";


export type PlayerConfigs = {
  tileX: number,
  tileY: number
};


export class Player extends FloatingActor {

  public constructor({tileX, tileY, ...configs}: PlayerConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height)
    });
    this.graphics.use(new Circle({radius: 8, color: Color.fromHex("#000000")}));
  }

  public override onInitialize(engine: Engine): void {
    this.initializeComponents(engine);
  }

  public override onPreUpdate(engine: Engine, delta: number): void {
    this.move(delta);
  }

  private initializeComponents(engine: Engine): void {
    const inputComponent = new InputManagerComponent();
    this.addComponent(inputComponent);
  }

  private move(delta: number): void {
    const inputManager = this.get(InputManagerComponent)!;
  }

}