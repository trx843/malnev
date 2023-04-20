export const SiEquipmentLimitsRoute = "/measrange";
export enum SiEquipmentLimitsElements {
    MeasEdit, //Редактирование диапазона  2 *
    MeasHistory, //История диапазона  3 *
};

export const elementId = (name: string): string => `${SiEquipmentLimitsRoute}${name}`;