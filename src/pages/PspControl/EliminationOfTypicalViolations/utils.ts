export const getModalTitleWithViolationNumber = (title: string, violation) => {
  const violationsSerial =
    violation?.identifiedTypicalViolation_identifiedViolationsSerial;

  if (violationsSerial) {
    return `${title} № ${violationsSerial}`;
  }

  return title;
};
