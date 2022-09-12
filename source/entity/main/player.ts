//

import {
  Circle,
  Color,
  Engine,
  vec
} from "excalibur";
import {
  ActionGenerator,
  ActionsComponent,
  InputComponent,
  moveTo
} from "/source/component";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  FIELD_PROPS,
  Field,
  TILE_DIMENSTION
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
  }

  public override onInitialize(engine: Engine): void {
    this.initializeComponents(engine);
  }

  public override onPreUpdate(engine: Engine, delta: number): void {
    this.move();
    this.updateDepth();
  }

  private initializeComponents(engine: Engine): void {
    const inputComponent = new InputComponent();
    const actionComponent = new ActionsComponent();
    this.addComponent(inputComponent);
    this.addComponent(actionComponent);
  }

  private move(): void {
    const actions = this.get(ActionsComponent)!;
    if (!this.moving) {
      const direction = this.determineDirection();
      if (direction !== null) {
        const [diffTileX, diffTileY] = calcDirectionDiff(direction);
        actions.addAction(() => this.actMove(direction));
        this.field.moveTiles(this.tileX, this.tileY, direction);
        this.tileX += diffTileX;
        this.tileY += diffTileY;
      }
    }
  }

  private updateDepth(): void {
    this.z = this.tileX + this.tileY * FIELD_PROPS.tileWidth;
  }

  private *actMove(direction: Direction): ActionGenerator {
    const [diffTileX, diffTileY] = calcDirectionDiff(direction);
    const diffX = diffTileX * TILE_DIMENSTION.width;
    const diffY = diffTileY * TILE_DIMENSTION.height;
    this.moving = true;
    yield* moveTo(this, this.pos.add(vec(diffX, diffY)), 140);
    this.moving = false;
  }

  private determineDirection(): Direction | null {
    const input = this.get(InputComponent)!;
    const {primaryX, primaryY} = input;
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

}