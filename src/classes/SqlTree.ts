import { SelectedNode } from "../interfaces";
import { IdType, NodeType, Nullable } from "../types";
import { zeroGuid } from "../utils";

export class SqlTree implements SelectedNode {
    id: IdType = zeroGuid;
    nodeId: number = 0;
    title: string = '';
    key: string = '';
    type: NodeType;
    owned: Nullable<boolean>;
    children: Array<SqlTree>;
    isSiType: boolean;
    disabled: boolean;
    enabled: boolean;
    parentNodeKey: string = '';
    isLeaf: boolean;
}