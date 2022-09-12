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
import {
  calcDirectionDiff
} from "/source/util/misc";


export const TILE_DIMENSTION = {
  width: 15,
  height: 15
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
    this.addTile(1, 1);
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
    const [diffTileX, diffTileY] = calcDirectionDiff(direction);
    const updatedTiles = [] ;
    updatedTiles.push({tileX: tileX + diffTileX, tileY: tileY + diffTileY, tile: undefined});
    while (true) {
      tileX += diffTileX;
      tileY += diffTileY;
      if (!isEdge(tileX, tileY)) {
        const tile = this.getTile(tileX, tileY);
        if (tile !== undefined) {
          tile.move(direction);
          if (!isEdge(tileX + diffTileX, tileY + diffTileY)) {
            updatedTiles.push({tileX: tileX + diffTileX, tileY: tileY + diffTileY, tile});
          }
        } else {
          break;
        }
      } else {
        break;
      }
    }
    for (const {tileX, tileY, tile} of updatedTiles) {
      this.setTile(tileX, tileY, tile);
    }
    console.log(toTileString(this.tiles));
  }

  private getTile(tileX: number, tileY: number): Tile | undefined {
    const index = tileX + tileY * FIELD_PROPS.tileWidth;
    return this.tiles[index];
  }

  private setTile(tileX: number, tileY: number, tile: Tile | undefined): void {
    const index = tileX + tileY * FIELD_PROPS.tileWidth;
    this.tiles[index] = tile;
  }

}


function isEdge(tileX: number, tileY: number): boolean {
  const {tileWidth, tileHeight} = FIELD_PROPS;
  return tileX % tileWidth === 0 || tileX % tileWidth === tileWidth - 1 || tileY % tileHeight === 0 || tileY % tileHeight === tileHeight - 1;
}

function toTileString(tiles: Array<Tile | undefined>): string {
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