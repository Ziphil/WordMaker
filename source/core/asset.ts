//

import {
  ImageSource,
  SpriteFont,
  SpriteSheet
} from "excalibur";


export const ASSETS = {
  char: new ImageSource("asset/image/char.png"),
  block: new ImageSource("asset/image/block.png"),
  field: new ImageSource("asset/image/field.png"),
  statusBackground: new ImageSource("asset/image/status-background.png")
};

export const SPRITE_SHEETS = {
  char: SpriteSheet.fromImageSourceWithSourceViews({
    image: ASSETS.char,
    sourceViews: [
      {x: 0, y: 0, width: 8, height: 17},
      {x: 16, y: 0, width: 8, height: 17},
      {x: 32, y: 0, width: 8, height: 17},
      {x: 48, y: 0, width: 10, height: 17},
      {x: 64, y: 0, width: 8, height: 17},
      {x: 0, y: 17, width: 12, height: 17},
      {x: 16, y: 17, width: 8, height: 17},
      {x: 32, y: 17, width: 10, height: 17},
      {x: 48, y: 17, width: 8, height: 17},
      {x: 64, y: 17, width: 8, height: 17}
    ]
  }),
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
  }),
  status: SpriteSheet.fromImageSourceWithSourceViews({
    image: ASSETS.statusBackground,
    sourceViews: [
      {x: 0, y: 0, width: 274, height: 32},
      {x: 3, y: 32, width: 268, height: 4}
    ]
  })
};

export const SPRITE_FONTS = {
  char: new SpriteFont({
    spriteSheet: SPRITE_SHEETS.char,
    alphabet: "0123456789",
    spacing: 2,
    caseInsensitive: true
  })
};