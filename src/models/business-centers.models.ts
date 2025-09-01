import { Adapter } from "./adapter";


export class ChildrenNode {
  id!: number;
  label!: string;
  lft!: number;
  rgt!: number;
  level!: number;
  rootId!: number;
  node_type!: string;
}

export class BusinessCenterNode {
  id!: number;
  label!: string;
  lft!: number;
  rgt!: number;
  level!: number;
  rootId!: number;
  node_type!: string;
  openItems!: any[];
  children?: ChildrenNode[];
}

export class ChildrenNodeAdapter implements Adapter<ChildrenNode> {
  adapt(item: unknown): ChildrenNode {
    if (!item || typeof item !== 'object') {
      throw new Error("Invalid child: must be an object");
    }

    const itemObj = item as any;
    const node = new ChildrenNode();

    node.id = typeof itemObj.id === 'number' ? itemObj.id : 0;
    node.label = itemObj.label || '';
    node.lft = typeof itemObj.lft === 'number' ? itemObj.lft : 0;
    node.rgt = typeof itemObj.rgt === 'number' ? itemObj.rgt : 0;
    node.level = typeof itemObj.level === 'number' ? itemObj.level : 0;
    node.rootId = typeof itemObj.rootId === 'number' ? itemObj.rootId : 0;
    node.node_type = itemObj.node_type || '';

    return node;
  }
}

export class BusinessCenterAdapter implements Adapter<BusinessCenterNode> {
  private childAdapter = new ChildrenNodeAdapter();

  adapt(item: unknown): BusinessCenterNode {
    if (!item || typeof item !== 'object') {
      throw new TypeError("Invalid input: item must be an object");
    }

    const itemObj = item as any;

    if (typeof itemObj.id !== 'number') {
      throw new TypeError("Invalid input: id must be a number");
    }

    const obj = new BusinessCenterNode();
    obj.id = itemObj.id;
    obj.label = itemObj.label || '';
    obj.lft = typeof itemObj.lft === 'number' ? itemObj.lft : 0;
    obj.rgt = typeof itemObj.rgt === 'number' ? itemObj.rgt : 0;
    obj.level = typeof itemObj.level === 'number' ? itemObj.level : 0;
    obj.rootId = typeof itemObj.rootId === 'number' ? itemObj.rootId : 0;
    obj.node_type = itemObj.node_type || '';
    obj.openItems = Array.isArray(itemObj.openItems) ? itemObj.openItems : [];

    if (Array.isArray(itemObj.children)) {
      obj.children = itemObj.children.map((child: unknown) => this.childAdapter.adapt(child));
    }

    return obj;
  }
}