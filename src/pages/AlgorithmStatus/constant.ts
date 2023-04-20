export const AlgorithmStatusRoute = "/algorithm-status";
export enum AlgorithmStatusElements {
    MainConfig, //Общая конфигурация  1 *
    AlgConfig, //Конфигурация алгоритма  1 *
    AlgOperands, //Операнды алгоритма  1 *
    EditSettings, //Редактирование уставки  2 *
};
 
export const elementId = (name: string): string => `${AlgorithmStatusRoute}${name}`;