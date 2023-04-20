import React, { FC } from "react";
import { Button } from "antd";

type PropsType = {
    buttonHandler?: () => void;
    isDisabled?: boolean;
    icon?: any;
    title: string;
    type: "text" | "default" | "primary" | "link";
    htmlType?: "button" | "submit";
    danger?: boolean;
    isButtonLoading?: boolean;
    background?: string;
    color?: string;
};

export const UniButton: FC<PropsType> = React.memo(({ buttonHandler, isDisabled, icon,
    title, type, danger, isButtonLoading, htmlType, background, color }) => {

    return <Button
        htmlType={htmlType}
        type={type}
        onClick={buttonHandler}
        style={{ minWidth: "40px", backgroundColor: background, color: color }}
        disabled={isDisabled}
        icon={icon}
        danger={danger}
        loading={isButtonLoading}
    >
        {title}
    </Button>
});