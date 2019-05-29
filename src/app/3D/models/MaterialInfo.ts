import {Color} from "three";

export interface MaterialInfo {
  mtl?: string;
  normalTexture?: string;
  diffuseTexture?: string;
  renderBackface?: boolean;
  color?: Color | string | number;
}
