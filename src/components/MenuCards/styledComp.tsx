import { Menu } from "antd";
import { Card, CardColumns } from "react-bootstrap";
import styled from "styled-components";

interface IEventCounterProps {
  hasEvents: boolean;
}

interface ITitleWrapperProps {
  isTitle?: boolean;
}

export const CardColumnsWrapper = styled.div`
  height: calc(100vh - 98px);
  overflow-y: auto;

  @media (min-width: 320px) {
    .card-columns {
      column-count: 1;
    }
  }

  @media (min-width: 1440px) {
    .card-columns {
      column-count: 2;
    }
  }

  @media (min-width: 2560px) {
    .card-columns {
      column-count: 3;
    }
  }
`;

export const MainTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: ${(props: ITitleWrapperProps) =>
    props.isTitle ? "default" : "pointer"};
  margin: 0;
`;

export const Title = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 31px;
  color: #424242;
  margin: 0;

  &:hover {
    color: ${(props: ITitleWrapperProps) =>
    props.isTitle ? "#424242" : "#1890FF"};
  }
`;

export const MenuWrapper = styled.div`
  padding-left: 50px;
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

export const MenuStyled = styled(Menu)`
  border: none;

  .ant-menu-submenu {
    border-radius: 4px;
    background: white;
    margin-bottom: 16px !important;

    .ant-menu-sub {
      background: white;
    }

    .ant-menu-item-selected:after {
      opacity: 0;
    }

    .ant-menu-submenu-title {
      font-size: 20px;
      min-height: 48px;
      margin: 0;
      vertical-align: middle;
      line-height: 48px;
    }

    .ant-menu-item {
      margin-top: 0;
      margin-bottom: 8px !important;
      line-height: 26px;
      min-height: 48px;
      display: flex;
    }

    .ant-menu-item:first-child {
      margin-top: 8px;
    }
    .ant-menu-item:last-child {
      margin-bottom: 0 !important;
    }
  }

  .ant-menu-submenu:last-child {
    margin-bottom: 0 !important;
  }

  .ant-menu-item {
    font-size: 20px;
    margin-top: 0;
    margin-bottom: 16px !important;
    line-height: 26px;
    min-height: 48px;
    display: flex;
  }

  .ant-menu-item:first-child {
    margin-top: 16px;
  }
  .ant-menu-item:last-child {
    margin-bottom: 0 !important;
  }

  /*  */
`;

export const MenuCardColumns = styled(CardColumns)``;

export const MenuCard = styled(Card)`
  max-width: 584px;
  min-width: 584px;
  width: 584px;
  background: #ffffff;
  border-radius: 6px;
  padding: 24px;
  margin-bottom: 16px;
  .card-body {
    padding: 0;
  }
`;

export const MenuCardTitle = styled(MenuCard.Title)`
  margin: 0;
`;

export const ReportsMenuStyled = styled(Menu)`
  border: none;

  .ant-menu-submenu {
    background: #e8f4ff;
    border-radius: 4px;

    .ant-menu-sub {
      background: #e8f4ff;
    }

    .ant-menu-item-selected:after {
      opacity: 0;
    }

    .ant-menu-submenu-title {
      font-size: 20px;
      font-weight: bold;

      color: #424242;

      min-height: 64px;
      margin: 0;
      vertical-align: middle;
      line-height: 64px;
      padding-left: 20px !important;
    }

    .ant-menu-item {
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 8px !important;
      line-height: 21px;
      min-height: 41px;
      display: flex;
      padding-left: 20px !important;
    }

    .ant-menu-item:first-child {
      margin-top: 8px;
    }
    .ant-menu-item:last-child {
      margin-bottom: 24px !important;
    }
  }

  .ant-menu-submenu:first-child {
    margin-top: 16px;
  }
`;

export const CriticalEvents = styled.div`
  display: inline-block;
  width: 100%;
  height: 110px;
  border: 1px solid #dde8f0;
  border-radius: 4px;
  font-family: "IBM Plex Sans";
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
`;

export const CriticalEventsName = styled.div`
  display: block;
  margin-left: 20px;
  margin-top: 15px;
`;

export const CriticalEventsCount = styled.div`
  display: block;
  font-family: "IBM Plex Sans";
  font-weight: 700;
  font-size: 38px;
  color: ${(props: IEventCounterProps) =>
    props.hasEvents ? "#FF4D4F" : "#667985"};
  margin-left: 20px;
`;

export const AnotherEvents = styled.div`
  display: inline-block;
  width: 100%;
  height: 110px;
  border: 1px solid #dde8f0;
  border-radius: 4px;
  font-family: "IBM Plex Sans";
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
`;

export const AnotherEventsName = styled.div`
  display: block;
  margin-left: 20px;
  margin-top: 15px;
`;

export const AnotherEventsCount = styled.div`
  display: block;
  font-family: "IBM Plex Sans";
  font-weight: 700;
  font-size: 38px;
  color: #667985;
  margin-left: 20px;
  color: ${(props: IEventCounterProps) =>
    props.hasEvents ? "#424242" : "#667985"};
`;
