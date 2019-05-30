import {Color, DirectionalLight, Light, PerspectiveCamera, Scene, WebGLRenderer,} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ProductConfigurationEvent, ProductConfiguratorService} from "../product-configurator.service";
import {ProductChanger} from "./ProductChanger";
import {TextureChanger} from "./TextureChanger";
import {Injectable} from "@angular/core";
import {AnimationMixer} from "three/src/animation/AnimationMixer";
import {Clock} from "three/src/core/Clock";
import {ProductItem} from "./models/ProductItem";

@Injectable({
  providedIn: "root"
})
export class ProductConfigurator {
  public productConfiguratorService: ProductConfiguratorService;

  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public cameraControls: OrbitControls;
  public clock: Clock;
  public mixer: AnimationMixer;

  public lights: Light[] = [];

  public lightIntensityFactor: number;

  private productChanger: ProductChanger;
  private textureChanger: TextureChanger;

  constructor(renderer: WebGLRenderer, productConfiguratorService: ProductConfiguratorService) {
    this.clock = new Clock();
    this.renderer = renderer;
    this.productConfiguratorService = productConfiguratorService;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new Color(0x444444));

    this.scene = new Scene();

    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(90, aspectRatio, 0.1, 10000);
    this.camera.position.z = 100;

    this.scene.add(this.camera);

    this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.cameraControls.maxPolarAngle = Math.PI;
    this.cameraControls.minPolarAngle = 0;
    this.cameraControls.enablePan = true;
    this.cameraControls.update();

    this.initLights();

    this.productChanger = new ProductChanger(this);
    this.productChanger.changeProduct(this.productConfiguratorService.items[0]);

    this.textureChanger = new TextureChanger(this.productConfiguratorService);

    this.initEvents();

    this.startRenderLoop();

    this.productConfiguratorService.getSubject(ProductConfigurationEvent.AnimationMixer_Play)
      .subscribe((animationMixer: AnimationMixer) => {
        console.log("animationMixer", animationMixer);
        this.mixer = animationMixer;

      });
  }

  public startRenderLoop() {
    const renderFunction = () => {
      this.cameraControls.update();
      const delta = this.clock.getDelta();
      if (this.mixer) {
        this.mixer.update(delta);
      }
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(renderFunction);
    };

    requestAnimationFrame(renderFunction);
  }

  public initLights() {
    // UE4 said ~285, set up 3 lights using UE4 to easier visualize direction.
    const height = 285;

    const intensity = 0.7;
    const fillIntensity = intensity / 2;
    const backIntensity = intensity / 4;

    const gammaSpaceIntensity = 0.3;
    this.lightIntensityFactor = intensity / gammaSpaceIntensity;

    const keyLight = new DirectionalLight(0xFFFFFF, intensity);
    keyLight.position.set(-247, height, 209);
    keyLight.position.normalize();
    keyLight.castShadow = true;

    const fillLight = new DirectionalLight(0xFFFFFF, fillIntensity);
    fillLight.position.set(212, height, 250);
    fillLight.position.normalize();
    fillLight.castShadow = true;

    const backLight = new DirectionalLight(0xFFFFFF, backIntensity);
    backLight.position.set(-153, height, -183);
    backLight.position.normalize();
    backLight.castShadow = true;

    this.scene.add(keyLight, fillLight, backLight);
    this.lights.push(keyLight, fillLight, backLight);
  }

  /**
   * Init events like window.resize
   */
  public initEvents() {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }
}
