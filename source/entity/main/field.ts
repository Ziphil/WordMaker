//

import {
  Color,
  Engine
} from "excalibur";
import {
  StoriesComponent
} from "/source/component";
import {
  DURATIONS
} from "/source/core/constant";
import DATA from "/source/data/data.json";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  Player
} from "/source/entity/main/player";
import {
  Tile
} from "/source/entity/main/tile";
import {
  Direction,
  calcDirectionDiff
} from "/source/util/misc";
import {
  convertCharToIndex,
  convertIndexToChar,
  searchString
} from "/source/util/word";


export const TILE_DIMENSTION = {
  width: 21,
  height: 21
};
export const FIELD_PROPS = {
  tileWidth: 15,
  tileHeight: 15
};

export type TilePoss = Array<[number, number]>;
export type SearchResults = Array<[name: string, tilePoss: Array<[number, number]>]>;


export class Field extends FloatingActor {

  private readonly tiles: Array<Tile | undefined>;
  private player!: Player;

  public constructor() {
    super({
      width: FIELD_PROPS.tileWidth * TILE_DIMENSTION.width,
      height: FIELD_PROPS.tileHeight * TILE_DIMENSTION.height,
      color: Color.fromHex("#00000022")
    });
    this.tiles = Array.from({length: FIELD_PROPS.tileWidth * FIELD_PROPS.tileHeight});
    this.initializeComponents();
  }

  public override onInitialize(engine: Engine): void {
    this.addPlayer();
    this.addTiles(30);
  }

  private initializeComponents(): void {
    const actionComponent = new StoriesComponent();
    this.addComponent(actionComponent);
  }

  public addTiles(count?: number): void {
    count ??= 1;
    for (let i = 0 ; i < count ; i ++) {
      const [tileX, tileY] = this.getRandomEmptyTilePos();
      const index = tileX + tileY * FIELD_PROPS.tileWidth;
      if (this.tiles[index] === undefined) {
        const tile = new Tile({tileX, tileY, index: this.getRandomIndex()});
        tile.field = this;
        this.tiles[index] = tile;
        this.addChild(tile);
      } else {
        throw new Error(`tile already exists at (${tileX}, ${tileY})`);
      }
    }
    this.stories.runAfterDelay(() => {
      this.disappearMatchedTiles();
    }, DURATIONS.appear);
  }

  private addPlayer(): void {
    const player = new Player({tileX: 8, tileY: 8});
    player.field = this;
    this.player = player;
    this.addChild(player);
  }

  public moveTiles(tileX: number, tileY: number, direction: Direction): void {
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
    this.stories.runAfterDelay(() => {
      this.disappearMatchedTiles();
    }, DURATIONS.move);
  }

  private disappearMatchedTiles(): void {
    const results = this.searchWords();
    let disappearCount = 0;
    for (const [name, tilePoss] of results) {
      for (const [tileX, tileY] of tilePoss) {
        const tile = this.getTile(tileX, tileY);
        if (tile !== undefined) {
          this.setTile(tileX, tileY, undefined);
          disappearCount ++;
          tile.disappear();
        }
      }
    }
    if (disappearCount > 0) {
      this.addTiles(disappearCount);
    }
  }

  private searchWords(): SearchResults {
    const results = [];
    for (let tileX = 0 ; tileX < FIELD_PROPS.tileWidth ; tileX ++) {
      for (let tileY = 0 ; tileY < FIELD_PROPS.tileHeight ; tileY ++) {
        const rightResults = this.searchWordsAt(tileX, tileY, "right");
        const downResults = this.searchWordsAt(tileX, tileY, "down");
        results.push(...rightResults);
        results.push(...downResults);
      }
    }
    return results;
  }

  private searchWordsAt(tileX: number, tileY: number, direction: "right" | "down"): SearchResults {
    const [diffTileX, diffTileY] = calcDirectionDiff(direction);
    let currentName = "";
    const results = [] as SearchResults;
    const currentTilePoss = [] as TilePoss;
    while (true) {
      const tile = this.getTile(tileX, tileY);
      if (tile !== undefined) {
        currentName += convertIndexToChar(tile.index);
        currentTilePoss.push([tileX, tileY]);
        if (currentName.length >= 3 && searchString(DATA.names, currentName)) {
          results.push([currentName, [...currentTilePoss]]);
        }
      } else {
        break;
      }
      tileX += diffTileX;
      tileY += diffTileY;
    }
    return results;
  }

  private getRandomIndex(): number {
    const random = Math.random();
    let accumRate = 0;
    for (const [char, rate] of Object.entries(DATA.rates)) {
      accumRate += rate;
      if (random < accumRate) {
        return convertCharToIndex(char);
      }
    }
    return 0;
  }

  private getRandomEmptyTilePos(): [number, number] {
    const modifiedTiles = this.tiles.map((tile, index) => {
      const tileX = index % FIELD_PROPS.tileWidth;
      const tileY = Math.floor(index / FIELD_PROPS.tileWidth);
      return {tile, tileX, tileY};
    });
    const emptyTiles = modifiedTiles.filter(({tile, tileX, tileY}) => {
      const onPlayer = this.player.tileX === tileX && this.player.tileY === tileY;
      const onOtherTile = tile !== undefined;
      const onEdge = isEdge(tileX, tileY);
      return !onPlayer && !onOtherTile && !onEdge;
    });
    const emptyIndex = Math.floor(Math.random() * emptyTiles.length);
    const {tileX, tileY} = emptyTiles[emptyIndex];
    return [tileX, tileY];
  }

  private getTile(tileX: number, tileY: number): Tile | undefined {
    const index = tileX + tileY * FIELD_PROPS.tileWidth;
    return this.tiles[index];
  }

  private setTile(tileX: number, tileY: number, tile: Tile | undefined): void {
    const index = tileX + tileY * FIELD_PROPS.tileWidth;
    this.tiles[index] = tile;
  }

  private get stories(): StoriesComponent {
    return this.get(StoriesComponent)!;
  }

}


export function isEdge(tileX: number, tileY: number): boolean {
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