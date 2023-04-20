import { Select } from "antd";
import styled from "styled-components";

export const FormItemsGroupLableStyled = styled.div`
    background: #E8F4FF;
    width: 100%;
    height: 38px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    padding-left: 12px;
`;

export const FormSelectItemsGroupStyled = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const FormSelectStyled = styled(Select)`
    min-width: 230px;
`;