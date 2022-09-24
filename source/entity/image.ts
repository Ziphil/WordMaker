//

import {
  Actor,
  ActorArgs,
  CollisionType,
  Graphic,
  vec
} from "excalibur";


export class Image extends Actor {

  public constructor(configs: ActorArgs & {graphic: Graphic}) {
    super({
      anchor: vec(0, 0),
      collisionType: CollisionType["PreventCollision"],
      ...configs
    });
    this.graphics.use(configs.graphic);
  }

}