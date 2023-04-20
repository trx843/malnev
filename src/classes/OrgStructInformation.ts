import { Nullable } from "../types";

export class OrgStructInformation {
  orgStructLinkTypes: Array<OrgStructLinkTypes>;
  orgStructModelList: Array<OrgStructModel>;
}

export class OrgStructLinkTypes {
  id: number;

  name: string;

  icon: string;

  linkType: string;
  description: string;
}
export class  OrgStructModel {
  id: number;
  key: number;
  parentId: Nullable<number>;

  SortOrder: number;

  title: string;

  treeNodeId: number;

  links: Array<OrgStructureLink>;

  children: Array<OrgStructModel>;
}

export class OrgStructureLink {
  name: string;

  serviceField: string;

  link: string;

  linkTypeId: number;

}
