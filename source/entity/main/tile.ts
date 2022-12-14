//

import {
  Engine,
  vec
} from "excalibur";
import {
  StoriesComponent,
  StoryGenerator
} from "/source/component";
import {
  SPRITE_SHEETS
} from "/source/core/asset";
import {
  DURATIONS
} from "/source/core/constant";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  FIELD_PROPS,
  Field,
  TILE_DIMENSTION,
  isEdge
} from "/source/entity/main/field";
import {
  parallel
} from "/source/util/generator";
import {
  Direction,
  calcDirectionDiff
} from "/source/util/misc";


export type TileConfigs = {
  tileX: number,
  tileY: number,
  index: number
};
export type TileState = "appear" | "normal" | "clear" | "die";


export class Tile extends FloatingActor {

  public tileX: number;
  public tileY: number;
  public index: number;
  public state: TileState;
  public moving: boolean;
  public field!: Field;

  public constructor({tileX, tileY, ...configs}: TileConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height - 7)
    });
    this.tileX = tileX;
    this.tileY = tileY;
    this.index = configs.index;
    this.state = "appear";
    this.moving = false;
    this.graphics.use(SPRITE_SHEETS.block.sprites[configs.index].clone());
    this.initializeComponents();
  }

  public override onInitialize(engine: Engine): void {
    this.appear();
  }

  public override onPreUpdate(engine: Engine): void {
    this.updateDepth();
  }

  private initializeComponents(): void {
    const actionComponent = new StoriesComponent();
    this.addComponent(actionComponent);
  }

  private appear(): void {
    this.graphics.opacity = 0;
    this.stories.addStory(() => this.storyAppear());
  }

  public clear(): void {
    this.stories.addStory(() => this.storyDisappear());
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
    const getLayerDepth = function (this: Tile): number {
      const state = this.state;
      const modificationDepth = this.pos.y / (TILE_DIMENSTION.height * FIELD_PROPS.tileHeight);
      if (state === "appear" || state === "clear") {
        return 1500 - modificationDepth;
      } else if (state === "die") {
        if (this.tileY === 0) {
          return -500 - modificationDepth;
        } else {
          return 500 - modificationDepth;
        }
      } else {
        return 1000;
      }
    };
    this.z = this.tileX + this.tileY * FIELD_PROPS.tileWidth + getLayerDepth.call(this);
  }

  private *storyAppear(): StoryGenerator {
    yield* parallel(
      this.stories.storyMoveTo(this.pos.add(vec(0, 4)), DURATIONS.appear),
      this.stories.storyFadeIn(DURATIONS.appear)
    );
    this.state = "normal";
  }

  private *storyDisappear(): StoryGenerator {
    this.state = "clear";
    yield* parallel(
      this.stories.storyMoveTo(this.pos.add(vec(0, -4)), DURATIONS.appear),
      this.stories.storyFadeOut(DURATIONS.appear),
      this.stories.storyBlink(DURATIONS.appear)
    );
    this.kill();
  }

  private *storyMove(direction: Direction): StoryGenerator {
    const [diffTileX, diffTileY] = calcDirectionDiff(direction);
    const diffX = diffTileX * TILE_DIMENSTION.width;
    const diffY = diffTileY * TILE_DIMENSTION.height;
    this.moving = true;
    yield* this.stories.storyMoveTo(this.pos.add(vec(diffX, diffY)), DURATIONS.move);
    this.moving = false;
    yield* this.storyDie();
  }

  private *storyDie(): StoryGenerator {
    if (isEdge(this.tileX, this.tileY)) {
      this.state = "die";
      this.field.addTiles();
      yield* parallel(
        this.stories.storyMoveTo(this.pos.add(vec(0, 4)), DURATIONS.appear),
        this.stories.storyFadeOut(DURATIONS.appear)
      );
      this.kill();
    }
  }

  private get stories(): StoriesComponent {
    return this.get(StoriesComponent)!;
  }

}