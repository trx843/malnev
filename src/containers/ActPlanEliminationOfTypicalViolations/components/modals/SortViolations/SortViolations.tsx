import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AgGridColumn } from "ag-grid-react";
import { Button, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import classNames from "classnames/bind";
import isEmpty from "lodash/isEmpty";

import { TypicalPlanCardFilterEntitiesDto } from "api/requests/pspControl/plan-typical-violations/dto-types";
import { AgGridTable } from "components/AgGridTable";
import { RendererProps } from "components/ItemsTable";
import { useTableDragNDrop } from "customHooks/useTableDragNDrop";
import styles from "./styles.module.css";
import { useSortViolationsValue } from "./Provider";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  items: TypicalPlanCardFilterEntitiesDto[];
  id: string;
  onClose?: () => void;
  onSave?: (
    items: TypicalPlanCardFilterEntitiesDto[],
    id: string
  ) => Promise<void>;
}

const TextAreaField = (
  field: RendererProps<TypicalPlanCardFilterEntitiesDto> & {
    values: any;
    onChange: (e, item) => void;
  }
) => {
  const { valuesRef, onChange, setValues, values }: any = useSortViolationsValue();

  useEffect(() => {
    valuesRef[field.data.id] = {
      ...valuesRef[field.data.id],
      [field.colDef.field as string]: field.value,
    };

    setValues(valuesRef)
  }, [field]);

  return (
    <TextArea
      value={values?.[field.data.id]?.[field.colDef.field as string] || ""}
      name={field.colDef.field}
      onChange={(e) => onChange?.(e, field.data)}
    />
  );
};

export const SortViolationsModals: FC<ModalProps> = ({
  visible,
  onClose,
  id,
  onSave,
  items,
}) => {
  const [pending, setPending] = useState(false);
  const { values, onClear }: any = useSortViolationsValue();
  const {
    props,
    state: { rowData, setRowData },
    events,
    gridApi,
  } = useTableDragNDrop<TypicalPlanCardFilterEntitiesDto>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, typicalViolationSerial: index + 1 })),
  });

  const handleLoadViolations = useCallback(() => {
    if (!visible) {
      return;
    }

    if (!id) {
      return;
    }
    const violation = items.filter(
      (item) => item.identifiedTypicalViolationId === id
    );

    if (isEmpty(violation) || !violation) {
      return;
    }
    setRowData(violation);
  }, [visible, items, id]);

  useEffect(() => {
    handleLoadViolations();
  }, [handleLoadViolations]);

  useEffect(() => {
    if (!visible) {
      setRowData([]);
      onClear()
    }
  }, [visible]);

  const handleOnClose = () => {
    onClose?.();
  };

  const handleSave = useCallback(async () => {
    try {
      setPending(true);

      const data = rowData.map((row) => {
        if (values[row.id]) {
          return {
            ...row,
            ...values[row.id]
          }
        }

        return row
      })

      await onSave?.(data, id);
    } finally {
      setPending(false);
      gridApi?.hideOverlay();
    }
  }, [rowData, id, values]);

  return (
    <Modal
      title="Нарушении"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      width={780}
      destroyOnClose
      footer={
        <Button
          type="primary"
          disabled={pending}
          loading={pending}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      }
    >
      <AgGridTable
        rowData={rowData}
        className={cx("table")}
        suppressRowTransform={true}
        hasLoadingOverlayComponentFramework
        defaultColDef={{
          resizable: true,
        }}
        isAutoSizeColumns={false}
        {...props}
        {...events}
      >
        <AgGridColumn headerName="№" field="typicalViolationSerial" rowDrag />
        <AgGridColumn
          headerName="Содержание нарушения"
          field="typicalViolationText"
          cellRendererFramework={TextAreaField}
        />
        <AgGridColumn
          headerName="Требование НД"
          field="pointNormativeDocuments"
          cellRendererFramework={TextAreaField}
        />
      </AgGridTable>
    </Modal>
  );
};
