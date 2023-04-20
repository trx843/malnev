import { FC } from "react";
import { Spin, SpinProps } from "antd";

export const Loading: FC<SpinProps> = ({ children, ...props}) => (
  <div className="ais__center">
    <Spin size="large" {...props}>{children}</Spin>
  </div>
);
