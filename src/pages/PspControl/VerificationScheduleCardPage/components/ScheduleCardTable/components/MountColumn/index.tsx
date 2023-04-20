import React from "react";
import { Tooltip } from "antd";
import { FilialIcon } from "../../../../../../../images/FilialIcon";
import { OilIcon } from "../../../../../../../images/OilIcon";
import { OilProductIcon } from "../../../../../../../images/OilProductIcon";
import { OstIcon } from "../../../../../../../images/OstIcon";
import { ITableCellRendererParams } from "../../../../../../../components/AgGridTable/types";
import {
  ISiknLabRsuVerificationSchedulesGroup,
  Month,
} from "slices/pspControl/verificationScheduleCard/types";
import { IIcons } from "./types";
import {
  LevelEnum,
  LevelEnumLabels,
  TransportedProductLabels,
  TransportedProducts,
} from "./constants";

const TransportedProductIcons: IIcons = {
  [TransportedProducts.Oil]: <OilIcon />,
  [TransportedProducts.OilProduct]: <OilProductIcon />,
};

const LevelIcons: IIcons = {
  [LevelEnum.Ost]: <OstIcon />,
  [LevelEnum.Filial]: <FilialIcon />,
};

export const MountColumn: React.FC<
  ITableCellRendererParams<ISiknLabRsuVerificationSchedulesGroup>
> = ({ colDef, data }) => {
  const fieldName = colDef?.field as Month;

  if (!fieldName) return null;

  const month = data[fieldName];

  if (!month) return null;

  const transportedProduct = month.transportedProduct;
  const levels = month.levels ?? [];

  return (
    <React.Fragment>
      {!!transportedProduct && (
        <Tooltip title={TransportedProductLabels[transportedProduct]}>
          <div>{TransportedProductIcons[transportedProduct]}</div>
        </Tooltip>
      )}
      {Array.isArray(levels) &&
        levels.reduce((acc, level) => {
          const levelEnum = level.levelEnum;
          if (levelEnum) {
            const icon = (
              <Tooltip title={LevelEnumLabels[levelEnum]}>
                <div>{LevelIcons[levelEnum]}</div>
              </Tooltip>
            );

            return [...acc, icon];
          }

          return acc;
        }, [])}
    </React.Fragment>
  );
};
