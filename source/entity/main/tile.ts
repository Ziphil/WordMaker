//

import {
  Engine,
  vec
} from "excalibur";
import {
  StoriesComponent,
  StoryGenerator
} from "/source/component";
import {SPRITE_SHEETS} from "/source/core/asset";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  FIELD_PROPS,
  Field,
  TILE_DIMENSTION
} from "/source/entity/main/field";
import {
  parallel
} from "/source/util/generator";
import {
  Direction,
  calcDirectionDiff
} from "/source/util/misc";


export type BlockConfigs = {
  tileX: number,
  tileY: number,
  index: number
};


export class Tile extends FloatingActor {

  public tileX: number;
  public tileY: number;
  public index: number;
  public moving: boolean;
  public field!: Field;

  public constructor({tileX, tileY, ...configs}: BlockConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height)
    });
    this.tileX = tileX;
    this.tileY = tileY;
    this.index = configs.index;
    this.moving = false;
    this.graphics.use(SPRITE_SHEETS.block.sprites[configs.index]);
    this.initializeComponents();
  }

  public override onInitialize(engine: Engine): void {
  }

  public override onPreUpdate(engine: Engine): void {
    this.updateDepth();
  }

  private initializeComponents(): void {
    const actionComponent = new StoriesComponent();
    this.addComponent(actionComponent);
  }

  public move(direction: Direction): void {
    if (!this.moving) {
      const [diffTileX, diffTileY] = calcDirectionDiff(direction);
      this.stories.addStory(() => this.storyMove(direction));
      this.tileX += diffTileX;
      this.tileY += diffTileY;
    }
  }

  private updateDepth(): void {
    this.z = this.tileX + this.tileY * FIELD_PROPS.tileWidth;
  }

  private *storyMove(direction: Direction): StoryGenerator {
    const [diffTileX, diffTileY] = calcDirectionDiff(direction);
    const diffX = diffTileX * TILE_DIMENSTION.width;
    const diffY = diffTileY * TILE_DIMENSTION.height;
    this.moving = true;
    yield* this.stories.storyMoveTo(this.pos.add(vec(diffX, diffY)), 140);
    this.moving = false;
    yield* this.storyDie();
  }

  private *storyDie(): StoryGenerator {
    if (isEdge(this.tileX, this.tileY)) {
      this.field.addTile();
      yield* parallel(
        this.stories.storyMoveTo(this.pos.add(vec(0, 4)), 100),
        this.stories.storyFadeOut(100)
      );
      this.kill();
    }
  }

  private get stories(): StoriesComponent {
    return this.get(StoriesComponent)!;
  }

}


function isEdge(tileX: number, tileY: number): boolean {
  const {tileWidth, tileHeight} = FIELD_PROPS;
  return tileX % tileWidth === 0 || tileX % tileWidth === tileWidth - 1 || tileY % tileHeight === 0 || tileY % tileHeight === tileHeight - 1;
}