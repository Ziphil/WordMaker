//

import {
  Engine,
  Scene,
  SceneActivationContext
} from "excalibur";
import {
  InputManagerSystem,
  TimerSystem
} from "/source/component";


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
    this.world.add(new TimerSystem());
  }

  private addEntities(): void {
  }

  private clearEntities(): void {
    this.world.clearEntities();
  }

}