//

import {
  Actor,
  Component,
  Entity,
  System,
  SystemType,
  TransformComponent,
  Vector
} from "excalibur";
import {
  clamp,
  lerp
} from "/source/util/misc";


const ACTION_MANAGER_COMPONENT_TYPE = "zp.actionManager" as const;
const ACTION_MANAGER_SYSTEM_TYPES = ["zp.actionManager", "ex.transform"] as const;

export type ActionGenerator = Generator<unknown, void, number>;


export class ActionManagerComponent extends Component<typeof ACTION_MANAGER_COMPONENT_TYPE> {

  public readonly type: any = ACTION_MANAGER_COMPONENT_TYPE;
  public generators: Array<ActionGenerator>;

  public constructor() {
    super();
    this.generators = [];
  }

  public addAction(action: () => ActionGenerator): void {
    const generator = action();
    generator.next();
    this.generators.push(generator);
  }

}


export class ActionManagerSystem extends System<ActionManagerComponent | TransformComponent> {

  public readonly types: any = ACTION_MANAGER_SYSTEM_TYPES;
  public readonly systemType: SystemType = SystemType["Update"];

  public override update(entities: Array<Entity>, delta: number): void {
    for (const entity of entities) {
      this.performAction(entity, delta);
    }
  }

  private performAction(entity: Entity, delta: number): void {
    const component = entity.get(ActionManagerComponent)!;
    const deletedIndices = [] as Array<number>;
    for (let i = 0 ; i < component.generators.length ; i ++) {
      const generator = component.generators[i];
      const result = generator.next(delta);
      if (result.done) {
        deletedIndices.push(i);
      }
    }
    if (deletedIndices.length > 0) {
      component.generators = component.generators.filter((dummy, index) => !deletedIndices.includes(index));
    }
  }

}


export function *moveTo(entity: Actor, destPos: Vector, duration: number): ActionGenerator {
  let timer = 0;
  const initialPos = entity.pos.clone();
  while (true) {
    timer += yield;
    const ratio = clamp(timer / duration, 0, 1);
    entity.pos = lerp(initialPos, destPos, ratio);
    if (timer >= duration) {
      break;
    }
  }
}