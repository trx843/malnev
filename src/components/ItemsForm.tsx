import React, { Component, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormItem, SubmitButton, Checkbox, DatePicker, Input, InputNumber, Select } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import { IConstructor, IErrorRecord, IObjectField, ItemsState, ITitem, NamedEntity } from '../interfaces';
import { StateType } from '../types';
import axios from 'axios';
import { PspItem } from '../classes/PspItem';
import { date } from 'yup';
import { apiBase } from '../utils';
import { FormGroup } from 'react-bootstrap';
import { MtItem } from '../classes/MtItem';

interface ItemsFormState {
    formItems: Array<JSX.Element>;
}

interface ItemsFormProps<T extends object> {
    reducer: keyof StateType;
    action: "add" | "edit";
    submitCallback: (item: T) => void;
    closeForm: () => void;
    initialValues?: T;
}

export function ItemsForm<T extends object>(props: ItemsFormProps<T>): JSX.Element {
    const sliced = (state: StateType): ItemsState<T> => state[props.reducer] as unknown as ItemsState<T>;

    const fields = useSelector<StateType, Array<IObjectField<T>>>(state => sliced(state).fields);
    const hiddenFields = useSelector<StateType, Array<keyof T>>(state => sliced(state).hiddenProps);
    const itemConstructor = useSelector<StateType, IConstructor<T>>(state => sliced(state).itemConstructor);

    const item: T = props.initialValues === undefined ? new itemConstructor() : props.initialValues;
    
    const submit = (values: T, actions: FormikHelpers<T>) => {
        props.submitCallback(values);
        actions.setSubmitting(false);
    };

    const mapTypeToFormItem = (type: string) => {
        switch (type) {
            case 'string':
                return Input;
            case 'number':
                return InputNumber;
            case 'Date':
                return DatePicker;
            case 'boolean':
                return Checkbox;
            default:
                return Input;
        }
    }

    const createAntField = (label: string, name: keyof T, AntComponent: any) => {
        return (
            <div className="field-container">
                <FormItem
                    name={name as string}
                    label={label}
                    hidden={hiddenFields.includes(name)}>
                    <AntComponent name={name as string} />
                </FormItem>
            </div>
        );
    }

    const [fieldsJsx, setFieldsJsx] = useState<Array<JSX.Element>>([]);

    useEffect(() => {
        const generateFormFields = async () => {
            let fieldsData = await Promise.all(
                fields
                    .map(async f => {
                        if (f.apiquery !== undefined) {
                            const result = await axios.get<Array<NamedEntity>>(f.apiquery);
                            return {
                                field: f,
                                items: result.data
                            };
                        } else return Promise.resolve({ field: f, items: [] });
                    })
            );
            setFieldsJsx(fieldsData.map(elem => {
                if (elem.field.apiquery !== undefined) {
                    const path = elem.field.idProp ?? elem.field.field as string
                    return (
                        <div className="field-container">
                            <FormItem
                                name={path}
                                label={elem.field.description as string}>
                                <Select name={path}>
                                    {elem.items.map(x => <Select.Option value={x.id}>{x[elem.field.propName as string]}</Select.Option>)}
                                </Select>
                            </FormItem>
                        </div>
                    );
                } else return createAntField(elem.field.description as string, elem.field.field, mapTypeToFormItem(elem.field.type));
            }));
        };
        generateFormFields();
    }, []);

    return (
        <div style={{ width: 400, margin: "auto" }}>
            <Formik
                initialValues={item}
                onSubmit={submit}
                /*validationSchema={vSchema}*/ >
                {() =>
                    <Form>
                        {fieldsJsx}
                        <div style={{ display: "inline-flex" }}>
                            <SubmitButton loading={(
                                () => {
                                    switch (props.action) {
                                        case "add":
                                            return useSelector<StateType, boolean>(state => sliced(state).insert.isInserting);
                                        case "edit":
                                            return useSelector<StateType, boolean>(state => sliced(state).update.isUpdating);
                                    }
                                }
                            )()}>Ок</SubmitButton>
                            {(
                                () => {
                                    let err: IErrorRecord | null = null;
                                    switch (props.action) {
                                        case "add":
                                            err = useSelector<StateType, IErrorRecord | null>(state => sliced(state).insert.insertError);
                                            break;
                                        case "edit":
                                            err = useSelector<StateType, IErrorRecord | null>(state => sliced(state).update.updateError);
                                            break;
                                    };
                                    if (err !== null) {
                                        return (
                                            <div className="text-danger" style={{ paddingLeft: "25px" }}>{`Во время отправки произошла ошибка: ${err.message}`}</div>
                                        );
                                    }
                                    return (<></>);
                                }
                            )()}
                        </div>
                    </Form>
                }
            </Formik>
        </div >
    );
} 