import React from "react";
import moment from "moment";
import { ISiknLabRsuVerificationSchedulesGroup } from "slices/pspControl/verificationScheduleCard/types";
import { ITableCellRendererParams } from "../../../../../../../components/AgGridTable/types";
import "./styles.css";

export const DatesColumn: React.FC<
  ITableCellRendererParams<ISiknLabRsuVerificationSchedulesGroup>
> = ({ data }) => {
  const dates = data.dates;

  if (!Array.isArray(dates) || !dates.length) return null;

  return (
    <React.Fragment>
      {dates.reduce((acc, date) => {
        const dateInterval = date.dateInterval;
        const isMonth = date.isMonth;
        const startDateMomentObj = moment(date.start);
        const formattedStartDate = startDateMomentObj.isValid()
          ? startDateMomentObj.format("MM.YYYY")
          : null;

        if (dateInterval) {
          return [
            ...acc,
            <p
              key={dateInterval}
              className="verification-schedule-card-page-objects-dates-column__date"
            >
              {isMonth ? formattedStartDate : dateInterval}
            </p>,
          ];
        }
        return acc;
      }, [])}
    </React.Fragment>
  );
};
