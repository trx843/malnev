import { FC } from "react";
import { AuditOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

import { AcquaintanceItem } from "api/requests/pspControl/acquaintance/types";
import { AcquaintanceModalTypes } from "../../Modals/Provider/enums";
import { useModals } from "components/ModalProvider";
import { ActionsEnum, Can } from "../../../../casl";
import { elementId, AcquaintanceElements } from "pages/PspControl/Acquaintance/constant";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

interface IProps {
  data: AcquaintanceItem;
}

export const ActionsColumn: FC<IProps> = ({ data }) => {
  const modal = useModals();
  const handleOpenAddingAcquaintanceModal = () => {
    modal.setModal({
      type: AcquaintanceModalTypes.AddingFactAcquaintanceModal,
      payload: {
        verificationPlanId: data.verificationPlanId,
        verificationActId: data.verificationActId
      }
    });
  };

  const handleOpenInfoAcquaintanceModal = () => {
    modal.setModal({
      type: AcquaintanceModalTypes.InformationAboutPersons,
      payload: {
        verificationActId: data.verificationActId
      }
    });
  };

  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(AcquaintanceElements[AcquaintanceElements.ListOfCheckedOut])}
      >
        <Tooltip title="Информация о лицах, ознакомившихся с документом">
          <Button
            onClick={handleOpenInfoAcquaintanceModal}
            icon={<FileSearchOutlined />}
            type="link"
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(AcquaintanceElements[AcquaintanceElements.AddCheckedOut])}
      >
        <Tooltip title="Добавление факта ознакомления">
          <Button
            disabled={data.acquainted !== ""}
            onClick={handleOpenAddingAcquaintanceModal}
            icon={<AuditOutlined />}
            type="link"
          />
        </Tooltip>
      </Can>
    </>
  );
};
