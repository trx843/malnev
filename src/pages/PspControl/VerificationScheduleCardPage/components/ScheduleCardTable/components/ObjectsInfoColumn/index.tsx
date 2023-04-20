import React from "react";
import { ISiknLabRsuVerificationSchedulesGroup } from "slices/pspControl/verificationScheduleCard/types";
import { ITableCellRendererParams } from "../../../../../../../components/AgGridTable/types";
import "./styles.css";

export const ObjectsInfoColumn: React.FC<
  ITableCellRendererParams<ISiknLabRsuVerificationSchedulesGroup>
> = ({ data }) => {
  const objectsInfo = data.objectsInfo;
  return (
    <React.Fragment>
       {
        data.objectsInfo?.ostName && <p className="verification-schedule-card-page-objects-info-column__text">
          <span className="verification-schedule-card-page-objects-info-column__text-bold">
            ОСТ:
          </span>{" "}
          {objectsInfo?.ostName}
        </p>
      }
      <p className="verification-schedule-card-page-objects-info-column__text verification-schedule-card-page-objects-info-column__text-bold">
        {objectsInfo?.pspName}
      </p>
      <p className="verification-schedule-card-page-objects-info-column__text">
        <span className="verification-schedule-card-page-objects-info-column__text-bold">
          ОСУ:
        </span>{" "}
        {objectsInfo?.osuNamesStr}
      </p>
      <p className="verification-schedule-card-page-objects-info-column__text">
        <span className="verification-schedule-card-page-objects-info-column__text-bold">
          РСУ:
        </span>{" "}
        {objectsInfo?.rsuNamesStr}
      </p>
      <p className="verification-schedule-card-page-objects-info-column__text">
        <span className="verification-schedule-card-page-objects-info-column__text-bold">
          ИЛ:
        </span>{" "}
        {objectsInfo?.ilNamesStr}
      </p>
    </React.Fragment>
  );
};
