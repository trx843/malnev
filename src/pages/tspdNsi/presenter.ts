import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { useEffect } from "react";
import { FieldType, SchemeDataType, SchemeType } from "../../api/params/nsi-page.params";
import { message } from "antd";
import { useAntdFormik } from "customHooks/useAntdFormik";
import * as Yup from "yup";
import {
    TspdNsiStateType,
    tspdNsi,
    tspdNsiActions,
} from "slices/tspdNsi";
import {
    createNewRowInSchemeDataTC,
    deleteRowInSchemeDataTC,
    getAllSchemesTC,
    getDataSelectorsTC,
    getSchemeDataTC,
    updateRowInSchemeDataTC
} from "thunks/tspdNsiPage";
import moment from "moment";
import { createFormHalper, formNewValuesCreator, tableHandler, updateFormHelper } from "pages/Nsi/utils";

const usePresenter = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const tspdNsiState: TspdNsiStateType = useSelector(tspdNsi);

    //sider
    useEffect(() => {
        dispatch(getAllSchemesTC()); //получение всех возможных таблиц для страницы нси

        return () => {
            dispatch(tspdNsiActions.clearState()); //зачистка стейта после ухода со страницы нси
        };
    }, []);

    const onClickSiderHandler = useCallback((selectedScheme: SchemeType) => {
        //коллбэк на выбор конкретной таблицы в выпадающем меню
        dispatch(tspdNsiActions.setIsTableLoading(true));
        dispatch(tspdNsiActions.setSelectedScheme(selectedScheme)); //сохранение в стейт выбранной таблицы
        dispatch(tspdNsiActions.setColumnDefs(selectedScheme)); //подготовка и сохранение данных в стейт по колонкам выбранной таблицы
        dispatch(getSchemeDataTC(selectedScheme)); //получение данных для выбранной таблице
        dispatch(getDataSelectorsTC(selectedScheme)); //получение селекторов данных для полей в модальных окнах
        dispatch(tspdNsiActions.setSelectedRowInScheme({})); //задаем выбранной строке нулевой параметр
    }, []);

    //table
    useEffect(() => {
        const result = createFormHalper(tspdNsiState.selectedScheme, tspdNsiState.columnDefs);

        if (result.itemsForForm.length > 0) {
            dispatch(tspdNsiActions.setItemsForForm(result.itemsForForm)); //сохранение в стейт сформированных данных
            dispatch(tspdNsiActions.setFormInitialValues(result.formInitialValues)); //сохранение в стейт инициализационных данных для формика
            dispatch(tspdNsiActions.setYupObject(result.yupObject)); //сохранение в стейт объекта валидации формы
        }
    }, [tspdNsiState.selectedScheme, tspdNsiState.columnDefs]); //данные пересобираются каждый раз при выборе новой таблицы

    useEffect(() => {
        const result = updateFormHelper(tspdNsiState.selectedScheme, tspdNsiState.selectedRowInScheme, tspdNsiState.dataSelectors, tspdNsiState.columnDefs);

        if (result.itemsForForm.length > 0) {
            dispatch(tspdNsiActions.setItemsForFormFull(result.itemsForForm)); //сохранение в стейт сформированных данных
            dispatch(tspdNsiActions.setFormInitialValuesFull(result.formInitialValues)); //сохранение в стейт инициализационных данных для формика
            dispatch(tspdNsiActions.setYupObjectFull(result.yupObject)); //сохранение в стейт объекта валидации формы
        }
    }, [
        tspdNsiState.selectedScheme,
        tspdNsiState.selectedRowInScheme,
        tspdNsiState.dataSelectors,
        tspdNsiState.columnDefs
    ]); //данные пересобираются каждый раз при выборе новой строки в таблице

    useEffect(() => {
        if (tspdNsiState.selectedSchemeData.success) {
            //формирование данных для отрисовки таблицы из данных по таблице и ее значениям
            dispatch(tspdNsiActions.setRowData(tableHandler(tspdNsiState.selectedScheme, tspdNsiState.selectedSchemeData)));
            dispatch(tspdNsiActions.setIsTableLoading(false));
        }
    }, [tspdNsiState.selectedSchemeData]); //данные пересобираются каждый раз при выборе новой таблицы в сайдере

    const onRowClickHandler = useCallback((selectedRow: any) => {
        //коллбэк на выбор конкретной строки в таблице
        dispatch(tspdNsiActions.setSelectedRowInScheme(selectedRow)); //сохранение в стейт данных выбранной строки
    }, []);

    //modal window
    const [modalTitle, setModalTitle] = useState('');

    const createModalFormik = useAntdFormik({
        validateOnChange: false,
        initialValues: tspdNsiState.formInitialValues,
        validationSchema: Yup.object(tspdNsiState.yupObject),
        onSubmit: (values) => {
            let newValues = formNewValuesCreator(tspdNsiState.formInitialValues, values);
            //единица в массиве это хардкод айдишника, что бы не спрашивать его у пользователя, так как бэк подставляет следующий по записи в бд
            !values.hasOwnProperty("ID") && !values.hasOwnProperty("Id") ? newValues.unshift(1) : null
            dispatch(
                createNewRowInSchemeDataTC({
                    table: tspdNsiState.selectedScheme,
                    row: { values: newValues },
                }),
            );
        },
    });

    const updateModalFormik = useAntdFormik({
        validateOnChange: false,
        initialValues: tspdNsiState.formInitialValuesFull,
        validationSchema: Yup.object(tspdNsiState.yupObjectFull),
        onSubmit: (values) => {
            dispatch(
                updateRowInSchemeDataTC({
                    table: tspdNsiState.selectedScheme,
                    row: { values: formNewValuesCreator(tspdNsiState.formInitialValuesFull, values) },
                }),
            );
        },
    });

    useEffect(() => {
        createModalFormik.setValues(tspdNsiState.formInitialValues);
    }, [tspdNsiState.formInitialValues]);

    useEffect(() => {
        updateModalFormik.setValues(tspdNsiState.formInitialValuesFull);
    }, [tspdNsiState.formInitialValuesFull]);

    useEffect(() => {
        createModalFormik.resetForm();
    }, [tspdNsiState.isCreateModalVisible]);

    const isCreateModalVisibleHandler = useCallback(() => {
        dispatch(tspdNsiActions.setIsCreateModalVisible(true));
    }, []);

    const isUpdateModalVisibleHandler = useCallback(() => {
        dispatch(tspdNsiActions.setIsUpdateModalVisible(true));
    }, []);

    const isDeleteModalVisibleHandler = useCallback(() => {
        dispatch(tspdNsiActions.setIsDeleteModalVisible(true));
    }, []);

    const modalOnCreateHandler = useCallback(
        // коллбэк на сабмит в модальном окне добавления новой строки в таблицу
        () => {
            createModalFormik.submitForm();
        },
        []
    );

    const modalOnUpdateHandler = useCallback(
        //коллбэк на сабмит в модальном окне изменения строки в таблице
        () => {
            updateModalFormik.submitForm();
        },
        []
    );

    const modalOnResetHandler = useCallback(() => {
        //коллбэк на кнопку очистки значений в модальном окне
        let nullValues = {};
        for (let [k, v] of Object.entries(tspdNsiState.formInitialValuesFull)) {
            if (k === "ID" || k === "Id") {
                nullValues[k] = v
            } else {
                nullValues[k] = ""
            }
        }
        createModalFormik.setValues(tspdNsiState.formInitialValues);
        updateModalFormik.setValues(nullValues);
    }, [tspdNsiState.formInitialValues, tspdNsiState.formInitialValuesFull]);

    const modalOnCancelHandler = useCallback(
        //коллбэк на кнопку закрытия модального окна
        () => {
            dispatch(tspdNsiActions.setIsCreateModalVisible(false));
            dispatch(tspdNsiActions.setIsUpdateModalVisible(false));
            dispatch(tspdNsiActions.setIsDeleteModalVisible(false));
        },
        []
    );

    const modalOnDeletelHandler = useCallback(
        //коллбэк на сабмит в модальном окне удаления строки из таблицы
        (scheme: SchemeType) => {
            dispatch(deleteRowInSchemeDataTC({ rowId: tspdNsiState.selectedRowInScheme["ID"], scheme }));
        },
        [tspdNsiState.itemsForFormFull]
    );

    return {
        history,
        tspdNsiState,
        onClickSiderHandler,
        modalOnCreateHandler,
        modalOnCancelHandler,
        onRowClickHandler,
        modalTitle,
        setModalTitle,
        modalOnResetHandler,
        isCreateModalVisibleHandler,
        isUpdateModalVisibleHandler,
        isDeleteModalVisibleHandler,
        modalOnUpdateHandler,
        modalOnDeletelHandler,
        createModalFormik,
        updateModalFormik,
    }
};

export default usePresenter;