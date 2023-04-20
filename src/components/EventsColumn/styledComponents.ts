import styled from "styled-components";
import { Card } from "react-bootstrap";


interface IFlagProps {
  flag?: boolean;
}

export const EventsCard = styled(Card)<{height: string}>`
max-width: 584px;
width: 584px;
height: ${props => props.height};//calc(100vh - 125px) или 100%
background: #ffffff;
border-radius: 6px;
overflow-y: auto;
padding-top: 20px;
padding-left: 20px;
padding-right: 10px;
`;

export const EventsCardTitle = styled(EventsCard.Title)`
padding-right: 14px;
`;

export const EventsCardBody = styled.div`
overflow-y: auto;
padding-right: 7px;
`;

export const EventContainer = styled.div`
width: 100%;
box-sizing: border-box;
border-radius: 4px;
margin-bottom: 16px;
padding: 16px;
background: ${(props: IFlagProps) => (props.flag ? "#FFF2F2" : "#FFFFFF")};
border: ${(props: IFlagProps) =>
  props.flag ? "1px solid #FF4D4F" : "1px solid #DDE8F0"}; ;
`;

export const EventTitleWrapper = styled.div`
display: flex;
align-items: center;
margin: 0;
margin-bottom: 16px;
`;

export const EventTitle = styled.h1`
font-weight: bold;
font-size: 20px;
line-height: 26px;
color: #424242;
margin: 0;
`;

export const MainTitleWrapper = styled.div`
display: flex;
align-items: center;
cursor: ${(props: IFlagProps) => (props.flag ? "default" : "pointer")};
margin: 0;
`;

export const BoxIcon = styled.div`
min-width: 48px;
width: 48px;
height: 48px;
margin-right: 24px;
background: #345a76;
border-radius: 4px;

.anticon {
  color: white;
  padding: 14.44px;
}
`;

export const Title = styled.h1`
font-style: normal;
font-weight: bold;
font-size: 24px;
line-height: 31px;
color: #424242;
margin: 0;

&:hover {
  color: ${(props: IFlagProps) => (props.flag ? "#424242" : "#1890FF")};
}
`;

export const FilterTextParagraph = styled.p`
font-size: 16px;
line-height: 21px;
color: #667985;
margin: 0;
`;

export const TextParagraph = styled.p`
font-size: 14px;
line-height: 18px;
color: #667985;
margin: 0;
`;

export const EventText = styled.div`
font-style: normal;
font-weight: normal;
font-size: 16px;
line-height: 21px;
color: #424242;
`;

export const CriticIconWrapper = styled.div`
margin-left: auto;
`;

export const OrgStructLink = styled.div`
font-style: normal;
font-weight: normal;
font-size: 16px;
line-height: 21px;
color: #424242;
&:hover {
  cursor: ${(props: IFlagProps) => (props.flag ? "pointer" : "default")};
  text-decoration: ${(props: IFlagProps) =>
    props.flag ? "underline" : "none"};
}
`;

export const NextButtonWrapper = styled.div`
display: flex;
width: 100%;
margin-bottom: 8px;
`;