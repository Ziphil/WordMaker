//

import {
  Engine,
  Scene,
  SceneActivationContext
} from "excalibur";
import {
  InputSystem,
  StoriesSystem,
  TimerSystem
} from "/source/component";
import {
  Field
} from "/source/entity/main/field";
import {
  Status
} from "/source/entity/main/status";


export class MainScene extends Scene {

  public constructor() {
    super();
    this.initializeSystems();
  }

  public override onInitialize(engine: Engine): void {
  }

  public override onActivate({engine}: SceneActivationContext<unknown>): void {
    this.addEntities();
  }

  public override onDeactivate({engine}: SceneActivationContext<unknown>): void {
    this.clearEntities();
  }

  private initializeSystems(): void {
    this.world.add(new InputSystem());
    this.world.add(new StoriesSystem());
    this.world.add(new TimerSystem());
  }

  private addEntities(): void {
    const field = new Field();
    const status = new Status();
    field.status = status;
    this.add(field);
  }

  private clearEntities(): void {
    this.world.clearEntities();
  }

}