import "fabric";

declare module "fabric" {
  interface FabricObject {
    customId?: string;
  }

  interface FabricImage {
    lockUniScaling?: boolean;
  }
}
