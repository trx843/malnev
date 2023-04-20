import { Nullable } from "../../../types";
import { ModalTypes } from "./components/ModalForCreatingAndReplacingProgram/constants";

export interface IModalConfig {
  id: Nullable<string>;
  visible: boolean;
  type: ModalTypes;
}
