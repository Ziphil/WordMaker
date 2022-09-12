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
export const FIELD_PROPS = {
  tileWidth: 18,
  tileHeight: 18
};


export class Field extends FloatingActor {

  private readonly tiles: Array<Tile | undefined>;

  public constructor() {
    super({
      width: FIELD_PROPS.tileWidth * TILE_DIMENSTION.width,
      height: FIELD_PROPS.tileHeight * TILE_DIMENSTION.height,
      color: Color.fromHex("#00000022")
    });
    this.tiles = Array.from({length: FIELD_PROPS.tileWidth * FIELD_PROPS.tileHeight});
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
    const index = tileX + tileY * FIELD_PROPS.tileWidth;
    if (this.tiles[index] === undefined) {
      const tile = new Tile({tileX, tileY});
      this.tiles[index] = tile;
      this.addChild(tile);
    } else {
      throw new Error(`tile already exists at (${tileX}, ${tileY})`);
    }
  }

  public moveTiles(tileX: number, tileY: number, direction: "right" | "left" | "down" | "up"): void {
    let index = tileX + tileY * FIELD_PROPS.tileWidth;
    const [diffIndex, maxIndex, minIndex] = calcIndexFromDirection(index, direction);
    const updatedTiles = [] ;
    updatedTiles.push({index: index + diffIndex, tile: undefined});
    while (true) {
      index += diffIndex;
      if ((maxIndex === null || index < maxIndex) && (minIndex === null || index >= minIndex)) {
        const tile = this.tiles[index];
        if (tile !== undefined) {
          tile.move(direction);
          updatedTiles.push({index: index + diffIndex, tile});
        } else {
          break;
        }
      } else {
        break;
      }
    }
    for (const {index, tile} of updatedTiles) {
      this.tiles[index] = tile;
    }
  }

}


export function calcIndexFromDirection(index: number, direction: "right" | "left" | "down" | "up"): [number, number | null, number | null] {
  if (direction === "right") {
    const diffIndex = 1;
    const maxIndex = (Math.floor(index / FIELD_PROPS.tileWidth) + 1) * FIELD_PROPS.tileWidth;
    return [diffIndex, maxIndex, null];
  } else if (direction === "left") {
    const diffIndex = -1;
    const minIndex = Math.floor(index / FIELD_PROPS.tileWidth) * FIELD_PROPS.tileWidth;
    return [diffIndex, null, minIndex];
  } else if (direction === "down") {
    const diffIndex = FIELD_PROPS.tileWidth;
    const maxIndex = FIELD_PROPS.tileWidth * FIELD_PROPS.tileHeight;
    return [diffIndex, maxIndex, null];
  } else if (direction === "up") {
    const diff = -FIELD_PROPS.tileWidth;
    const minIndex = 0;
    return [diff, null, minIndex];
  } else {
    throw new Error("cannot happen");
  }
}

export function toTileString(tiles: Array<Tile | undefined>): string {
  let string = "";
  for (let y = 0 ; y < FIELD_PROPS.tileHeight ; y ++) {
    for (let x = 0 ; x < FIELD_PROPS.tileWidth ; x ++) {
      const index = x + y * FIELD_PROPS.tileWidth;
      string += (tiles[index] !== undefined) ? "#" : " ";
    }
    string += "\n";
  }
  return string;
}