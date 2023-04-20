export type SchemeType = {
    schema: string;
    name: string;
    description: string;
    canEdit: boolean;
    fields: Array<FieldType>;
};

export type FieldType = {
    name: string;
    description: string;
    fieldType: number;
    isHidden: boolean;
    isPrimary: boolean;
    isNullable: boolean;
    isEditId: boolean;
    isComputed: boolean;
    foreignKey: ForeignKeyType | null;
};

export type ForeignKeyType = {
    schema: string;
    table: string;
    field: string;
    customPropertyFkField: string | null;
    customPropertyFkFieldType: number | null;
};

export type SchemeDataType = {
    success: boolean;
    message: string;
    result: Array<SchemeDataValuesType>;
};

export type SchemeDataValuesType = {
    values: Array<number>;
};

export type SchemeWithRowType = {
    table: SchemeType;
    row: SchemeDataValuesType;
};

export type ColumnDefType = {
    headerName: string;
    field: string;
    headerTooltip: string;
    tooltipField: string;
}