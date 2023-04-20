import React, { FC, useState } from "react";

import { Col, Collapse, Modal, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setOpenedModalId } from "../../../slices/algorithmStatus/algorithms";
import { StateType } from "../../../types";
import { AlgTemplatesResponse } from "../../../api/responses/get-alg-configuration.response";
import { SearchTree } from "../../SearchTree";
import { getOperandTree } from "../../../api/requests/algStatuses";
import { SqlTree } from "../../../classes/SqlTree";
import { returnCheckedKeys } from "../utils";

interface IProps {
  isOpen: boolean;
}

export const OperandModal: FC<IProps> = ({ isOpen }) => {
  const dispatch = useDispatch();

  const algId = useSelector<StateType, string>(
    (state) => state.algorithms.selectedAlgorithmId
  );

  const templates = useSelector<StateType, AlgTemplatesResponse[] | undefined>(
    (state) => state.algorithms.templates
  );

  const [customTreeDate, setCustomTreeData] = useState<SqlTree[]>([]);
  const [templateValue, setTemplateValue] = useState<string>("");
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const onCancel = () => {
    setCustomTreeData([]);
    setTemplateValue("");
    dispatch(setOpenedModalId(""));
  };

  const onSelect = async (value: string) => {
    const treeData = await getOperandTree(algId, value);

    const checkedKeys = returnCheckedKeys(treeData);
    setCheckedKeys(checkedKeys);
    setTemplateValue(value);
    setCustomTreeData(treeData);
  };
  return (
    <Modal
      title="Операнды"
      footer=""
      destroyOnClose
      visible={isOpen}
      onCancel={onCancel}
      width={"738px"}
    >
      <Row>
        <Col>Выберите шаблон:</Col>
      </Row>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Select
            placeholder={"Выберите шаблон"}
            style={{ width: "100%" }}
            value={templateValue}
            onChange={onSelect}
            notFoundContent="Нет шаблонов"
            options={templates?.map((x) => ({
              label: x.templateName,
              value: x.id,
              key: x.id,
            }))}
          />
        </Col>
      </Row>

      {templateValue ? (
        <Row>
          <Col span={24}>
            <SearchTree
              isSiEq={false}
              treeViewName={"MssEventTypeTree"}
              onSelectCallback={() => {}}
              ownFilterValue={null}
              currentNodeKey={""}
              withoutFilters
              checkable
              checkedKeys={checkedKeys}
              customTreeData={customTreeDate}
            />
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </Modal>
  );
};
