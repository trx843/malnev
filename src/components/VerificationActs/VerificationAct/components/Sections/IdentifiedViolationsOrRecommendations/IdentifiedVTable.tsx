import { FC, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";
import classNames from "classnames/bind";
import { GridReadyEvent } from "ag-grid-community";
import { Tooltip, Typography } from "antd";

import { IdType, StateType } from "types";
import { IdentifiedVItem } from "../../../classes";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import {
  getVerificationActPageThunk,
  getViolationsThunk,
  removeVerificationIdentifiedItemThunk,
} from "thunks/verificationActs/verificationAct";
import { TableActions } from "./TableActions";
import { FullWidthCell } from "./FullWidthCell";
import styles from "./violation.module.css";
import { CheckBoxCell } from "components/cellRenderers/CheckBoxCell";
import { AgGridTable } from "components/AgGridTable";

import { RendererProps } from "components/ItemsTable";
import { getGroupedTableViolations, siknLabRsuTooltipValueGetter, siknLabRsuValueGetter } from "./helpers";

const cx = classNames.bind(styles);

const getRowSpan = (params: any) => {
  return params.data.isRow ? params.data.violations.length : 1;
};

export const IdentifiedVTable: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;
  const identifiedViolationsOrRecommendations =
    state.identifiedViolationsOrRecommendations;

  const handleDelete = async (
    id: IdType,
    siknLabRsuId: string,
    area: string
  ) => {
    if (actId) {
      await dispatch(
        removeVerificationIdentifiedItemThunk({
          actId,
          id: id as string,
          siknLabRsuId,
          area,
        })
      );
      await dispatch(getViolationsThunk({ actId }));

      await dispatch(getVerificationActPageThunk(actId));
    }
  };


  const normalize = useMemo((): IdentifiedVItem[] => {
    if (!actId) {
      return [];
    }

    const updated = getGroupedTableViolations({
      violations: identifiedViolationsOrRecommendations,
    });

    return updated as IdentifiedVItem[];
  }, [actId, identifiedViolationsOrRecommendations]);

  return (
    <>
      <AgGridTable
        className={cx("table")}
        rowData={normalize}
        fullWidthCellRendererFramework={FullWidthCell}
        isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
        suppressRowTransform={true}
        defaultColDef={{ resizable: true }}
        stateStorageKey="verification-act-identified-violations-or-recommendations"
        isAutoSizeColumns={false}
      >
        <AgGridColumn
          headerName="№ пп"
          field="serialMain"
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={91}
          tooltipField="serialMain"
        />
        <AgGridColumn
          headerName="№ подпункта"
          field="serial"
          minWidth={110}
          tooltipField="serial"
          headerTooltip="№ подпункта"
        />
        <AgGridColumn
          headerName="Выявленное нарушение"
          field="violationText"
          minWidth={298}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="Пункт НД и/или ОРД"
          field="pointNormativeDocuments"
          minWidth={151}
          tooltipField="pointNormativeDocuments"
          headerTooltip="Пункт НД и/или ОРД"
        />

        <AgGridColumn
          headerName="Система учета/ИЛ"
          field="siknLabRsu"
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          valueGetter={siknLabRsuValueGetter}
          minWidth={312}
          tooltipValueGetter={siknLabRsuTooltipValueGetter}
        />
        <AgGridColumn
          headerName="Номер по классификации"
          field="classifficationTypeSerial"
          rowSpan={getRowSpan}
          minWidth={120}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          tooltipField="classifficationTypeSerial"
          headerTooltip="Номер по классификации"
        />
        <AgGridColumn
          headerName="Повторяющееся"
          field="isDuplicate"
          cellRendererFramework={(props: any) => (
            <CheckBoxCell value={props.value} />
          )}
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={165}
        />
        <AgGridColumn
          headerName="Номер типового нарушения"
          field="typicalViolationNumber"
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={115}
          tooltipField="typicalViolationNumber"
          headerTooltip="Номер типового нарушения"
        />
        <AgGridColumn
          headerName="Источник замечания"
          field="sourceRemark"
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={200}
          tooltipField="sourceRemark"
        />
        <AgGridColumn
          headerName="Особое мнение"
          headerTooltip="Особое мнение"
          field="specialOpinion"
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={400}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="Действия"
          pinned="right"
          maxWidth={380}
          width={200}
          minWidth={200}
          cellRendererFramework={(props: any) => (
            <TableActions {...props} onDelete={handleDelete} />
          )}
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
        />
      </AgGridTable>
    </>
  );
};
