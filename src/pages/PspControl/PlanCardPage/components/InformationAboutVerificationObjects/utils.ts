import moment from "moment";

export const formatDate = (date: string) => {
  if (!date) return "Н/д";

  const momentObj = moment(date);

  if (momentObj.isValid()) return momentObj.format("DD.MM.YYYY");

  return "Н/д";
};
