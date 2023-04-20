import React, { FunctionComponent, useState } from "react";
import { Card, Col, Modal, Row, Tooltip } from "antd";
import { SknInformation } from "../../classes/OperativeMonitoringModel";
import { SiknOperativeInfo } from "./SiknOperativeInfo";

import styled from "styled-components";
import { TextLink } from "../../styles/commonStyledComponents";

interface IStatusProps {
  statusNum: number;
}

export const SiknCard = styled(Card)`
  .ant-card-body {
    padding: 0;
  }
`;

export const InnerBorder = styled.div`
  padding: 12px;
  border: ${(props: IStatusProps) => {
    switch (props.statusNum) {
      case 1:
        return "1px solid #ff4d4f";
      case 2:
        return "1px solid #F1F3F4";
      default:
        return "1px solid #F2994A";
    }
  }};
`;

export const SiknCardGrid = styled(SiknCard.Grid)`
  cursor: pointer;
  padding: 12px;
  width: 20%;
  height: 68px;
  overflow: auto;
  color: ${(props: IStatusProps) => {
    switch (props.statusNum) {
      case 1:
        return "#ff4d4f";
      case 2:
        return;
      default:
        return "#F2994A";
    }
  }};
  &:hover {
    box-shadow: ${(props: IStatusProps) => {
      switch (props.statusNum) {
        case 1:
          return "0 1px 2px -2px rgb(255 77 79 / 16%), 0 3px 6px 0 rgb(255 77 79 / 12%),0 5px 12px 4px rgb(255 77 79 / 9%)";
        case 2:
          return;
        default:
          return "0 1px 2px -2px rgb(242 153 74 / 16%), 0 3px 6px 0 rgb(242 153 74 / 12%),0 5px 12px 4px rgb(242 153 74 / 9%)";
      }
    }};
  }
`;

interface ISiknCardProps {
  siknList: Array<SknInformation>;
}

export const SiknCards: FunctionComponent<ISiknCardProps> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [siknInfo, setSiknInfo] = useState<SknInformation>();

  return (
    <>
      <SiknCard>
        {props.siknList.map((sikn) => {
          return (
            <SiknCardGrid statusNum={sikn.status}>
              <div
                onClick={(e) => {
                  setShowModal(true);
                  setSiknInfo(sikn);
                }}
              >
                <SiknOperativeInfo sikn={sikn} fullInfo={false} />
              </div>
            </SiknCardGrid>
          );
        })}
      </SiknCard>
      <Modal
        title={"Подробная информация"}
        width={324}
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
        }}
        footer={null}
      >
        {siknInfo ? (
          <SiknOperativeInfo sikn={siknInfo} fullInfo={true} />
        ) : (
          <div>Нет информации</div>
        )}
      </Modal>
    </>
  );
};
