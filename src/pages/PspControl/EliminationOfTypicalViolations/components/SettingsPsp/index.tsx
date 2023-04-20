import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { useParams } from "react-router";
import { Button, Tooltip, Typography } from "antd";
import { StateType } from "../../../../../types";
import { IEliminationOfTypicalViolationsStore } from "../../../../../slices/pspControl/eliminationOfTypicalViolations/types";
import { getSettingsPspThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import { EditOutlined } from "@ant-design/icons";
import { ModalForEditingResponsiblePerson } from "../ModalForEditingResponsiblePerson";
import styles from "./settingsPsp.module.css";

const { Title } = Typography;

const cx = classNames.bind(styles);

export const SettingsPsp: React.FC = () => {
  const { pspId } = useParams<{ pspId: string }>();

  const dispatch = useDispatch();

  const { settingsPsp } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  const [
    modalForEditingResponsiblePersonVisible,
    setModalForEditingResponsiblePersonVisibility,
  ] = React.useState(false);

  const toggleModalForEditingResponsiblePersonVisibility = () =>
    setModalForEditingResponsiblePersonVisibility(
      !modalForEditingResponsiblePersonVisible
    );

  React.useEffect(() => {
    dispatch(getSettingsPspThunk(pspId));
  }, [pspId]);

  return (
    <div className={cx("container")}>
      <Title level={4}>Общая информация о ПСП</Title>

      <p className={cx("title")}>Наименование ОСТ</p>
      <p>{settingsPsp?.ostName || "Н/д"}</p>
      <p className={cx("title")}>Наименование РНУ/филиал</p>
      <p>{settingsPsp?.rnuName || "Н/д"}</p>
      <p className={cx("title")}>Наименование ПСП</p>
      <p>{settingsPsp?.pspFullName || "Н/д"}</p>
      <p className={cx("title")}>Назначение ПСП</p>
      <p>{settingsPsp?.pspPurpose || "Н/д"}</p>
      <p className={cx("title")}>Владелец ПСП</p>
      <p>{settingsPsp?.pspOwner || "Н/д"}</p>
      <p className={cx("title")}>Собственный/сторонний</p>
      <p>{settingsPsp?.pspOwned || "Н/д"}</p>
      <p className={cx("title")}>Принадлежность</p>
      <p>{settingsPsp?.pspAffiliation || "Н/д"}</p>
      <div className={cx("fio-wrapper")}>
        <div>
          <p className={cx("title")}>Ответственный за проверку</p>
          <p>
            {settingsPsp?.fullName && settingsPsp?.jobTitle
              ? `${settingsPsp.fullName}/${settingsPsp.jobTitle}`
              : "Н/д"}
          </p>
        </div>
        <Tooltip title="Редактировать">
          <Button
            onClick={toggleModalForEditingResponsiblePersonVisibility}
            icon={<EditOutlined />}
            type="link"
          />
        </Tooltip>
      </div>

      <ModalForEditingResponsiblePerson
        isVisible={modalForEditingResponsiblePersonVisible}
        onCancel={toggleModalForEditingResponsiblePersonVisibility}
      />
    </div>
  );
};
