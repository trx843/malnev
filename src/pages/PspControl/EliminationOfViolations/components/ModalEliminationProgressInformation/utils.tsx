import { dateValueFormatter as defaultDateValueFormatter } from "../../../../../utils";
import { EliminationAttachmentModel } from "../../../../../slices/pspControl/eliminationOfViolations/types";
import { AttachmentColumn } from "./components/AttachmentColumn";
import classNames from "classnames/bind";
import styles from "./modalEliminationProgressInformation.module.css";

const cx = classNames.bind(styles);

export const dateValueFormatter = defaultDateValueFormatter(
  "YYYY-MM-DD HH:mm:ss"
);

export const getTableColumns = (
  handleOpenEliminationAttachments: (
    attachments: EliminationAttachmentModel[]
  ) => void
) => {
  return [
    {
      headerName: "Дата и время",
      field: "dateAdd",
      valueFormatter: dateValueFormatter,
      minWidth: 179,
    },
    {
      headerName: "Автор",
      field: "author",
      minWidth: 232,
      tooltipField: "author",
    },
    {
      headerName: "Операции",
      field: "operation",
      minWidth: 200,
    },
    {
      headerName: "Комментарий",
      field: "comment",
      minWidth: 264,
      cellClass: cx("action-text-wrapper"),
      cellRendererFramework: (props) => <div className={cx("action-text")}>{props.value}</div>
    },
    {
      headerName: "Вложения",
      field: "eliminationAttachment",
      pinned: "right",
      minWidth: 120,
      cellRendererFramework: AttachmentColumn,
      cellRendererParams: { handleOpenEliminationAttachments },
    },
  ];
};
