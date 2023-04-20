import React, { Component } from 'react';
import { Button } from 'antd';
import ContainerOutlined from '@ant-design/icons/ContainerOutlined';
import { apiBase } from '../../utils';

interface IInvestigationActButtonProps {
    data: any;
}

interface IInvestigationActButtonState {
    disabled: boolean;
    loadings: boolean;
}

export class InvestigationActButton extends Component<IInvestigationActButtonProps, IInvestigationActButtonState> {
    constructor(props: IInvestigationActButtonProps) {
        super(props);
        this.state = {
            disabled: false,
            loadings: false
        };
        this.clickHandler = this.clickHandler.bind(this);
    }

    clickHandler() {
        const item = this.props.data;
        const url: string = `${apiBase}/siknoff/investigationact`;
        const link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
    }

    render() {
        return (
            <div>
                <Button
                    loading={this.state.loadings}
                    disabled={this.state.disabled}
                    onClick={this.clickHandler}
                    style={{ width: '100%' }}
                    icon={<ContainerOutlined />} />
            </div>
        );
    }
}