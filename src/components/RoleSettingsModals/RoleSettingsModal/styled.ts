import { Col, Form, Modal, Row, Steps, } from "antd";
import styled from "styled-components";

export const ModalStyled = styled(Modal)`
    min-width: 1300px;
    height: 900px;

    .ant-modal-body {
        padding: 0;
    }

    .ant-modal-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
`;

export const ModalBlockStyled = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const StepsStyled = styled(Steps)`
    height: 700px;
    width: 300px;
    border-right: 1px solid #DDE8F0;
    padding: 20px;
`;

export const ModalFormBlockStyled = styled(Form)`
    padding-top: 20px;
    height: 626px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-left: 30px;
`;

export const ModalWrapBlockStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 1000px;
    height: 700px;
`;

export const SecondStepContentBlockStyled = styled.div`
    padding: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
`;

export const ThirdStepContentBlockStyled = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
`;

export const LeftContentBlockStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 40%;
    height: 100%;
    border-right: 1px solid #DDE8F0;
`;

export const ContentHeaderStyled = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #DDE8F0;
    padding: 10px;
    padding-top: 20px;
    font-weight: 700;
    font-size: 14px;
    line-height: 18.2px;
`;

export const LeftBlockInnerContentStyled = styled.div`
    overflow-y: auto;
`;

export const RightContentBlockStyled = styled.div`
    width: 60%;
    height: 100%;
`;

export const RightContentHeaderRowStyled = styled(Row)`
    border-bottom: 1px solid #DDE8F0;
    padding: 10px 0;
    padding-top: 20px;
    padding-left: 10px;
`;

export const RightBlockInnerContentStyled = styled.div`
    overflow-y: auto;
    overflow-x: hidden;
    height: 93%;
    padding-left: 10px;
`;

export const RightContentHeaderMidItemStyled = styled(Col)`
    font-weight: 700;
    font-size: 14px;
    line-height: 18.2px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

export const RightContentHeaderItemStyled = styled(Col)`
    font-weight: 700;
    font-size: 14px;
    line-height: 18.2px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

export const RightContentListItemRowStyled = styled(Row)`
    margin: 10px 0;
`;

export const RightContentListCenterItemStyled = styled(Col)`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
`;

export const RightContentListAsideItemStyled = styled(Col)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

export const SwitchButtonStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    margin-right: 8px;
`;