import { ICellRendererParams } from "ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer";
import { Button, Tooltip } from "antd";
import React, { Component, FC, useContext } from "react";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { SiknOffItem } from "../../classes";
import { AbilityContext, ActionsEnum } from "../../casl";
import { elementId, SiknOffElements } from "../../pages/SiknOff/constants";

interface SiknOffActCellProps extends ICellRendererParams {
  data: SiknOffItem;
  clicked: (data: SiknOffItem) => void;
  flagSelector: (item: SiknOffItem) => boolean;
}

export const SiknOffActCell: FC<SiknOffActCellProps> = ({
  data,
  clicked,
  flagSelector,
  colDef,
}) => {
  const ability = useContext(AbilityContext);

  const clickHandler = () => {
    clicked(data);
  };

  const actExist = flagSelector(data);
  let icon: JSX.Element = <></>;
  let text = "";
  if (actExist) {
    icon = <EditOutlined />;
    text = `Данные внесены`; //\n12.02.2021
  } else {
    icon = <PlusCircleFilled />;
    text = `Внести данные`; //\nДо 12.02.2021
  }
  let displayInvAct = "block";
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        <Tooltip
          title={
            data.inPlanSiknOff
              ? "Невозможно изменить данные импортируемые из файла"
              : flagSelector(data)
              ? "Изменить результаты"
              : "Внести результаты"
          }
        >
          <Button
            type={"link"}
            size={"large"}
            onClick={clickHandler}
            style={{ display: displayInvAct }}
            icon={icon}
            disabled={ability.cannot(
              ActionsEnum.View,
              elementId(SiknOffElements[SiknOffElements.SIKNOffActData])
            )}
          >
            {text}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
