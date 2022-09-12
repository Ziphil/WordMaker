//

import {
  Engine,
  Scene,
  SceneActivationContext
} from "excalibur";
import {
  ActionManagerSystem,
  InputManagerSystem,
  TimerSystem
} from "/source/component";
import {
  Field
} from "/source/entity/main/field";
import {
  Player
} from "/source/entity/main/player";


export class MainScene extends Scene {

  public constructor() {
    super();
  }

  public override onInitialize(engine: Engine): void {
    this.initializeSystems();
  }

  public override onActivate({engine}: SceneActivationContext<unknown>): void {
    this.addEntities();
  }

  public override onDeactivate({engine}: SceneActivationContext<unknown>): void {
    this.clearEntities();
  }

  private initializeSystems(): void {
    this.world.add(new InputManagerSystem());
    this.world.add(new ActionManagerSystem());
    this.world.add(new TimerSystem());
  }

  private addEntities(): void {
    const player = new Player({tileX: 8, tileY: 8});
    const field = new Field();
    player.field = field;
    this.add(player);
    this.add(field);
  }

  private clearEntities(): void {
    this.world.clearEntities();
  }

}