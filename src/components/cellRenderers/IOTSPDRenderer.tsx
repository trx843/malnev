import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ICellRendererParams } from "ag-grid-community";
import { Button, Col, Popconfirm, Row, Tooltip } from "antd";
import usePresenter from "pages/IOTSPD/presenter";
import { FC } from "react";

export const IOTSPDRenderer: FC<ICellRendererParams> = (
    props: ICellRendererParams
) => {
    const {
        editParametrModalOnOpenHandler,
        deleteParametrConfirmHandler,
        canceldDeleteParametr,
        setSelectedParamIdHandler,
        iotspdState,
    } = usePresenter();

    return (
        <Row justify="space-between">
            <Col>
                <Tooltip title="Редактировать параметр">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => editParametrModalOnOpenHandler(props.data)}
                        disabled={iotspdState.isButtonLoading}
                    />
                </Tooltip>

                <Tooltip title="Удалить параметр">
                    <Popconfirm
                        title="Вы действительно хотите удалить этот параметр?"
                        onConfirm={deleteParametrConfirmHandler}
                        onCancel={canceldDeleteParametr}
                        okText="Удалить"
                        cancelText="Отменить"
                        placement="left"
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            disabled={iotspdState.isButtonLoading}
                            danger
                            onClick={() => setSelectedParamIdHandler(props.data.id)}
                        />
                    </Popconfirm>

                </Tooltip>
            </Col>
        </Row>
    )
};