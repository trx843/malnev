import _ from "lodash";
import classNames from "classnames/bind";
import { RowSpanParams } from "ag-grid-community";
import { IIdentifiedViolationsListModel } from "slices/pspControl/actionPlanTypicalViolations/types";
import styles from "./modalForAddingViolation.module.css";

const cx = classNames.bind(styles);

export const mapViolations = (
  identifiedViolations: IIdentifiedViolationsListModel[]
) => {
  const adjustedViolations = identifiedViolations.reduce(
    (acc, identifiedViolation) => {
      const identifiedViolationValues = _.pick(identifiedViolation, [
        "areaOfResponsibility",
        "osuShortName",
        "osusShortNames",
        "classifficationNumber",
        "identifiedViolationSerial",
        "typicalViolationNumber",
        "typicalViolationId"
      ]);
      const violations = identifiedViolation.violations;
      const violationsLength = violations.length;

      const adjustedViolations = violations.map((violation, violationIndex) => {
        const violationValues = _.pick(violation, [
          "violationText",
          "pointNormativeDocuments",
          "identifiedViolationsId",
        ]);

        return {
          ...identifiedViolationValues,
          ...violationValues,
          _serial: `${identifiedViolation.identifiedViolationSerial}.${violation.serial}`,
          _violationRowSpan: violationIndex === 0 ? violationsLength : 1,
          _originalObject: identifiedViolation
        };
      });

      return [...acc, ...adjustedViolations];
    },
    []
  );

  return adjustedViolations;
};

const getRowSpan = (attrName: string) => (params: RowSpanParams) => {
  const rowSpan = params.data[attrName];
  return rowSpan;
};

const getCellClassRules = (attrName: string) => {
  return {
    [cx("row-span-cell")]: (params: any) => params.data[attrName] > 1,
  };
};

export const ViolationRowSpan = getRowSpan("_violationRowSpan");
export const ViolationCellClassRules = getCellClassRules("_violationRowSpan");
