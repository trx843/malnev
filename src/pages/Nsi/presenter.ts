import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { useEffect } from "react";
import {
    NsiStateType,
    nsi,
    nsiActions,
} from "../../slices/nsi";
import { SchemeType } from "../../api/params/nsi-page.params";
import {
    createNewRowInSchemeDataTC,
    deleteRowInSchemeDataTC,
    getAllSchemesTC,
    getDataSelectorsTC,
    getSchemeDataTC,
    updateRowInSchemeDataTC
} from "../../thunks/nsiPage";
import { useAntdFormik } from "customHooks/useAntdFormik";
import * as Yup from "yup";
import { createFormHalper, formNewValuesCreator, tableHandler, updateFormHelper } from "./utils";

const usePresenter = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const nsiState: NsiStateType = useSelector(nsi);

    //sider
    useEffect(() => {
        dispatch(getAllSchemesTC()); //получение всех возможных таблиц для страницы нси

        return () => {
            dispatch(nsiActions.clearState()); //зачистка стейта после ухода со страницы нси
        };
    }, []);

    const onClickSiderHandler = useCallback((selectedScheme: SchemeType) => {
        //коллбэк на выбор конкретной таблицы в выпадающем меню
        dispatch(nsiActions.setIsTableLoading(true));
        dispatch(nsiActions.setSelectedScheme(selectedScheme)); //сохранение в стейт выбранной таблицы
        dispatch(nsiActions.setColumnDefs(selectedScheme)); //подготовка и сохранение данных в стейт по колонкам выбранной таблицы
        dispatch(getSchemeDataTC(selectedScheme)); //получение данных для выбранной таблице
        dispatch(getDataSelectorsTC(selectedScheme)); //получение селекторов данных для полей в модальных окнах
        dispatch(nsiActions.setSelectedRowInScheme({})); //задаем выбранной строке нулевой параметр
    }, []);

    //table
    useEffect(() => {
        const result = createFormHalper(nsiState.selectedScheme, nsiState.columnDefs);

        if (result.itemsForForm.length > 0) {
            dispatch(nsiActions.setItemsForForm(result.itemsForForm)); //сохранение в стейт сформированных данных
            dispatch(nsiActions.setFormInitialValues(result.formInitialValues)); //сохранение в стейт инициализационных данных для формика
            //сохранение в стейт объекта валидации формы, сформированный хэлпером из утилсов
            dispatch(nsiActions.setYupObject(result.yupObject));
        }
    }, [nsiState.selectedScheme, nsiState.columnDefs]); //данные пересобираются каждый раз при выборе новой таблицы

    useEffect(() => {
        const result = updateFormHelper(nsiState.selectedScheme, nsiState.selectedRowInScheme, nsiState.dataSelectors, nsiState.columnDefs);

        if (result.itemsForForm.length > 0) {
            dispatch(nsiActions.setItemsForFormFull(result.itemsForForm)); //сохранение в стейт сформированных данных
            dispatch(nsiActions.setFormInitialValuesFull(result.formInitialValues)); //сохранение в стейт инициализационных данных для формика
            //сохранение в стейт объекта валидации формы
            dispatch(nsiActions.setYupObjectFull(result.yupObject));
        };
    }, [
        nsiState.selectedScheme,
        nsiState.selectedRowInScheme,
        nsiState.dataSelectors,
        nsiState.columnDefs
    ]); //данные пересобираются каждый раз при выборе новой строки в таблице

    useEffect(() => {
        if (nsiState.selectedSchemeData.success) {
            dispatch(nsiActions.setRowData(tableHandler(nsiState.selectedScheme, nsiState.selectedSchemeData))); //формирование данных для отрисовки таблицы из данных по таблице и ее значениям
            dispatch(nsiActions.setIsTableLoading(false));
        }
    }, [nsiState.selectedSchemeData]); //данные пересобираются каждый раз при выборе новой таблицы в сайдере

    const onRowClickHandler = useCallback((selectedRow: any) => {
        //коллбэк на выбор конкретной строки в таблице
        dispatch(nsiActions.setSelectedRowInScheme(selectedRow)); //сохранение в стейт данных выбранной строки
    }, []);

    //modal window
    const [modalTitle, setModalTitle] = useState('');

    const createModalFormik = useAntdFormik({
        validateOnChange: false,
        initialValues: nsiState.formInitialValues,
        validationSchema: Yup.object(nsiState.yupObject),
        onSubmit: (values) => {
            let newValues = formNewValuesCreator(nsiState.formInitialValues, values);
            //единица в массиве это хардкод айдишника, что бы не спрашивать его у пользователя, так как бэк подставляет следующий по записи в бд
            !values.hasOwnProperty("ID") && !values.hasOwnProperty("Id") ? newValues.unshift(1) : null
            dispatch(
                createNewRowInSchemeDataTC({
                    table: nsiState.selectedScheme,
                    row: { values: newValues },
                }),
            );
        },
    });

    const updateModalFormik = useAntdFormik({
        validateOnChange: false,
        initialValues: nsiState.formInitialValuesFull,
        validationSchema: Yup.object(nsiState.yupObjectFull),
        onSubmit: (values) => {
            dispatch(
                updateRowInSchemeDataTC({
                    table: nsiState.selectedScheme,
                    row: { values: formNewValuesCreator(nsiState.formInitialValuesFull, values) },
                }),
            );
        },
    });

    useEffect(() => {
        createModalFormik.setValues(nsiState.formInitialValues);
    }, [nsiState.formInitialValues]);

    useEffect(() => {
        updateModalFormik.setValues(nsiState.formInitialValuesFull);
    }, [nsiState.formInitialValuesFull]);

    useEffect(() => {
        createModalFormik.resetForm();
    }, [nsiState.isCreateModalVisible]);

    const isCreateModalVisibleHandler = useCallback(() => {
        dispatch(nsiActions.setIsCreateModalVisible(true));
    }, []);

    const isUpdateModalVisibleHandler = useCallback(() => {
        dispatch(nsiActions.setIsUpdateModalVisible(true));
    }, []);

    const isDeleteModalVisibleHandler = useCallback(() => {
        dispatch(nsiActions.setIsDeleteModalVisible(true));
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
        for (let [k, v] of Object.entries(nsiState.formInitialValuesFull)) {
            if (k === "ID" || k === "Id") {
                nullValues[k] = v
            } else {
                nullValues[k] = ""
            }
        }
        createModalFormik.setValues(nsiState.formInitialValues);
        updateModalFormik.setValues(nullValues);
    }, [nsiState.formInitialValues, nsiState.formInitialValuesFull]);

    const modalOnCancelHandler = useCallback(
        //коллбэк на кнопку закрытия модального окна
        () => {
            dispatch(nsiActions.setIsCreateModalVisible(false));
            dispatch(nsiActions.setIsUpdateModalVisible(false));
            dispatch(nsiActions.setIsDeleteModalVisible(false));
        },
        []
    );

    const modalOnDeletelHandler = useCallback(
        //коллбэк на сабмит в модальном окне удаления строки из таблицы
        (scheme: SchemeType) => {
            dispatch(deleteRowInSchemeDataTC({ rowId: nsiState.itemsForFormFull[0].value, scheme }));
        },
        [nsiState.itemsForFormFull]
    );

    return {
        history,
        nsiState,
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