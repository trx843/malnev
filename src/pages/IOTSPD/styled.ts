import { Card, Input, Tree } from "antd";
import { Form } from "formik-antd";
import styled from "styled-components";

const { Search } = Input;

export const InputSearchStyled = styled(Search) <{ collapsed: string }>`
    margin-top: 14px;
    height: 38px;
    display: ${(props) => (props.collapsed === "true" ? "none" : "block")}; //display: ${(props) => (props.collapsed ? "none" : "block")};
`;

export const SiderTreeStyled = styled(Tree) <{ collapsed: string }>`
    height: 100%;
    overflow-y: auto;
    margin: 15px 0 15px 0;
    display: ${(props) => (props.collapsed === "true" ? "none" : "block")};
`;

export const CardsBlockSpinStyled = styled.div`
    height: 164px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ObjectElementsRowStyled = styled.div <{ collapsed: string }>`
    display: ${(props) => (props.collapsed === "true" ? "none" : "block")};
    max-height: 164px;
    overflow-x: auto;
`;

export const ObjectElementCardStyled = styled(Card)`
    cursor: text; 
    max-width: 135px;
    margin: 4px 0 4px 4px;
    height: 74px;

    .ant-card-body {
        padding: 4px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }
`;

export const ObjectElementPStyled = styled.p <{ color: string }>`
    font-weight: 400;
    font-size: 14px;
    line-height: 18,2px;
    color: ${props => (props.color)};
    margin-bottom: 0;
`;

export const ObjectModalFormStyled = styled(Form)`
    max-height: 600px;
    width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const ParamModalFormStyled = styled(Form)`
    max-height: 600px;
    width: 100%;
    overflow-x: auto;
`;

export const ModalTitleBlockStyled = styled.div`
    min-height: 38px !important;
    width: 1122px;
    border-radius: 3px;
    background-color: #E8F4FF;
    padding-left: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #667985;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    margin-bottom: 24px;
`;

export const TextContainerStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "IBM Plex Sans";
`;

export const ParametrFormBlockStyled = styled.div`
    width: 100%;
`;

export const AstSymbolStyled = styled.span`
    color: red;
    margin-left: 5px;
`;

export const SpinWrapStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
`;