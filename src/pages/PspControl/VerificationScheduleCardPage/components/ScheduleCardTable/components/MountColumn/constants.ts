export enum LevelEnum {
  Ost = 1, // Ост
  Filial = 2, // Филиал
}

export const LevelEnumLabels = {
  [LevelEnum.Ost]: "ОСТ",
  [LevelEnum.Filial]: "Филиал ОСТ",
};

export enum TransportedProducts {
  Oil = 1, // Нефть
  OilProduct = 2, // Нефтепродукт
}

export const TransportedProductLabels = {
  [TransportedProducts.Oil]: "Нефть",
  [TransportedProducts.OilProduct]: "Нефтепродукт",
};
