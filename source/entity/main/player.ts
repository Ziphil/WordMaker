//

import {
  Circle,
  Color,
  Engine,
  vec
} from "excalibur";
import {
  InputComponent,
  StoriesComponent,
  StoryGenerator
} from "/source/component";
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
  Direction,
  calcDirectionDiff
} from "/source/util/misc";


export type PlayerConfigs = {
  tileX: number,
  tileY: number
};


export class Player extends FloatingActor {

  public tileX: number;
  public tileY: number;
  private moving: boolean;
  public field!: Field;

  public constructor({tileX, tileY, ...configs}: PlayerConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height)
    });
    this.tileX = tileX;
    this.tileY = tileY;
    this.moving = false;
    this.graphics.use(new Circle({radius: 8, color: Color.fromHex("#000000")}));
    this.initializeComponents();
  }

  public override onInitialize(engine: Engine): void {
  }

  public override onPreUpdate(engine: Engine, delta: number): void {
    this.move();
    this.updateDepth();
  }

  private initializeComponents(): void {
    const inputComponrnt = new InputComponent();
    const storiesComponent = new StoriesComponent();
    this.addComponent(inputComponrnt);
    this.addComponent(storiesComponent);
  }

  private move(): void {
    if (!this.moving) {
      const direction = this.determineDirection();
      if (direction !== null) {
        const [diffTileX, diffTileY] = calcDirectionDiff(direction);
        if (!isEdge(this.tileX + diffTileX, this.tileY + diffTileY)) {
          this.stories.addStory(() => this.storyMove(direction));
          this.field.moveTiles(this.tileX, this.tileY, direction);
          this.tileX += diffTileX;
          this.tileY += diffTileY;
        }
      }
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
    yield* this.stories.storyMoveTo(this.pos.add(vec(diffX, diffY)), DURATIONS.move);
    this.moving = false;
  }

  private determineDirection(): Direction | null {
    const {primaryX, primaryY} = this.input;
    if (primaryX >= 0.75) {
      return "right";
    } else if (primaryX <= -0.75) {
      return "left";
    } else if (primaryY >= 0.75) {
      return "down";
    } else if (primaryY <= -0.75) {
      return "up";
    } else {
      return null;
    }
  }

  private get input(): InputComponent {
    return this.get(InputComponent)!;
  }

  private get stories(): StoriesComponent {
    return this.get(StoriesComponent)!;
  }

}