import { IdType } from "../types";
import { zeroGuid } from "../utils";

export class AfTreeNode  {
    nodeId: IdType = zeroGuid;
    title: string | JSX.Element = '';
    key: string = '';
    path: string = '';
    isLeaf: boolean;
    children: Array<AfTreeNode>;
    iconName: string = '';
    icon: JSX.Element;
    attributeType: AfObjectTypes;
    disabled: boolean;
}

export enum AfObjectTypes {
        /// <summary>
        /// Элемент дерева AF
        /// </summary>
        Element, 
        /// <summary>
        /// Аттрибут типа PiPoint
        /// </summary>
        PiPoint,
        /// <summary>
        /// Атриут свойства
        /// </summary>
        PropertyAttribute,
        /// <summary>
        /// Атрибуты из Win CC
        /// </summary>
        WinCc
}