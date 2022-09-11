//

import {
  Circle,
  Color,
  vec
} from "excalibur";
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

}