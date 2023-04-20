import React, {FC} from "react";
import cn from "classnames";

import "./styles.css";

interface DividerFormProps
  extends Partial<React.HTMLAttributes<HTMLDivElement>> {
  title?: string;
}

export const DividerForm: FC<DividerFormProps> = ({
  title,
  className,
  ...props
}) => (
  <div {...props} className={cn("ais-divider-form", className)}>
    {title}
  </div>
);
