import { ColumnDefType, FieldType, SchemeDataType, SchemeType } from "api/params/nsi-page.params";
import { FieldSelectorsCrossItemsType } from "api/responses/nsi-page.response";
import moment from "moment";
import * as Yup from "yup";

const yupObjectCreator = (fieldType: number, isNullable: boolean) => {
    if (fieldType === 0) { //string
        if (isNullable) {
            return Yup.string().trim().nullable();
        } else {
            return Yup.string()
                .required("Поле обязательно к заполнению!")
                .trim();
        }
    }
    if (fieldType === 1) { //date
        if (isNullable) {
            return Yup.date().nullable();
        } else {
            return Yup.date().required("Поле обязательно к заполнению!");
        }
    }
    if (fieldType === 2) { //guid //   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i // TODO 
        const pattern = new RegExp('/^(?:\{{0,1}(?:[0-9a-fA-F]){8}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){12}\}{0,1})$/') ///^(?:\{{0,1}(?:[0-9a-fA-F]){8}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){4}-(?:[0-9a-fA-F]){12}\}{0,1})$/
        if (isNullable) {
            return Yup.string()
                //.matches(pattern, "Вводимые данные должны быть GUID типа!")
                .trim()
                .nullable();
        } else {
            return Yup.string()
                //.matches(pattern, "Вводимые данные должны быть GUID типа!")
                .required("Поле обязательно к заполнению!")
                .trim();
        }
    }
    if (fieldType === 3 || fieldType === 11) { //num integer
        if (isNullable) {
            return Yup.number().integer("Введенное значение должно быть целым числом!").nullable();
        } else {
            return Yup.number()
                .integer("Введенное значение должно быть целым числом!")
                .required("Поле обязательно к заполнению!");
        }
    }
    if (fieldType === 6) { //boolean
        return Yup.boolean();
    }
    if (fieldType === 9) { //num
        if (isNullable) {
            return Yup.number().nullable();
        } else {
            return Yup.number().required("Поле обязательно к заполнению!");
        }
    }
};

export const createFormHalper = (
    selectedScheme: SchemeType,
    columnDefs: Array<ColumnDefType>,

) => {
    let yupObject = {};
    let formInitialValues = {};
    let itemsForForm: { name: string; description: string; value: any }[] = [];

    for (let columnDef of columnDefs) {
        const field = selectedScheme.fields.find((field: FieldType) => field.name === columnDef.field);

        if (field?.isPrimary && field?.isEditId && typeof field?.fieldType === "number" && !field.isComputed && !field.isHidden) {
            yupObject[columnDef.field] = yupObjectCreator(field?.fieldType, field?.isNullable)
        } else if (!field?.isPrimary && typeof field?.fieldType === "number" && !field.isComputed && !field.isHidden) {
            yupObject[columnDef.field] = yupObjectCreator(field?.fieldType, field?.isNullable)
        };

        if (field?.isPrimary && field?.isEditId && typeof field?.fieldType === "number" && !field.isComputed && !field.isHidden) {
            formInitialValues[columnDef.field] = null;
        } else if (!field?.isPrimary && !field?.isComputed && !field?.isHidden) {
            formInitialValues[columnDef.field] = field?.fieldType === 6 ? false : null;
        };

        if (field?.isPrimary && field?.isEditId && !field?.isComputed && !field.isHidden) {
            itemsForForm.push({
                name: columnDef.field,
                description: columnDef.headerName,
                value: null,
            });
        } else if (!field?.isPrimary && !field?.isComputed && !field?.isHidden) {
            itemsForForm.push({
                name: columnDef.field,
                description: columnDef.headerName,
                value: field?.fieldType === 6 ? false : null,
            });
        };
    };

    return { yupObject, formInitialValues, itemsForForm };
};

const itemsForFormFieldHalper = (field: FieldType, col, selectedRowInScheme) => {
    if (field.fieldType === 1) {
        return moment(selectedRowInScheme[col], "DD.MM.YYYY HH.mm.ss");
    } else if (field.fieldType === 6) {
        if (selectedRowInScheme[col] === "Да") {
            return true;
        } else {
            return false;
        }
    } else {
        return selectedRowInScheme[col];
    }
};

export const updateFormHelper = (
    selectedScheme: SchemeType,
    selectedRowInScheme: any,
    dataSelectors: Array<FieldSelectorsCrossItemsType>,
    columnDefs: Array<ColumnDefType>,
) => {
    let yupObject = {};
    let formInitialValues = {};
    let itemsForForm: { name: string; description: string; value: any }[] = [];

    for (let col in selectedRowInScheme) {
        const field = selectedScheme.fields.find((field: FieldType) => field.name === col);

        const selectorCrossItemDictionary = dataSelectors.find((field: FieldSelectorsCrossItemsType) => field.fieldName === col)?.crossItems;
        const crossItem = selectorCrossItemDictionary?.find((selector: any) => selector.foreign === selectedRowInScheme[col]);

        if (typeof field?.fieldType === "number" && !field.isComputed && !field.isHidden) {
            yupObject[col] = yupObjectCreator(field?.fieldType, field?.isNullable)
        };

        if (field?.foreignKey && !field.isComputed && !field.isHidden) {
            formInitialValues[col] = !crossItem?.foreign ? null : crossItem.primary;
        } else if (field?.fieldType === 1 && !field.isComputed && !field.isHidden) {
            if (selectedRowInScheme[col]) {
                formInitialValues[col] = moment(selectedRowInScheme[col], "DD.MM.YYYY HH.mm.ss");
            } else {
                formInitialValues[col] = null;
            }
        } else if (field?.fieldType === 6 && !field.isComputed && !field.isHidden) {
            if (selectedRowInScheme[col] === "Да") {
                formInitialValues[col] = true;
            } else {
                formInitialValues[col] = false;
            }
        } else {
            if (selectedRowInScheme[col] && !field?.isComputed && !field?.isHidden) {
                formInitialValues[col] = selectedRowInScheme[col];
            } else if (!selectedRowInScheme[col] && !field?.isComputed && !field?.isHidden) {
                formInitialValues[col] = null;
            }
        };

        field && !field?.isComputed && !field?.isHidden && itemsForForm.push({
            name: col,
            description: columnDefs.find((column: any) => column.field === col)?.headerName ?? '',
            value: itemsForFormFieldHalper(field, col, selectedRowInScheme),
        });
    };

    return { yupObject, formInitialValues, itemsForForm };
};

export const tableHandler = (
    selectedScheme: SchemeType,
    selectedSchemeData: SchemeDataType,
) => {
    //функция-помощник для формирования данных для отрисовки таблицы
    const objectCreator = (
        fields: Array<FieldType>,
        values: Array<string | number>,
    ) => {
        const data = {} as any;
        fields && fields.forEach(
            (item: FieldType, index: number) => {
                if (!item.isHidden) {
                    if (item.fieldType === 6) {
                        if (values[index]) {
                            data[item.name] = "Да"
                        } else {
                            data[item.name] = "Нет"
                        }
                    } else {
                        data[item.name] = values[index]
                    }
                }
            }
        );
        return data;
    };

    const rowData = selectedSchemeData.result.map(values =>
        objectCreator(selectedScheme.fields, values.values),
    );
    return rowData;
};

export const tableColumnHandler = (fields: Array<FieldType>) => {
    let colDefs = [] as Array<ColumnDefType>;

    fields.map(
        (field) => {
            if (!field.isHidden) {
                colDefs.push({ 'headerName': field.description, 'field': field.name, 'headerTooltip': field.description, 'tooltipField': field.name })
            }
        }
    )

    return colDefs;
};

export const updateModalAbilityHandler = (obj) => {
    for (let k in obj) {
        return false
    }

    return true
};

export const formNewValuesCreator = (initialValues: object, currentValues: object) => {
    let initValues = { ...initialValues };
    let newValues: any = [];

    for (let value in currentValues) {
        initValues[value] = currentValues[value];
    }

    for (let value in initValues) {
        newValues.push(initValues[value]);
    }

    return newValues;
};