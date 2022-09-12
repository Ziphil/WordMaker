//

import {
  Engine,
  vec
} from "excalibur";
import {
  ActionGenerator,
  ActionsComponent,
  moveTo
} from "/source/component";
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
  calcDirectionDiff
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
    const actionComponent = new ActionsComponent();
    this.addComponent(actionComponent);
  }

  public move(direction: Direction): void {
    const actions = this.get(ActionsComponent)!;
    if (!this.moving) {
      const [diffTileX, diffTileY] = calcDirectionDiff(direction);
      actions.addAction(() => this.actMove(direction));
      this.tileX += diffTileX;
      this.tileY += diffTileY;
    }
  }

  private *actMove(direction: Direction): ActionGenerator {
    const [diffTileX, diffTileY] = calcDirectionDiff(direction);
    const diffX = diffTileX * TILE_DIMENSTION.width;
    const diffY = diffTileY * TILE_DIMENSTION.height;
    this.moving = true;
    yield* moveTo(this, this.pos.add(vec(diffX, diffY)), 140);
    this.moving = false;
  }

}