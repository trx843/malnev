import { FormFields } from "./constants";

export interface IFormValues {
  [FormFields.typicalViolations]: any[];
  [FormFields.identifiedViolationSerial]: number;
  [FormFields.siknLabRsuTypeId]: number;
}
