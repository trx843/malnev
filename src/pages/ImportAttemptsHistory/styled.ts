import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import { Col, Select } from "antd";
import styled from "styled-components";

export const FilterColStyled = styled(Col)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const FilterItemLabelStyled = styled.span`
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    font-family: "IBM Plex Sans";
    color: #667985;
`;

export const FilterItemStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const FilterSelectStyled = styled(Select)`
    min-width: 248px;
    min-height: 40px;
    
    .ant-select-selector{
        min-height: 40px;
        display: flex;
        align-items: center;
    }
`;

export const EditTableButtonIconStyled = styled(FileSearchOutlined)`
    font-size: 21.43px;
    color: #1890ff;
`;

export const SpinContainerStyled = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`;