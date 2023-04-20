import moment from "moment";
import {
  IDateInfo,
  ISiknLabRsuVerificationSchedulesGroup,
} from "slices/pspControl/verificationScheduleCard/types";
import { Nullable } from "types";
import { StatusesIds } from "../../../../../enums";
import { ActionsColumn } from "./components/ActionsColumn";
import { DatesColumn } from "./components/DatesColumn";
import { MountColumn } from "./components/MountColumn";
import { ObjectsInfoColumn } from "./components/ObjectsInfoColumn";

const getUnixTimestamp = (value: Nullable<IDateInfo[]>) => {
  if (Array.isArray(value) && value.length) {
    const startDateFromFirstRange = value[0].start;
    const dateObj = moment(startDateFromFirstRange);

    if (dateObj.isValid()) {
      return dateObj.unix();
    }

    return 0;
  }

  return 0;
};

export const datesComparator = (
  valueA: Nullable<IDateInfo[]>,
  valueB: Nullable<IDateInfo[]>
) => {
  const unixTimestampA = getUnixTimestamp(valueA);
  const unixTimestampB = getUnixTimestamp(valueB);

  return unixTimestampA - unixTimestampB;
};

export const isAddCheckingObjectsButtonDisabled = (
  status: StatusesIds | undefined
) => {
  return (
    status === StatusesIds.ApprovalInSED ||
    status === StatusesIds.Signed ||
    status === StatusesIds.ErrorCreatingDocumentInSED ||
    status === StatusesIds.Deleted
  );
};

export const getTableColumns = (
  handleEditSchedule: (data: ISiknLabRsuVerificationSchedulesGroup) => void,
  openModalCreateAct: (ostRnuPspId: Nullable<string>) => void
) => {
  return [
    {
      headerName: "Объекты проверяемых организаций",
      field: "objectsInfo",
      cellRendererFramework: ObjectsInfoColumn,
    },
    {
      headerName: "Даты проведения",
      field: "dates",
      cellRendererFramework: DatesColumn,
      comparator: datesComparator,
      sortable: true,
    },
    { headerName: "Янв", field: "january", cellRendererFramework: MountColumn },
    {
      headerName: "Фев",
      field: "february",
      cellRendererFramework: MountColumn,
    },
    { headerName: "Мар", field: "march", cellRendererFramework: MountColumn },
    { headerName: "Апр", field: "april", cellRendererFramework: MountColumn },
    { headerName: "Май", field: "may", cellRendererFramework: MountColumn },
    { headerName: "Июн", field: "june", cellRendererFramework: MountColumn },
    { headerName: "Июл", field: "july", cellRendererFramework: MountColumn },
    { headerName: "Авг", field: "august", cellRendererFramework: MountColumn },
    {
      headerName: "Сен",
      field: "september",
      cellRendererFramework: MountColumn,
    },
    { headerName: "Окт", field: "october", cellRendererFramework: MountColumn },
    {
      headerName: "Ноя",
      field: "november",
      cellRendererFramework: MountColumn,
    },
    {
      headerName: "Дек",
      field: "december",
      cellRendererFramework: MountColumn,
    },
    {
      headerName: "Кол-во ОСУ",
      field: "osuCount",
    },
    {
      headerName: "Кол-во ИЛ",
      field: "ilCount",
    },
    {
      headerName: "Примечание",
      field: "note",
    },
    {
      headerName: "Действия",
      pinned: "right",
      cellRendererFramework: ActionsColumn,
      cellRendererParams: {
        handleEditSchedule,
        openModalCreateAct,
      },
      minWidth: 200
    },
  ];
};
