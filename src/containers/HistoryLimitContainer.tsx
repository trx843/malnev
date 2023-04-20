import React, { FunctionComponent, useEffect, useState } from "react";
import { ItemsTable } from "../components/ItemsTable";
import { ObjectFields, PagedModel, StateType } from "../types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../styles/app.css";
import { apiBase, getParamFromUrl } from "../utils";
import "moment/locale/ru";
import { GridLoading } from "../components/GridLoading";
import { HistoryLimit } from "../classes/SiEquipmentLimits";
import { fetched } from "../actions/historylimitinfo/creators";
import { history } from "../history/history";
import { IHistoryLimitState } from "../interfaces";
import { TableBlockWrapperStyled } from "../styles/commonStyledComponents";

export const HistoryLimitContainer: FunctionComponent = () => {
  const dispatch = useDispatch();
  const historyLimit = useSelector<StateType, IHistoryLimitState>(
    (state) => state.historyLimitInfo
  );

  var id = getParamFromUrl("id", "");
  id = id.replace(/["']/g, "");

  var isSiknParam = getParamFromUrl("isSikn", "false");
  const isSikn: boolean = isSiknParam == "'true'" ? true : false;
  let hiddenColumns: (keyof HistoryLimit)[] = ["meas"];
  if (isSikn) hiddenColumns.push("limitValid");

  const [loading, setLoading] = useState<boolean>(true);

  const fetchItems = () => {
    let viewName = isSikn ? "GetSiknLimitsHistory" : "GetSiLimitsHistory";

    axios
      .get<HistoryLimit[]>(
        `${apiBase}/historylimit?viewName=${viewName}&id=${id}`
      )
      .then((result) => {
        if (result.data) {
          dispatch(fetched(result.data));
          setLoading(false);
        } else {
          history.push("/historylimit");
        }
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <TableBlockWrapperStyled>
      {loading && <GridLoading />}
      {!loading && (
        <ItemsTable<HistoryLimit>
          items={historyLimit.items}
          fields={new ObjectFields(HistoryLimit).getFields()}
          hiddenColumns={hiddenColumns}
        />
      )}
    </TableBlockWrapperStyled>
  );
};
