//

import {
  Actor,
  ActorArgs,
  CollisionType,
  vec
} from "excalibur";
import {
  StoriesComponent
} from "/source/component";


export class FloatingActor extends Actor {

  public constructor(configs: ActorArgs) {
    super({
      anchor: vec(0, 0),
      collisionType: CollisionType["PreventCollision"],
      ...configs
    });
  }

}


export class FloatingActorWithStories extends Actor {

  public constructor(configs: ActorArgs) {
    super({
      anchor: vec(0, 0),
      collisionType: CollisionType["PreventCollision"],
      ...configs
    });
    this.addStoriesComponent();
  }

  private addStoriesComponent(): void {
    const storiesComponent = new StoriesComponent();
    this.addComponent(storiesComponent);
  }

  protected get stories(): StoriesComponent {
    return this.get(StoriesComponent)!;
  }

}