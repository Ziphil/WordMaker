//

import {
  Circle,
  Color,
  Engine,
  vec
} from "excalibur";
import {
  InputManagerComponent
} from "/source/component";
import {
  ActionManagerComponent,
  moveTo
} from "/source/component/action-manager";
import {
  FloatingActor
} from "/source/entity/floating-actor";
import {
  TILE_DIMENSTION
} from "/source/entity/main/field";
import {
  calcVectorFromDirection
} from "/source/util/misc";


export type PlayerConfigs = {
  tileX: number,
  tileY: number
};


export class Player extends FloatingActor {

  private moving: boolean;

  public constructor({tileX, tileY, ...configs}: PlayerConfigs) {
    super({
      pos: vec(tileX * TILE_DIMENSTION.width, tileY * TILE_DIMENSTION.height)
    });
    this.moving = false;
    this.graphics.use(new Circle({radius: 8, color: Color.fromHex("#000000")}));
  }

  public override onInitialize(engine: Engine): void {
    this.initializeComponents(engine);
  }

  public override onPreUpdate(engine: Engine, delta: number): void {
    this.move();
  }

  private initializeComponents(engine: Engine): void {
    const inputComponent = new InputManagerComponent();
    const actionComponent = new ActionManagerComponent();
    this.addComponent(inputComponent);
    this.addComponent(actionComponent);
  }

  private move(): void {
    const actionManager = this.get(ActionManagerComponent)!;
    if (!this.moving) {
      const direction = this.determineDirection();
      if (direction !== null) {
        const diffVector = calcVectorFromDirection(direction).scale(vec(TILE_DIMENSTION.width, TILE_DIMENSTION.height));
        const action = function *(this: Player): Generator<unknown, void, number> {
          this.moving = true;
          yield* moveTo(this, this.pos.add(diffVector), 150);
          this.moving = false;
        };
        actionManager.addAction(action.bind(this));
      }
    }
  }

  private determineDirection(): "right" | "left" | "down" | "up" | null {
    const inputManager = this.get(InputManagerComponent)!;
    const {primaryX, primaryY} = inputManager;
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