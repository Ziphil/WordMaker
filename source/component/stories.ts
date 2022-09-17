//

import {
  Color,
  Component,
  Entity,
  GraphicsComponent,
  System,
  SystemType,
  TransformComponent,
  Vector
} from "excalibur";
import {
  clamp,
  lerp
} from "/source/util/misc";


const STORIES_COMPONENT_TYPE = "zp.stories" as const;
const STORIES_SYSTEM_TYPES = ["zp.stories"] as const;

export type StoryGenerator = Generator<unknown, void, number>;


export class StoriesComponent extends Component<typeof STORIES_COMPONENT_TYPE> {

  public readonly type: any = STORIES_COMPONENT_TYPE;
  public generators: Array<StoryGenerator>;

  public constructor() {
    super();
    this.generators = [];
  }

  public addStory(story: () => StoryGenerator): void {
    const generator = story();
    generator.next();
    this.generators.push(generator);
  }

  public runAfterDelay(callback: () => unknown, duration: number): void {
    const story = function *(this: StoriesComponent): StoryGenerator {
      yield* this.storyWait(duration);
      callback();
    };
    this.addStory(story.bind(this));
  }

  public *storyWait(duration: number): StoryGenerator {
    let timer = 0;
    while (true) {
      timer += yield;
      if (timer >= duration) {
        break;
      }
    }
  }

  public *storyMoveTo(destPos: Vector, duration: number): StoryGenerator {
    const transform = this.owner?.get(TransformComponent) ?? null;
    if (transform !== null) {
      let timer = 0;
      const initialPos = transform.pos.clone();
      while (true) {
        timer += yield;
        const ratio = clamp(timer / duration, 0, 1);
        const pos = lerp(initialPos, destPos, ratio);
        transform.pos = pos;
        if (timer >= duration) {
          break;
        }
      }
    } else {
      throw new Error("entity has no TransformComponent");
    }
  }

  public *storyFadeIn(duration: number): StoryGenerator {
    const graphics = this.owner?.get(GraphicsComponent) ?? null;
    if (graphics !== null) {
      let timer = 0;
      while (true) {
        timer += yield;
        const ratio = clamp(timer / duration, 0, 1);
        const opacity = lerp(0, 1, ratio);
        graphics.opacity = opacity;
        if (timer >= duration) {
          break;
        }
      }
    } else {
      throw new Error("entity has no GraohicsComponent");
    }
  }

  public *storyFadeOut(duration: number): StoryGenerator {
    const graphics = this.owner?.get(GraphicsComponent) ?? null;
    if (graphics !== null) {
      let timer = 0;
      while (true) {
        timer += yield;
        const ratio = clamp(timer / duration, 0, 1);
        const opacity = lerp(1, 0, ratio);
        graphics.opacity = opacity;
        if (timer >= duration) {
          break;
        }
      }
    } else {
      throw new Error("entity has no GraohicsComponent");
    }
  }

  public *storyBlink(duration: number): StoryGenerator {
    const graphics = this.owner?.get(GraphicsComponent) ?? null;
    if (graphics !== null) {
      let timer = 0;
      while (true) {
        timer += yield;
        const ratio = clamp(timer / duration, 0, 1);
        const tint = Color.fromHSL(0, 0, 1, lerp(0.5, 0, ratio));
        for (const {graphic} of graphics.current) {
          graphic.tint = tint;
        }
        if (timer >= duration) {
          break;
        }
      }
    } else {
      throw new Error("entity has no GraohicsComponent");
    }
  }

}


export class StoriesSystem extends System<StoriesComponent> {

  public readonly types: any = STORIES_SYSTEM_TYPES;
  public readonly systemType: SystemType = SystemType["Update"];

  public override update(entities: Array<Entity>, delta: number): void {
    for (const entity of entities) {
      this.runStories(entity, delta);
    }
  }

  private runStories(entity: Entity, delta: number): void {
    const stories = entity.get(StoriesComponent)!;
    const deletedIndices = [] as Array<number>;
    for (let i = 0 ; i < stories.generators.length ; i ++) {
      const generator = stories.generators[i];
      const result = generator.next(delta);
      if (result.done) {
        deletedIndices.push(i);
      }
    }
    if (deletedIndices.length > 0) {
      stories.generators = stories.generators.filter((dummy, index) => !deletedIndices.includes(index));
    }
  }

}