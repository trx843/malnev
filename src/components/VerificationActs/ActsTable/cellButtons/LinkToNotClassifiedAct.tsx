import FormOutlined from "@ant-design/icons/lib/icons/FormOutlined";
import { Button, Tooltip } from "antd";
import { FC } from "react";
import { Link } from "react-router-dom";
import { IdType } from "types";

interface LinkToNCAProps {
    id: IdType;
    isDisabled: boolean;
}

export const LinkToNotClassifiedAct: FC<LinkToNCAProps> = ({ id, isDisabled }) => {
    return <Tooltip title="Перейти к неклассифицированному нарушению">
        {isDisabled
            ? <Button
                type="link"
                icon={<FormOutlined />}
                disabled
            />
            : <Link to={`/pspcontrol/verification-acts/${id}?section=identifiedViolationsOrRecommendations`}>
                <Button
                    type="link"
                    icon={<FormOutlined />}
                    disabled={isDisabled}
                />
            </Link>}
    </Tooltip>
};