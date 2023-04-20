import React, { FC } from "react";
import { Button } from "antd";
import cn from "classnames";
import PaperClipOutlined from "@ant-design/icons/PaperClipOutlined";
import { ButtonProps } from "antd/lib/button";

import "./styles.css";

export const AttachmentButton: FC<ButtonProps> = ({ className, ...props }) => (
  <Button
    {...props}
    className={cn("ais-attachment-button", className)}
    icon={<PaperClipOutlined />}
  />
);
