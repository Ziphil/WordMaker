//

import {
  GraphicsGroup,
  GraphicsGrouping,
  vec
} from "excalibur";
import {
  SPRITE_SHEETS
} from "/source/core/asset";
import {
  FIELD_PROPS,
  TILE_DIMENSTION
} from "/source/entity/main/field";


export class FieldGraphic extends GraphicsGroup {

  public constructor() {
    const members = getFieldGraphicsGrouping();
    super({members});
  }

}


function getFieldGraphicsGrouping(): Array<GraphicsGrouping> {
  const members = [];
  const sprites = SPRITE_SHEETS.field.sprites;
  const {width, height} = TILE_DIMENSTION;
  const {tileWidth, tileHeight} = FIELD_PROPS;
  for (let tileY = 1 ; tileY < tileHeight - 1 ; tileY ++) {
    const y = 20 + ((tileY === 1) ? 0 : (height + 1) + height * (tileY - 2));
    const baseSpriteIndex = (tileY === 1) ? 0 : (tileY === tileHeight - 2) ? 6 : 3;
    for (let tileX = 1 ; tileX < tileWidth - 1 ; tileX ++) {
      const x = 20 + ((tileX === 1) ? 0 : (width + 1) + width * (tileX - 2));
      const spriteIndex = baseSpriteIndex + ((tileX === 1) ? 0 : (tileX === tileWidth - 2) ? 2 : 1);
      members.push({graphic: sprites[spriteIndex], pos: vec(x, y)});
    }
  }
  return members;
}