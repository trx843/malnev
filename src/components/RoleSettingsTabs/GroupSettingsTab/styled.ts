import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import PlusCircleOutlined from "@ant-design/icons/lib/icons/PlusCircleOutlined";
import { Layout } from "antd";
import styled from "styled-components";

export const LayoutStyled = styled(Layout)`
    width: 100%;
    height: 100%;
`;

export const HeaderButtonBlockStyled = styled.div`
    height: 60px;
    padding: 20px;
    background: #FFFFFF;
    border-radius: 6px 0px 0px 0px;
`;

export const HeaderButtonStyled = styled.button`
    background-color: transparent; 
    border: none; 
    outline: none;
`;

export const HeaderButtonIconStyled = styled(PlusCircleOutlined)`
    font-size: 20px;
    background: #1890FF;
    color: white; 
    border-radius: 33.3px;
`;

export const HeaderButtonSpanStyled = styled.span`
    margin-left: 10px;
    font-family: IBM Plex Sans;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    color: #1890FF;
`;

export const TableBlockStyled = styled.div`
    height: 100%;
    width: 100%;
`;

export const TableButtonStyled = styled.button`
    background-color: transparent;
    border: none;
    outline: none;
`;

export const TableButtonIconStyled = styled(EditOutlined)`
    font-size: 21.43px;
    color: #1890ff;
`;
