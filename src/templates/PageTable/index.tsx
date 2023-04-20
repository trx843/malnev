import React, {FC} from "react";
import {Card} from "antd";
import cn from "classnames";

import {GridLoading} from "../../components/GridLoading";
import "./style.css";

interface PageTableProps {
  childrenTop: React.ReactNode;
  childrenTable: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const PageTableTemplate: FC<PageTableProps> = ({
  childrenTable,
  childrenTop,
  className,
  loading
}) => (
  <div className={cn(className, "ais-page-table")}>
    <Card>{childrenTop}</Card>
    <div className="ais-page-table__table">
      {loading ? <GridLoading /> : childrenTable}
    </div>
  </div>
);
