import { ICellRendererParams } from 'ag-grid-community';
import React, { FunctionComponent } from 'react';
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/ExclamationCircleOutlined";
import { SiknOffItem } from '../../classes';

export const AskidRenderer: FunctionComponent<ICellRendererParams> = props => {
    const item = props.data as SiknOffItem;
    return (
        <>
        
            {item.askidConfirmed == 0 &&
                <CloseCircleOutlined
                    style={{ alignContent: "center", fontSize: "20px", color: "#FF4D4F" }}
                />}
            {item.askidConfirmed == 1 &&
                <ExclamationCircleOutlined
                    style={{ alignContent: "center", fontSize: "20px", color: "#F2994A" }}
                />
            }
            {item.askidConfirmed == 2 &&
                <CheckCircleOutlined
                    style={{ alignContent: "center", fontSize: "20px", color: "#219653" }}
                />}
        </>
    )
}