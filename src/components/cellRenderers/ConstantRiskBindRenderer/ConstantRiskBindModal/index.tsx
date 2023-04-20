import { GridApi, RowNode } from "ag-grid-community";
import { Button } from "antd";
import Modal from "antd/lib/modal";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConstantRisksThunk } from "../../../../thunks/riskSettings";
import { ObjectFields, StateType } from "../../../../types";
import { GridLoading } from "../../../GridLoading";
import { ItemsTable } from "../../../ItemsTable";
import { SiknEditorTableItem } from "../../../SiknEditor/types";
import { SiknPermanentRisk } from "./types";

interface CRBProps {
  isOpen: boolean;
  onSave: (arr: string[]) => void;
  onCancel: () => void;
  selectedSiknArr: number[];
  isLoading: boolean;
}

const returnModalFooter = (
  onCancel: () => void,
  onSave: () => void,
  isLoading: boolean
) => [
  <Button onClick={onCancel}>Отменить</Button>,
  <Button type="primary" onClick={onSave} disabled={isLoading}>
    Сохранить
  </Button>,
];

export const ConstantRiskBindModal: FC<CRBProps> = ({
  isOpen,
  onSave,
  onCancel,
  selectedSiknArr,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const constantRisks = useSelector<StateType, SiknPermanentRisk[]>(
    (state) => state.riskSettings.constantRisks
  );
  const siknArr = useSelector<StateType, SiknEditorTableItem[]>(
    (state) => state.riskSettings.siknRsusArr
  );

  const [selectedRisksIds, setSelectedRisksIds] = useState<string[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  useEffect(() => {
    (async () => {
      if (!!constantRisks.length) return;
      await dispatch(getConstantRisksThunk());
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!gridApi || selectedSiknArr.length > 1) return undefined;

    const siknRisksIds = siknArr
      .find((sikn) => sikn.id === selectedSiknArr[0])
      ?.risks.map((risk) => risk.id);

    if (!siknRisksIds) return undefined;

    const timeout = setTimeout(() => selectInitial(siknRisksIds), 230);

    return () => clearTimeout(timeout);
  }, [gridApi, selectedSiknArr]);

  const handleRowSelect = (items: SiknPermanentRisk[]) => {
    const ids = items.map((item) => item.id);
    setSelectedRisksIds(ids);
  };

  const onSaveClick = () => {
    onSave(selectedRisksIds);
  };

  const selectInitial = (selectedRisks: string[]) => {
    gridApi?.forEachNode(function (node: RowNode) {
      node.setSelected(selectedRisks.includes(node.data.id));
    });
  };

  return (
    <Modal
      visible={isOpen}
      title="Редактирование СИКН"
      onCancel={onCancel}
      footer={returnModalFooter(onCancel, onSaveClick, isLoading)}
      destroyOnClose
      maskClosable={false}
      width="680px"
    >
      {isLoading ? (
        <GridLoading />
      ) : (
        <div style={{ height: "560px" }}>
          <ItemsTable<SiknPermanentRisk>
            items={constantRisks}
            fields={new ObjectFields(SiknPermanentRisk).getFields()}
            setApiCallback={setGridApi}
            hiddenColumns={["id", "zeroGuid"]}
            rowIsMultiple={true}
            selectionCallback={(items: SiknPermanentRisk[]) =>
              handleRowSelect(items)
            }
          />
        </div>
      )}
    </Modal>
  );
};
