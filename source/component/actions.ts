//

import {
  Actor,
  Component,
  Entity,
  System,
  SystemType,
  Vector
} from "excalibur";
import {
  clamp,
  lerp
} from "/source/util/misc";


const ACTIONS_COMPONENT_TYPE = "zp.actions" as const;
const ACTIONS_SYSTEM_TYPES = ["zp.actions"] as const;

export type ActionGenerator = Generator<unknown, void, number>;


export class ActionsComponent extends Component<typeof ACTIONS_COMPONENT_TYPE> {

  public readonly type: any = ACTIONS_COMPONENT_TYPE;
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

  public *actMoveTo(destPos: Vector, duration: number): ActionGenerator {
    const entity = this.owner;
    if (entity !== null && entity instanceof Actor) {
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
    } else {
      throw new Error("entity is not an actor");
    }
  }

}


export class ActionsSystem extends System<ActionsComponent> {

  public readonly types: any = ACTIONS_SYSTEM_TYPES;
  public readonly systemType: SystemType = SystemType["Update"];

  public override update(entities: Array<Entity>, delta: number): void {
    for (const entity of entities) {
      this.runActions(entity, delta);
    }
  }

  private runActions(entity: Entity, delta: number): void {
    const actions = entity.get(ActionsComponent)!;
    const deletedIndices = [] as Array<number>;
    for (let i = 0 ; i < actions.generators.length ; i ++) {
      const generator = actions.generators[i];
      const result = generator.next(delta);
      if (result.done) {
        deletedIndices.push(i);
      }
    }
    if (deletedIndices.length > 0) {
      actions.generators = actions.generators.filter((dummy, index) => !deletedIndices.includes(index));
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