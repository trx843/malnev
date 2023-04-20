import React, { FunctionComponent } from "react";

interface IiFrameProps {
  src: string;
}

export const IFrame: FunctionComponent<IiFrameProps> = (
  props: IiFrameProps
) => {
  return (
    <iframe
      id="ifr"
      style={{ width: "100%", height: "calc(100vh - 125px)" }}
      src={props.src}
    />
  );
};
