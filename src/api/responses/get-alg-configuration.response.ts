export interface GetAlgConfigurationResponse {
  data: {
    categories: AlgConfigurationCategory[];
  };
}

export interface AlgConfigurationCategory {
  name: string;
  properties: AlgConfigurationProperty[];
}

export interface AlgConfigurationProperty {
  name: string;
  displayName: string;
  value: any;
}





export interface AlgTemplatesResponse {
  id:string;
  templateName: string;
}