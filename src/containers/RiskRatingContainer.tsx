import { FunctionComponent, useEffect, useState } from "react";
import { Row, Col, message, Empty } from "antd";
import axios from "axios";
import { apiBase } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "../types";
import { IOperMonitState } from "../interfaces";
import { SiknsCardColumns } from "../components/riskRating/SiknsCardColumns";
import { SiknRsuItem } from "../classes/SiknRsuItem";
import { MssEventSecurityLevel } from "../classes";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";

export const RiskRatingContainer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const operMonitState = useSelector<StateType, IOperMonitState>(
    (state) => state.operMonit
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [sikns, setSikns] = useState<Array<SiknRsuItem>>([]);
  const defaultSikn = new SiknRsuItem();
  defaultSikn.mssEventSeverityLevel = new MssEventSecurityLevel();
  useEffect(() => {
    setLoading(true);
    setShowError(false);
    axios
      .get<Array<SiknRsuItem>>(`${apiBase}/siknrsus`)
      .then((result) => {
        setSikns(
          result.data
            .filter((x) => x.fullName.includes("СИКН"))
            .sort((a, b) => b.riskRatio - a.riskRatio)
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setShowError(true);
        message.error("Ошибка загрузки данных");
      });
  }, [operMonitState.filter]);

  return (
    <TableBlockWrapperStyled>
      <Row justify={"center"} style={{height: "100%", overflowY: "auto", overflowX: "hidden"}}>
        <Col span={24}>
          {!loading ? (
            !showError ? (
              sikns.length > 0 ? (
                <SiknsCardColumns loading={loading} siknList={sikns} />
              ) : (
                <Empty description={" Нет данных"} />
              )
            ) : (
              <Empty description={" Ошибка загрузки данных"} />
            )
          ) : (
            <SiknsCardColumns loading={loading} siknList={[defaultSikn]} />
          )}
        </Col>
      </Row>
    </TableBlockWrapperStyled>
  );
};
