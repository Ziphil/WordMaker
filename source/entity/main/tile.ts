//

import {
  vec
} from "excalibur";
import {
  ASSETS
} from "/source/core/asset";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  TILE_DIMENSTION
} from "/source/entity/main/field";


export type BlockConfigs = {
  tileX: number,
  tileY: number
};


export class Tile extends FloatingActor {

  public constructor({tileX, tileY, ...configs}: BlockConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height)
    });
    this.graphics.use(ASSETS.block.toSprite());
  }

}