import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { useEffect } from "react";
import { FieldType, SchemeDataType, SchemeType } from "../../api/params/nsi-page.params";
import { message } from "antd";
import { useAntdFormik } from "customHooks/useAntdFormik";
import * as Yup from "yup";
import {
    CtrlNsiStateType,
    ctrlNsi,
    ctrlNsiActions,
} from "slices/ctrlNsi";
import {
    createNewRowInSchemeDataTC,
    deleteRowInSchemeDataTC,
    getAllSchemesTC,
    getDataSelectorsTC,
    getSchemeDataTC,
    updateRowInSchemeDataTC
} from "thunks/ctrlNsiPage";
import moment from "moment";
import { createFormHalper, formNewValuesCreator, tableHandler, updateFormHelper } from "pages/Nsi/utils";

const usePresenter = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ctrlNsiState: CtrlNsiStateType = useSelector(ctrlNsi);

    //sider
    useEffect(() => {
        dispatch(getAllSchemesTC()); //получение всех возможных таблиц для страницы нси

        return () => {
            dispatch(ctrlNsiActions.clearState()); //зачистка стейта после ухода со страницы нси
        };
    }, []);

    const onClickSiderHandler = useCallback((selectedScheme: SchemeType) => {
        //коллбэк на выбор конкретной таблицы в выпадающем меню
        dispatch(ctrlNsiActions.setIsTableLoading(true));
        dispatch(ctrlNsiActions.setSelectedScheme(selectedScheme)); //сохранение в стейт выбранной таблицы
        dispatch(ctrlNsiActions.setColumnDefs(selectedScheme)); //подготовка и сохранение данных в стейт по колонкам выбранной таблицы
        dispatch(getSchemeDataTC(selectedScheme)); //получение данных для выбранной таблице
        dispatch(getDataSelectorsTC(selectedScheme)); //получение селекторов данных для полей в модальных окнах
        dispatch(ctrlNsiActions.setSelectedRowInScheme({})); //задаем выбранной строке нулевой параметр
    }, []);

    //table
    useEffect(() => {
        const result = createFormHalper(ctrlNsiState.selectedScheme, ctrlNsiState.columnDefs);

        if (result.itemsForForm.length > 0) {
            dispatch(ctrlNsiActions.setItemsForForm(result.itemsForForm)); //сохранение в стейт сформированных данных
            dispatch(ctrlNsiActions.setFormInitialValues(result.formInitialValues)); //сохранение в стейт инициализационных данных для формика
            dispatch(ctrlNsiActions.setYupObject(result.yupObject)); //сохранение в стейт объекта валидации формы
        }
    }, [ctrlNsiState.selectedScheme, ctrlNsiState.columnDefs]); //данные пересобираются каждый раз при выборе новой таблицы

    useEffect(() => {
        const result = updateFormHelper(ctrlNsiState.selectedScheme, ctrlNsiState.selectedRowInScheme, ctrlNsiState.dataSelectors, ctrlNsiState.columnDefs);

        if (result.itemsForForm.length > 0) {
            dispatch(ctrlNsiActions.setItemsForFormFull(result.itemsForForm)); //сохранение в стейт сформированных данных
            dispatch(ctrlNsiActions.setFormInitialValuesFull(result.formInitialValues)); //сохранение в стейт инициализационных данных для формика
            dispatch(ctrlNsiActions.setYupObjectFull(result.yupObject)); //сохранение в стейт объекта валидации формы
        };
    }, [
        ctrlNsiState.selectedScheme,
        ctrlNsiState.selectedRowInScheme,
        ctrlNsiState.dataSelectors,
        ctrlNsiState.columnDefs
    ]); //данные пересобираются каждый раз при выборе новой строки в таблице

    useEffect(() => {
        if (ctrlNsiState.selectedSchemeData.success) {
            dispatch(ctrlNsiActions.setRowData(tableHandler(ctrlNsiState.selectedScheme, ctrlNsiState.selectedSchemeData))); //формирование данных для отрисовки таблицы из данных по таблице и ее значениям
            dispatch(ctrlNsiActions.setIsTableLoading(false));
        }
    }, [ctrlNsiState.selectedScheme, ctrlNsiState.selectedSchemeData]); //данные пересобираются каждый раз при выборе новой таблицы в сайдере

    const onRowClickHandler = useCallback((selectedRow: any) => {
        //коллбэк на выбор конкретной строки в таблице
        dispatch(ctrlNsiActions.setSelectedRowInScheme(selectedRow)); //сохранение в стейт данных выбранной строки
    }, []);

    //modal window
    const [modalTitle, setModalTitle] = useState('');

    const createModalFormik = useAntdFormik({
        validateOnChange: false,
        initialValues: ctrlNsiState.formInitialValues,
        validationSchema: Yup.object(ctrlNsiState.yupObject),
        onSubmit: (values) => {
            let newValues = formNewValuesCreator(ctrlNsiState.formInitialValues, values);
            //единица в массиве это хардкод айдишника, что бы не спрашивать его у пользователя, так как бэк подставляет следующий по записи в бд
            !values.hasOwnProperty("ID") && !values.hasOwnProperty("Id") ? newValues.unshift(1) : null
            dispatch(
                createNewRowInSchemeDataTC({
                    table: ctrlNsiState.selectedScheme,
                    row: { values: newValues },
                }),
            );
        },
    });

    const updateModalFormik = useAntdFormik({
        validateOnChange: false,
        initialValues: ctrlNsiState.formInitialValuesFull,
        validationSchema: Yup.object(ctrlNsiState.yupObjectFull),
        onSubmit: (values) => {
            let newValues: any = [];
            for (let value in values) {
                newValues.push(values[value]);
            }
            dispatch(
                updateRowInSchemeDataTC({
                    table: ctrlNsiState.selectedScheme,
                    row: { values: formNewValuesCreator(ctrlNsiState.formInitialValuesFull, values) },
                }),
            );
        },
    });

    useEffect(() => {
        createModalFormik.setValues(ctrlNsiState.formInitialValues);
    }, [ctrlNsiState.formInitialValues]);

    useEffect(() => {
        updateModalFormik.setValues(ctrlNsiState.formInitialValuesFull);
    }, [ctrlNsiState.formInitialValuesFull]);

    useEffect(() => {
        createModalFormik.resetForm();
    }, [ctrlNsiState.isCreateModalVisible]);

    const isCreateModalVisibleHandler = useCallback(() => {
        dispatch(ctrlNsiActions.setIsCreateModalVisible(true));
    }, []);

    const isUpdateModalVisibleHandler = useCallback(() => {
        dispatch(ctrlNsiActions.setIsUpdateModalVisible(true));
    }, []);

    const isDeleteModalVisibleHandler = useCallback(() => {
        dispatch(ctrlNsiActions.setIsDeleteModalVisible(true));
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
        for (let [k, v] of Object.entries(ctrlNsiState.formInitialValuesFull)) {
            if (k === "ID" || k === "Id") {
                nullValues[k] = v
            } else {
                nullValues[k] = ""
            }
        }
        createModalFormik.setValues(ctrlNsiState.formInitialValues);
        updateModalFormik.setValues(nullValues);
    }, [ctrlNsiState.formInitialValues, ctrlNsiState.formInitialValuesFull]);

    const modalOnCancelHandler = useCallback(
        //коллбэк на кнопку закрытия модального окна
        () => {
            dispatch(ctrlNsiActions.setIsCreateModalVisible(false));
            dispatch(ctrlNsiActions.setIsUpdateModalVisible(false));
            dispatch(ctrlNsiActions.setIsDeleteModalVisible(false));
        },
        []
    );

    const modalOnDeletelHandler = useCallback(
        //коллбэк на сабмит в модальном окне удаления строки из таблицы
        (scheme: SchemeType) => {
            dispatch(deleteRowInSchemeDataTC({ rowId: ctrlNsiState.itemsForFormFull[0].value, scheme }));
        },
        [ctrlNsiState.itemsForFormFull]
    );

    return {
        history,
        ctrlNsiState,
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
    };
};

export default usePresenter;