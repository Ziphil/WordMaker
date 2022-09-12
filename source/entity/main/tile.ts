//

import {
  Engine,
  vec
} from "excalibur";
import {
  ActionManagerComponent,
  moveTo
} from "/source/component/action-manager";
import {
  ASSETS
} from "/source/core/asset";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  TILE_DIMENSTION
} from "/source/entity/main/field";
import {
  Direction,
  calcVectorFromDirection
} from "/source/util/misc";


export type BlockConfigs = {
  tileX: number,
  tileY: number
};


export class Tile extends FloatingActor {

  public tileX: number;
  public tileY: number;
  public moving: boolean;

  public constructor({tileX, tileY, ...configs}: BlockConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height)
    });
    this.tileX = tileX;
    this.tileY = tileY;
    this.moving = false;
    this.graphics.use(ASSETS.block.toSprite());
  }

  public override onInitialize(engine: Engine): void {
    this.initializeComponents(engine);
  }

  private initializeComponents(engine: Engine): void {
    const actionComponent = new ActionManagerComponent();
    this.addComponent(actionComponent);
  }

  public move(direction: Direction): void {
    const actionManager = this.get(ActionManagerComponent)!;
    if (!this.moving) {
      const directionVector = calcVectorFromDirection(direction);
      actionManager.addAction(() => this.actMove(direction));
      this.tileX += directionVector.x;
      this.tileY += directionVector.y;
    }
  }

  private *actMove(direction: Direction): Generator<unknown, void, number> {
    const directionVector = calcVectorFromDirection(direction);
    const diffPos = directionVector.scale(vec(TILE_DIMENSTION.width, TILE_DIMENSTION.height));
    this.moving = true;
    yield* moveTo(this, this.pos.add(diffPos), 140);
    this.moving = false;
  }

}