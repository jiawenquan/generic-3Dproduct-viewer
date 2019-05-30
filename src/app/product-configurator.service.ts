import {ElementRef, Injectable,} from "@angular/core";
import {Subject} from "rxjs";
import {ProductItem} from "./3D/models/ProductItem";
import {SubProductItem} from "./3D/models/SubProductItem";
import {MaterialTextureSwapEventData} from "./3D/models/EventData/MaterialTextureSwapEventData";
import {ColorKeywords} from "three/src_01/math/Euler";
import {AnimationMixer} from "three";

export enum ProductConfigurationEvent {
  Loading_Started,
  Loading_Progress,
  Loading_Finished,
  Toolbar_ChangeProduct,
  Material_TextureSwap,
  AnimationMixer_Play,
}

@Injectable({
  providedIn: "root"
})
export class ProductConfiguratorService {
  /**
   * The product items that you can choose between.
   */
  public items: ProductItem[] = [];
  public selectedProduct: ProductItem = null;
  /**
   * Sometimes we need the product container element.
   * For example to center the sub item products over the product item.
   */
  public selectedProductElementRef: ElementRef = null;

  /**
   * The RxJs Subject objects.
   */
  private readonly subjects: { [s: number]: Subject<any> };

  constructor() {
    let id = 0;
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_Samba Dancing.png",
      filename: "assets/models/fbx/Samba Dancing.fbx",
      materialInfo: {
        renderBackface: true,
        color: 0xff0202,
      },
      hasFloor: false,
      useGammaSpace: false,
      tooltip: "",
      subItems: [],
    });
    // this.items.push({
    //   id: id++,
    //   thumbnail: "assets/models/thumbnail_无人机.png",
    //   filename: "assets/models/stl/无人机装配体20170104_3Z44L4u.STL",
    //   materialInfo: {
    //     renderBackface: true,
    //     color: 0xff0202,
    //   },
    //   hasFloor: false,
    //   useGammaSpace: false,
    //   tooltip: "",
    //   subItems: [],
    // });

    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_pr2_head_pan.png",
      filename: "assets/models/stl/ascii/pr2_head_pan.stl",
      materialInfo: {
        renderBackface: true,
        color: 0x00ffff,
      },
      hasFloor: false,
      useGammaSpace: false,
      tooltip: "",
      subItems: [],
    });

    // Who needs a database!
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_pot.png",
      filename: "assets/models/flowerpot.obj",
      materialInfo: {
        mtl: "assets/models/flowerpot.mtl",
        renderBackface: true
      },
      hasFloor: false,
      useGammaSpace: false,
      tooltip: "",
      subItems: [],
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_rose.png",
      filename: "assets/models/rose.obj",
      materialInfo: {
        diffuseTexture: "assets/models/rose.png",
        normalTexture: "assets/models/rosenormal.png",
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: false,
      tooltip: "",
      subItems: [],
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_wuffels.png",
      filename: "assets/models/wuffels.obj",
      materialInfo: {
        diffuseTexture: "assets/models/wuffels.png",
        renderBackface: false,
      },
      hasFloor: true,
      useGammaSpace: false,
      tooltip: "",
      subItems: [],
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_wayfair_table.png",
      filename: "assets/models/pbr/Waifair_table.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
      tooltip: "",
      subItems: [],
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_wayfair_chair.png",
      filename: "assets/models/pbr/Waifair_chair.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
      tooltip: "",
      subItems: [],
    });


    // 创建 一个SubProductItem 集合
    // That typo... well it's fun to keep using it for this little example.
    const chearSubItems: SubProductItem[] = [];

    // 集合加入数据
    chearSubItems.push({
      id: chearSubItems.length,
      // TODO: Change this into using a thumbnail.
      // 1024x1024 image scaled to ~32x32px :D - them loading times too!
      image: "assets/models/pbr/chair_mat_baseColor.png",
      eventType: ProductConfigurationEvent.Material_TextureSwap,
      tooltip: "White chair",
    });
    // 再次加入数据
    chearSubItems.push({
      id: chearSubItems.length,
      // TODO: Change this into using a thumbnail.
      // 1024x1024 image scaled to ~32x32px :D - them loading times too!
      image: "assets/models/pbr/chair_mat_baseColor_alt.png",
      eventType: ProductConfigurationEvent.Material_TextureSwap,
      tooltip: "Blue chair",
    });

    // 创建一个 ProductItem实例
    const ikeaChearProduct: ProductItem = {
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_ikea_chair.png",
      filename: "assets/models/pbr/IKEA_chear.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
      tooltip: "",
      subItems: chearSubItems, // 赋值 chearSubItems
      // TODO: Find a way to not hard code the selected subItem Id.
      selectedSubItem: chearSubItems[0] // 赋值默认
    };

    chearSubItems[0].data = {
      productItem: ikeaChearProduct,   // 所属的ProductItem
      textureSlot: "map",              //  贴图类型
      textureUrl: "assets/models/pbr/chair_mat_baseColor.png",
    } as MaterialTextureSwapEventData;
    chearSubItems[1].data = {
      productItem: ikeaChearProduct,   // 所属的ProductItem
      textureSlot: "map",              // 贴图类型
      textureUrl: "assets/models/pbr/chair_mat_baseColor_alt.png", // 贴图类型
    } as MaterialTextureSwapEventData;

    this.items.push(ikeaChearProduct);  // 把椅子加入 items集合

    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_ikea_table.png",
      filename: "assets/models/pbr/IKEA_table.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
      tooltip: "",
      subItems: [],
    });

    this.subjects = {};

    // Create all the event subjects.
    // This gets all the numbers and filters away the string keys, since ProductConfigurationEvent.Event == 0
    // But ProductConfigurationEvent[0] = "Event"
    const eventKeys = Object.keys(ProductConfigurationEvent).filter(key => typeof ProductConfigurationEvent[key as any] !== "number");

    for (const key of eventKeys) {
      this.subjects[key] = new Subject<any>();
    }
  }

  /**
   * Get a subject corresponding to the type.
   * @param type
   */
  public getSubject(type: ProductConfigurationEvent): Subject<any> {
    return this.subjects[type];
  }

  public dispatch(type: ProductConfigurationEvent, data?: any) {
    if (!this.subjects[type]) {
      return;
    }
    this.subjects[type].next(data);
  }
}
