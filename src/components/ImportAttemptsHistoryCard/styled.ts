import styled from "styled-components";
import { InputNumber, TreeSelect } from "antd";

export const CardTitleStyled = styled.h1`
    font-weight: 700;
    font-size: 30px;
    line-height: 39px;
    margin-bottom: 20px;
`;

export const FilterSelectStyled = styled(TreeSelect)`
    width: 100%;
    min-height: 40px;
    margin-bottom: 20px;
    
    .ant-select-selector{
        min-height: 40px;
    }
`;

export const FilterInputStyled = styled(InputNumber)`
    width: 100%;
    min-height: 40px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

export const SpinContainerStyled = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`;