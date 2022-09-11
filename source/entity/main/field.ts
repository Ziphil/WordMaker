//

import {
  Color,
  Engine
} from "excalibur";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  Tile
} from "/source/entity/main/tile";


export const TILE_DIMENSTION = {
  width: 17,
  height: 17
};
export const FIELD_DIMENSION = {
  tileWidth: 18,
  tileHeight: 18
};


export class Field extends FloatingActor {

  private readonly tiles: Array<Tile | undefined>;

  public constructor() {
    super({
      width: FIELD_DIMENSION.tileWidth * TILE_DIMENSTION.width,
      height: FIELD_DIMENSION.tileHeight * TILE_DIMENSTION.height,
      color: Color.fromHex("#00000022")
    });
    this.tiles = Array.from({length: FIELD_DIMENSION.tileWidth * FIELD_DIMENSION.tileHeight});
  }

  public override onInitialize(engine: Engine): void {
    this.addTile(0, 0);
    this.addTile(2, 3);
    this.addTile(2, 4);
    this.addTile(1, 5);
    this.addTile(3, 6);
    this.addTile(4, 6);
  }

  private addTile(tileX: number, tileY: number): void {
    const index = tileX + tileY * FIELD_DIMENSION.tileWidth;
    if (this.tiles[index] === undefined) {
      const tile = new Tile({tileX, tileY});
      this.tiles[index] = tile;
      this.addChild(tile);
    } else {
      throw new Error(`tile already exists at (${tileX}, ${tileY})`);
    }
  }

}