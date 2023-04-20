import { Card, Col, Radio, Row } from "antd";
import React, { FC, useEffect, useState } from "react";
import { SiknRsuItem } from "../../classes/SiknRsuItem";
import { SiknCard } from "./SiknCard";

interface ISiknsCardColumnsProps {
  siknList: Array<SiknRsuItem>;
  loading: boolean;
}

export const SiknsCardColumns: FC<ISiknsCardColumnsProps> = (props) => {
  const [sortByRatio, setSortByRatio] = useState<boolean>(true);
  const handleSortChange = () => {
    setSortByRatio(!sortByRatio);
  };
  const mssEventSeverityLevelsIds = Array.from(
    new Set(props.siknList.map((obj) => obj.mssEventSeverityLevel.id))
  );
  return (
    <>
      <Row gutter={[0, 24]} style={{ marginBottom: "10px" }}>
        <Col>
          <Row gutter={[0, 8]} style={{ marginBottom: "5px" }}>
            <Col>Сортировать по</Col>
          </Row>
          <Row>
            <Col>
              <Radio.Group value={sortByRatio} onChange={handleSortChange}>
                <Radio.Button value={true}>Значению риска</Radio.Button>
                <Radio.Button value={false}>Категории риска</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={12}>
        {sortByRatio ? (
          <>
            {props.siknList
              .sort((a, b) => b.sumRiskRatio - a.sumRiskRatio)
              .map((sikn) => {
                return (
                  <Col span={4}>
                    <SiknCard loading={props.loading} sikn={sikn} />
                  </Col>
                );
              })}
          </>
        ) : (
          <>
            {mssEventSeverityLevelsIds.map((id) => {
              return (
                <Col span={4}>
                  {props.siknList
                    .sort(
                      (a, b) =>
                        b.mssEventSeverityLevel.id - a.mssEventSeverityLevel.id
                    )
                    .filter((x) => x.mssEventSeverityLevel.id == id)
                    .map((sikn) => {
                      return <SiknCard loading={props.loading} sikn={sikn} />;
                    })}
                </Col>
              );
            })}
          </>
        )}
      </Row>
    </>
  );
};
