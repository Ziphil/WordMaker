//

import {
  ImageSource,
  SpriteSheet
} from "excalibur";


export const ASSETS = {
  block: new ImageSource("asset/image/block.png"),
  field: new ImageSource("asset/image/field.png")
};

export const SPRITE_SHEETS = {
  block: SpriteSheet.fromImageSource({
    image: ASSETS.block,
    grid: {
      rows: 7,
      columns: 6,
      spriteWidth: 20,
      spriteHeight: 23
    }
  }),
  field: SpriteSheet.fromImageSourceWithSourceViews({
    image: ASSETS.field,
    sourceViews: [
      {x: 0, y: 0, width: 22, height: 22},
      {x: 22, y: 0, width: 21, height: 22},
      {x: 43, y: 0, width: 21, height: 22},
      {x: 0, y: 22, width: 22, height: 21},
      {x: 22, y: 22, width: 21, height: 21},
      {x: 43, y: 22, width: 21, height: 21},
      {x: 0, y: 43, width: 22, height: 23},
      {x: 22, y: 43, width: 21, height: 23},
      {x: 43, y: 43, width: 21, height: 23}
    ]
  })
};

export const SPRITE_FONTS = {
};