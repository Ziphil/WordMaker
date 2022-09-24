//

import {
  Color,
  Engine,
  ExcaliburGraphicsContext,
  vec
} from "excalibur";
import {
  StoryGenerator
} from "/source/component";
import {
  SPRITE_SHEETS
} from "/source/core/asset";
import {
  SCREEN_DIMENSION
} from "/source/core/constant";
import {
  FloatingActorWithStories
} from "/source/entity/floating-actor";
import {
  parallel
} from "/source/util/generator";
import {
  lerp
} from "/source/util/misc";


export class ReadyPane extends FloatingActorWithStories {

  private label!: ReadyLabel;
  private background!: ReadyLabelBackground;

  public constructor({x, y}: {x: number, y: number}) {
    super({
      pos: vec(x, y),
      anchor: vec(0.5, 0.5),
      z: 2001
    });
  }

  public override onInitialize(engine: Engine): void {
    this.addChildren();
  }

  private addChildren(): void {
    const label = new ReadyLabel();
    const background = new ReadyLabelBackground();
    this.label = label;
    this.background = background;
    this.addChild(label);
    this.addChild(background);
  }

  public changeLabelToGo(): void {
    this.label.graphics.use("go");
  }

  public *storyAppear(): StoryGenerator {
    yield* parallel(
      this.label.storyAppear(),
      this.background.storyAppear()
    );
  }

  public *storyDisappear(): StoryGenerator {
    yield* parallel(
      this.label.storyDisappear(),
      this.background.storyDisappear()
    );
  }

}


export class ReadyLabel extends FloatingActorWithStories {

  public constructor() {
    super({
      pos: vec(0, 0),
      anchor: vec(0.5, 0.5),
      z: 2001
    });
  }

  public override onInitialize(engine: Engine): void {
    this.initializeGraphics();
  }

  private initializeGraphics(): void {
    this.graphics.add("ready", SPRITE_SHEETS.ready.sprites[0]);
    this.graphics.add("go", SPRITE_SHEETS.ready.sprites[1]);
    this.graphics.use("ready");
    this.graphics.opacity = 0;
  }

  public *storyAppear(): StoryGenerator {
    yield* this.stories.storyFadeIn(300);
  }

  public *storyDisappear(): StoryGenerator {
    yield* this.stories.storyFadeOut(100);
  }

}


export class ReadyLabelBackground extends FloatingActorWithStories {

  private rectangleHeight: number;
  private rectangleOpacity: number;

  public constructor() {
    super({
      pos: vec(0, 0),
      anchor: vec(0.5, 0.5),
      width: SCREEN_DIMENSION.width + 2,
      height: 60,
      z: 2000
    });
    this.rectangleHeight = 0;
    this.rectangleOpacity = 1;
  }

  public override onInitialize(engine: Engine): void {
    this.initializeGraphics();
  }

  private initializeGraphics(): void {
    const onPreDraw = function (this: ReadyLabelBackground, context: ExcaliburGraphicsContext): void {
      context.save();
      context.opacity = this.rectangleOpacity;
      context.drawRectangle(vec(-this.width / 2, -this.rectangleHeight / 2), this.width, this.rectangleHeight, Color.fromHSL(0, 0, 0.95, 0.7));
      context.restore();
    };
    this.graphics.onPreDraw = onPreDraw.bind(this);
  }

  public *storyAppear(): StoryGenerator {
    yield* this.stories.storyWithRatio((ratio) => {
      const rectangleHeight = lerp(0, 70, ratio);
      this.rectangleHeight = rectangleHeight;
    }, 300);
  }

  public *storyDisappear(): StoryGenerator {
    yield* this.stories.storyWithRatio((ratio) => {
      const rectangleOpacity = lerp(1, 0, ratio);
      this.rectangleOpacity = rectangleOpacity;
    }, 100);
  }

}