//

import {
  DevTool
} from "@excaliburjs/dev-tools";
import {
  Color,
  DisplayMode,
  Engine,
  Input
} from "excalibur";
import {
  ASSETS
} from "/source/core/asset";
import {
  SCREEN_DIMENSION
} from "/source/core/constant";
import {
  CustomLoader
} from "/source/core/loader";
import {
  MainScene
} from "/source/scene/main-scene";
import {
  downloadImage
} from "/source/util/image";


export class CustomEngine extends Engine {

  public constructor() {
    super({
      resolution: {width: SCREEN_DIMENSION.width, height: SCREEN_DIMENSION.height},
      viewport: {width: SCREEN_DIMENSION.width * 2, height: SCREEN_DIMENSION.height * 2},
      displayMode: DisplayMode["Fixed"],
      canvasElementId: "screen",
      backgroundColor: Color.fromHSL(0, 0, 0.5),
      antialiasing: false,
      snapToPixel: true,
      suppressHiDPIScaling: true
    });
    this.input.gamepads.enabled = true;
    this.setupScenes();
    this.setupScreenshot();
    this.setupDevTool();
  }

  private setupScenes(): void {
    this.add("main", new MainScene());
  }

  private setupScreenshot(): void {
    this.input.keyboard.on("press", (event) => {
      if (event.key === Input["Keys"]["P"]) {
        this.screenshot().then((imageElement) => downloadImage(imageElement, "aldiresh.png"));
      }
    });
  }

  private setupDevTool(): void {
    if (document.location.hash === "#debug") {
      const devtool = new DevTool(this);
    }
  }

  public async run(): Promise<void> {
    const loader = new CustomLoader(Object.values(ASSETS));
    await this.start(loader);
    this.goToScene("main");
  }

}