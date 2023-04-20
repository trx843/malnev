import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import _ from "lodash";

const TestingLaboratory = "ИЛ";

export const AccreditationColumn = (props) => {
  const osuType = props.data.osuType;

  if (osuType !== TestingLaboratory || _.isNil(props.value)) return null;

  if (props.value) {
    return (
      <CheckCircleOutlined
        style={{ alignContent: "center", fontSize: "20px", color: "#219653" }}
      />
    );
  } else {
    return (
      <CloseCircleOutlined
        style={{ alignContent: "center", fontSize: "20px", color: "#FF4D4F" }}
      />
    );
  }
};
