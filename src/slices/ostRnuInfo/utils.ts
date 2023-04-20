import { SqlTree } from "../../classes/SqlTree";
import { NodeTypes } from "./constants";

export const getInfoRequest = (node: SqlTree) => {
  const nodeType = node.type;
  const nodeKey = node.key;

  if (nodeType === NodeTypes.all) {
    return {
      ostPath: "",
      rnuPath: "",
    };
  }

  if (nodeType === NodeTypes.osts) {
    return {
      ostPath: nodeKey,
      rnuPath: "",
    };
  }

  if (nodeType === NodeTypes.rnus) {
    return {
      ostPath: node.parentNodeKey,
      rnuPath: nodeKey,
    };
  }

  return {
    ostPath: "",
    rnuPath: "",
  };
};
