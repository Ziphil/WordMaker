//

import {
  Actor,
  ActorArgs,
  CollisionType,
  vec
} from "excalibur";


export class FloatingActor extends Actor {

  public constructor(configs: ActorArgs) {
    super({
      anchor: vec(0, 0),
      collisionType: CollisionType["PreventCollision"],
      ...configs
    });
  }

}