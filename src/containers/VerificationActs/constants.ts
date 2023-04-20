export enum SortableFields {
    verificationLevel = "VerificationLevels.Name",
    verificationType = "CheckTypes.Name",
    verificationStatus = "VerificationStatuses.Name",
    ostName = "OstRnuPsp.OstName",
    filial = "OstRnuPsp.RnuName",
    psp = "OstRnuPsp.PspFullName",
    verificatedOn = "verificatedOn",
    createdOn = "createdOn",
}

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

export const DefaultColDef = {
  resizable: true,
  sortable: true,
  comparator: () => 0,
  filter: "customTextTableFilter",
  wrapText: true,
  cellStyle: staticCellStyle,
};

export const DefaultSortedFieldValue: string = "CreatedOn";
export const DefaultIsAsc: boolean = false;
