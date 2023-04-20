import * as Yup from "yup";

export enum FormFields {
  typicalViolations = "typicalViolations",
  identifiedViolationSerial = "identifiedViolationSerial",
  siknLabRsuTypeId = "siknLabRsuTypeId",

  typicalViolationText = "typicalViolationText",
  pointNormativeDocuments = "pointNormativeDocuments",
}

export enum AreaOfResponsibilityValues {
  AcceptancePointsForOilAndPetroleumProducts = 1,
  TestingLaboratoriesOfOilAndPetroleumProducts = 3,
}

export const AreaOfResponsibilityOptions = [
  {
    value:
      AreaOfResponsibilityValues.AcceptancePointsForOilAndPetroleumProducts,
    label: "Приемо-сдаточные пункты нефти и нефтепродуктов",
  },
  {
    value:
      AreaOfResponsibilityValues.TestingLaboratoriesOfOilAndPetroleumProducts,
    label: "Испытательные лаборатории нефти и нефтепродуктов",
  },
];

export const TypicalViolation = {
  typicalViolationText: "",
  pointNormativeDocuments: "",
};

export const ValidationSchema = Yup.object({
  [FormFields.typicalViolations]: Yup.array().of(
    Yup.object({
      [FormFields.typicalViolationText]: Yup.string().required(
        "Поле обязательно к заполнению!"
      ),
      [FormFields.pointNormativeDocuments]: Yup.string().required(
        "Поле обязательно к заполнению!"
      ),
    })
  ),
  [FormFields.identifiedViolationSerial]: Yup.number().nullable().required(
    "Поле обязательно к заполнению!"
  ),
  [FormFields.siknLabRsuTypeId]: Yup.number().required(
    "Поле обязательно к заполнению!"
  ),
});
