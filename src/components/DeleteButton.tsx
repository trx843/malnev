import { Button } from "antd";
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import React, { Component } from "react";
import { IdType } from "../types";
import { IEntity } from "../interfaces";

interface IDeleteButtonProps {
    data: IEntity;
    clicked: (obj: IdType) => void;
}

export class DeleteButton extends Component<IDeleteButtonProps>{
    constructor(props: IDeleteButtonProps) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        this.props.clicked(this.props.data.id);
    }

    render() {
        const archive = (this.props.data as any).isArchival ?? false;
        return (
            <div>
                <Button
                    danger
                    onClick={this.clickHandler}
                    style={{ width: '100%' }}
                    icon={<DeleteOutlined />}
                    disabled={archive} />
            </div>
        );
    }
}