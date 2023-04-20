import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ICellRendererParams } from "ag-grid-community";
import { FC } from "react";

export const ImportAttemptsHistoryCardRenderer: FC<ICellRendererParams> = (
    props: ICellRendererParams
) => {

    if (props.data.status) {
        return <CheckCircleOutlined style={{ color: "#219653" }} />;
    } else {
        return <CloseCircleOutlined style={{ color: "#FF4D4F" }} />;
    }
};