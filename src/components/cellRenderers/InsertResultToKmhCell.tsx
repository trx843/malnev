import { ICellRendererParams } from "ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer";
import { Button, Tooltip } from "antd";
import React, { FC, useContext } from "react";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { ControlMaintEvents } from "../../classes/ControlMaintEvents";
import { AbilityContext, ActionsEnum } from "../../casl";
import { elementId, ToKmhElements } from "../../pages/ToKmh/constant";

interface InsertResultToKmhCellProps extends ICellRendererParams {
  data: ControlMaintEvents;
  clicked: (data: ControlMaintEvents) => void;
  flagSelector: (item: ControlMaintEvents) => boolean;
};

export const InsertResultToKmhCell: FC<InsertResultToKmhCellProps> = ({
  data, clicked, flagSelector,
}) => {
  
  const ability = useContext(AbilityContext);

  const clickHandler = () => {
    clicked(data);
  };

    let icon: JSX.Element = <></>;
    let text = "";
    if (flagSelector(data)) {
      icon = <EditOutlined />;
      text = `Данные внесены`;
    } else {
      icon = <PlusCircleFilled />;
      text = `Внести данные`;
    }
    let display = data.eventTypeResults === true ? "block" : "none";
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Tooltip title={data.resultsFromImport ? "Невозможно изменить данные импортируемые из файла" : flagSelector(data) ? "Изменить результаты" : "Внести результаты"}>
            <Button
              type={"link"}
              size={"large"}
              style={{ display: display }}
              onClick={clickHandler}
              icon={icon}
              disabled={
                ability.cannot(
                  ActionsEnum.View,
                  elementId(ToKmhElements[ToKmhElements.ControlResultsData])
                ) ||
                (data.resultsFromImport)
              }
            >
              {text}
            </Button>
          </Tooltip>
        </div>
      </div>
    );
};