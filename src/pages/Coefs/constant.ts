export const CoefsRoute = "/coefs";
export enum CoefsElements {
    Export,  //Экспортировать 3*
    ViewReport, //Просмотр отчета 3*
};
 
export const elementId = (name: string): string => `${CoefsRoute}${name}`;