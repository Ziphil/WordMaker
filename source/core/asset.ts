//

import {
  ImageSource,
  SpriteSheet
} from "excalibur";


export const ASSETS = {
  block: new ImageSource("asset/image/block.png")
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
  })
};

export const SPRITE_FONTS = {
};