import { Col, Modal, Row } from 'antd';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OperandNode } from '../../../customHooks/useNodeTableData';
import { setSelectedOperandNode } from '../../../slices/algorithmStatus/settings';
import { StateType } from '../../../types';
import { Formik, FormikHelpers } from 'formik';
import { FormItem, Input, Form, SubmitButton } from 'formik-antd';
import * as Yup from 'yup';
import {
  AlgInputTypes,
  AlgSetPointConfigItem,
} from '../../../api/responses/get-algorithm-tree.response';
import { PostSetPointsParams } from '../../../api/params/post-set-points.params';
import { WithLoading } from '../../shared/WithLoading';
import { Typography } from 'antd';
import { ActionsEnum, Can } from '../../../casl';
import { AlgorithmStatusElements, elementId } from '../../../pages/AlgorithmStatus/constant';

const { Title } = Typography;

interface IProps {
  onSubmit: (item: PostSetPointsParams, id: string) => Promise<void>;
}

interface SettingsForm {
  [key: string]: any;
}

const renderFormField = (item: AlgSetPointConfigItem) => {
  return (
    <FormItem name={item.id} label={item.name} key={item.id}>
      <Input name={item.id} addonAfter={item.uom} type={AlgInputTypes[item.type] || AlgInputTypes.Input}  {...(AlgInputTypes[item.type] === "checkbox" && { defaultChecked: item.value })} />
    </FormItem>
  );
};

const returnInitialValues = (items?: AlgSetPointConfigItem[]): SettingsForm => {
  if (!items) return {};
  const initialValues: SettingsForm = {};

  items.forEach((item) => (initialValues[item.id] = item.value));
  return initialValues;
};

export const SettingsEditModal: FC<IProps> = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const selectedOperandNode = useSelector<StateType, OperandNode | null>(
    (state) => state.settings.selectedOperandNode
  );
  const isFormLoading = useSelector<StateType, boolean>(
    (state) => state.settings.isFormLoading
  );

  const onModalDestroy = () => {
    dispatch(setSelectedOperandNode(null));
  };

  const handleSubmit = async (
    data: SettingsForm,
    helpers: FormikHelpers<SettingsForm>
  ) => {
    if (!selectedOperandNode) return undefined;

    const params: PostSetPointsParams = {
      elementId: selectedOperandNode?.id.split('@')[0],
      setPoints: [],
    };

    Object.entries(data).forEach(([key, value]) => {
      params.setPoints.push({
        id: key,
        value: value,
      });
    });
    await onSubmit(params, selectedOperandNode?.algorithm);
    return helpers.setSubmitting(false);
  };

  return (
    <Modal
      visible={!!selectedOperandNode}
      onCancel={onModalDestroy}
      title={selectedOperandNode?.algorithmName}
      footer={''}
      destroyOnClose
    >
      <Title level={5}>Путь: {selectedOperandNode?.node}</Title>
      <Formik
        initialValues={returnInitialValues(selectedOperandNode?.algSetPointConfig)}
        onSubmit={(data: SettingsForm, helpers: FormikHelpers<SettingsForm>) => {
          handleSubmit(data, helpers);
        }}
      >
        {() => (
          <Form layout='vertical'>
            <WithLoading isLoading={isFormLoading}>
              <>
                {selectedOperandNode?.algSetPointConfig?.map((item) =>
                  renderFormField(item)
                )}
              </>
            </WithLoading>

            <Row justify='end'>
              <Col offset={1}>
                <Can
                  I={ActionsEnum.Edit}
                  a={elementId(
                    AlgorithmStatusElements[AlgorithmStatusElements.EditSettings]
                  )}
                >
                  <SubmitButton>Сохранить</SubmitButton>
                </Can>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
