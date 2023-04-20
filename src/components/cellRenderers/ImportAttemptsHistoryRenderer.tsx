import { FC } from "react";
import { ICellRendererParams } from "ag-grid-community";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Row, Tooltip } from "antd";
import { EditTableButtonIconStyled } from "../../pages/ImportAttemptsHistory/styled";
import { Link } from "react-router-dom";
import { importAttemptsHistory, importAttemptsHistoryActions } from "slices/importAttemptsHistory";

export const ImportAttemptsHistoryRenderer: FC<ICellRendererParams> = (
    props: ICellRendererParams
) => {
    const dispatch = useDispatch();
    const importAttemptsHistoryState = useSelector(importAttemptsHistory);

    return (
        <Row>
            <Col>
                <Tooltip title="Посмотреть карточку попытки">
                    <Link to={`/import/${props.data.id}`}>
                        <Button
                            disabled={importAttemptsHistoryState.isLoading}
                            type="link"
                            icon={<EditTableButtonIconStyled />}
                            onClick={() => dispatch(importAttemptsHistoryActions.setSelectedRow(props.data))}
                        />
                    </Link>
                </Tooltip>
            </Col>
        </Row>
    )
};