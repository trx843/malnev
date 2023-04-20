import { FC, useState } from "react";
import { Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { VerificationItem } from "components/VerificationActs/classes";
import { EditActModal } from "components/VerificationActs/VerificationAct/components/modals/EditActModal";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

interface InfoLinkProps {
  data: VerificationItem;
  isDisabled: boolean;
}

export const EditAct: FC<InfoLinkProps> = ({ data, isDisabled }) => {
  const { isUserAllowedOst } = useSelector<StateType, HomeStateType>(
    (state) => state.home
  );

  const isOperationDisabled = verificationLevelHandler(
    isUserAllowedOst,
    data.verificationLevelId
  );

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/*  <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.EditAct]
        )}
      > */}
      <Tooltip title="Редактировать акт">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => setModalVisible(true)}
          disabled={isDisabled || isOperationDisabled}
        />
      </Tooltip>
      {/* </Can> */}
      <EditActModal
        data={data}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};
