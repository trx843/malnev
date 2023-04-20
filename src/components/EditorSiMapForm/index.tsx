import { Formik, FormikHelpers } from "formik";
import { FC, useEffect, useState } from "react";
import { Form, SubmitButton } from "formik-antd";
import { EditorSiMapItem, TechPositions } from "../../classes";
import { message, Row, Skeleton, Steps, Button, Divider } from "antd";
import { SelectedNode } from "../../interfaces";
import { SelectSi } from "./SelectSi";
import { SelectDate } from "./SelectDate";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { useDispatch, useSelector } from "react-redux";
import {
  checkPseudonimsTC,
  getObjectAffectedInfoTC,
  getSiequipmentsbySiTypeTC,
  getTechPosInfoTC,
} from "../../thunks/siequipmentPage";
import {
  setLastBinding,
  setNewSi,
  setOldSi,
  setPseudonimsIsOkFlag,
  setTechPosition,
  SiequipmentsStateType,
} from "../../slices/siequipment";
import { StateType } from "../../types";
import { zeroGuid } from "../../utils";
import { ObjectAffectedInfo } from "./ObjectAffectedInfo";
import { Alias } from "./Alias";
import moment from "moment";

interface IEditorSiMapFormProps {
  initial?: EditorSiMapItem;
  submitCallback: (item: EditorSiMapItem) => Promise<EditorSiMapItem>;
  node: SelectedNode;
}

const { Step } = Steps;

type Step = {
  title: string;
  content: JSX.Element | string;
};

export const EditorSiMapForm: FC<IEditorSiMapFormProps> = ({
  initial,
  submitCallback,
  node,
}) => {
  const dispatch = useDispatch();

  const {
    newSi,
    isInstallSi,
    techPosition,
    modalIsLoading,
    lastBinding,
    isBtnLoading,
    oldSi,
    pseudonimsIsOkFlag,
  } = useSelector<StateType, SiequipmentsStateType>(
    (state) => state.siequipment
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<EditorSiMapItem>(
    initial ?? EditorSiMapItem.Default()
  );
  const [formData, setFormData] = useState<EditorSiMapItem | null>(null);
  const [helpers, setHelpers] = useState<FormikHelpers<EditorSiMapItem> | null>(
    null
  );

  const steps: Step[] = [
    {
      title: "Выбор СИ",
      content: <SelectSi isEditForm={!!initial} />,
    },
    {
      title: "Выбор даты",
      content: <SelectDate isEditForm={!!initial} values={values} />,
    },
  ];

  if (techPosition.siTypeId !== 27 && techPosition.siTypeId !== 23)
    steps.push({
      title: "Информация о затрагриваемых объектах",
      content: <ObjectAffectedInfo />,
    });
  steps.push({
    title: "Псевдоним",
    content: <Alias values={values} />,
  });

  const next = () => {
    if (currentStep === 1 && oldSi && newSi) {
      dispatch(
        getObjectAffectedInfoTC({
          oldSiId: oldSi.id,
          newSiId: newSi.id,
          oldSiDescription: oldSi.siCompName,
          newSiDescription: newSi.siCompName,
        })
      );
    }
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    if (!initial) {
      dispatch(getTechPosInfoTC({ techPosId: node.nodeId }));
      dispatch(setNewSi());
    } else {
      dispatch(setTechPosition(initial.techPositions));
      dispatch(setOldSi(initial.techPositions.siEquipment));
      dispatch(setNewSi(initial.techPositions.siEquipment));
      dispatch(setLastBinding(initial.prevBinding));
    }
  }, [initial]);

  useEffect(() => {
    if (techPosition.siTypeId !== undefined && techPosition.siTypeId !== null) {
      dispatch(getSiequipmentsbySiTypeTC({ siTypeId: techPosition.siTypeId }));
    }
  }, [techPosition]);

  useEffect(() => {
    return () => {
      dispatch(setTechPosition({} as TechPositions));
    };
  }, []);

  useEffect(() => {
    if (pseudonimsIsOkFlag) {
      dispatch(setPseudonimsIsOkFlag(false));
      formData &&
        submitCallback(formData)
          .then(() => {
            helpers && helpers.setSubmitting(false);
          })
          .catch((err) => {
            helpers && helpers.setSubmitting(false);
            message.error(err);
          });
    }
  }, [pseudonimsIsOkFlag]);

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <Formik
        initialValues={initial ?? EditorSiMapItem.Default()}
        onSubmit={(
          data: EditorSiMapItem,
          helpers: FormikHelpers<EditorSiMapItem>
        ) => {
          if (newSi || !isInstallSi) {
            data.techPosId = techPosition.id;
            data.siId = newSi ? newSi.id : zeroGuid;
            data.prevBinding = lastBinding;
            data.isInstallSi = isInstallSi;
            data.siTypeId = techPosition.siTypeId;
            setFormData(data);
            setHelpers(helpers);
            if (data.needToSaveSiDescription) {
              dispatch(
                checkPseudonimsTC({
                  techPositionId: techPosition.id,
                  inputPseudonims: data.siDecriptionList,
                  effectiveFrom: moment(data.effectiveFrom).format(
                    "YYYY-MM-DD HH:mm"
                  ),
                  bindingId: data.id,
                })
              );
            } else {
              data &&
                submitCallback(data)
                  .then(() => helpers.setSubmitting(false))
                  .catch((err) => {
                    helpers.setSubmitting(false);
                    message.error(err);
                  });
            }
          } else {
            message.error("Средство измерения не выбрано");
          }
        }}
      >
        {(values) => {
          useEffect(() => {
            let updatedValues = { ...values.values };
            if (updatedValues.siDecriptionList.length === 0) {
              updatedValues.siDecriptionList.push("");
            }
            setValues(updatedValues);
          }, [values.values]);

          return (
            <>
              {modalIsLoading ? (
                <div className="mx-auto my-auto">
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                </div>
              ) : (
                <Layout>
                  <Sider theme="light" width={240}>
                    <Steps
                      current={currentStep}
                      direction="vertical"
                      size="small"
                    >
                      {steps.map((s) => (
                        <Step key={s.title} title={s.title} />
                      ))}
                    </Steps>
                  </Sider>
                  <Layout>
                    <Content
                      style={{
                        background: "#ffffff",
                        padding: "0px",
                        paddingLeft: "24px",
                        minHeight: 600,
                      }}
                    >
                      <Form layout="vertical">
                        <div style={{ minHeight: "500px" }}>
                          {steps[currentStep].content}
                        </div>
                        <Divider />
                        <Footer
                          style={{ background: "#FFFFFF", paddingRight: 0 }}
                        >
                          <Row justify="end" align="bottom">
                            {currentStep == 0 &&
                              (initial || !!newSi || !isInstallSi) && (
                                <Button
                                  type="primary"
                                  style={{
                                    background: "#1890FF",
                                    color: "#FFFFFF",
                                  }}
                                  onClick={() => next()}
                                  loading={isBtnLoading}
                                >
                                  Далее
                                </Button>
                              )}
                            {currentStep > 0 && (
                              <Button
                                type="link"
                                onClick={() => prev()}
                                disabled={isBtnLoading}
                              >
                                Назад
                              </Button>
                            )}
                            {currentStep < steps.length - 1 && currentStep > 0 && (
                              <Button
                                type="primary"
                                style={{
                                  background: "#1890FF",
                                  color: "#FFFFFF",
                                }}
                                onClick={() => next()}
                              >
                                Далее
                              </Button>
                            )}
                            {currentStep === steps.length - 1 && (
                              <>
                                <SubmitButton
                                  style={{
                                    background: "#219653",
                                    color: "#FFFFFF",
                                  }}
                                  loading={isBtnLoading}
                                >
                                  Сохранить
                                </SubmitButton>
                              </>
                            )}
                          </Row>
                        </Footer>
                      </Form>
                    </Content>
                  </Layout>
                </Layout>
              )}
            </>
          );
        }}
      </Formik>
    </div>
  );
};
