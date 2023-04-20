import { Button, Col, Layout, Modal, Row, Tabs } from "antd";
import Title from "antd/lib/typography/Title";
import React, { FC, useContext, useState } from "react";
import { AbilityContext, ActionsEnum, Can } from "../../casl";
import { CaslDemoRedirect, CaslDemoRoute, Elements } from "./constants";
import { Formik, FormikHelpers } from "formik";
import { FormItem, Input, Form, SubmitButton } from "formik-antd";
import * as Yup from "yup";
import { history } from "../../history/history";
import { Route, Switch } from "react-router-dom";
import { RiskSettings } from "../../pages/RiskSettings";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

const elementId = (name: string): string => `${CaslDemoRoute}${name}`;

interface IProps {
  onMockChange: (mockName: "mockCaslConf1" | "mockCaslConf2") => void;
}

export const CaslDemoComponent: FC<IProps> = ({ onMockChange }) => {
  const ability = useContext(AbilityContext);

  const [isOpen, setIsOpen] = useState(false);

  //пример определения правил валидации в зависимости от роли пользователя
  const returnValidationSchema = () => {
    const defaultConfig = {
      field: Yup.string().required("Поле обязательно к заполнению!")
    };
    if (ability.can(ActionsEnum.View, Elements.HiddenFormField)) {
      return Yup.object({
        ...defaultConfig,
        hiddenField: Yup.string().required("Поле обязательно к заполнению!")
      });
    }
    return Yup.object(defaultConfig);
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider width={450} style={{ background: "white", overflowY: "scroll" }}>
        <div style={{ padding: 16 }}>
          <Title level={4}>Switch role</Title>
        </div>
        <div
          style={{
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            height: "140px",
            justifyContent: "space-between"
          }}
        >
          <Button onClick={() => onMockChange("mockCaslConf1")}>role 1</Button>
          <Button onClick={() => onMockChange("mockCaslConf2")}>role 2</Button>
          <Button onClick={() => history.push(CaslDemoRedirect)}>
            Redirect
          </Button>

          <Switch>
            {/* route example */}
            <Can I={ActionsEnum.Go} a={CaslDemoRedirect}>
              <Route path={CaslDemoRedirect} component={RiskSettings} />
            </Can>
          </Switch>
        </div>
      </Sider>

      <Content
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          padding: "10px"
        }}
      >
        <Row>
          <Col span={6}>
            {/* пример скрытия кнопки в зависимости от роли */}
            <Can I={ActionsEnum.View} a={elementId(Elements.OpenModal)}>
              <Button onClick={() => setIsOpen(!isOpen)}>Open modal</Button>
            </Can>
          </Col>

          <Col span={6}>
            <Can
              I={ActionsEnum.View}
              a={elementId(Elements.UploadButtonReportOn)}
            >
              <Button>Hidden Button</Button>
            </Can>
          </Col>

          <Col span={6}>
            <Button>Static</Button>
          </Col>
        </Row>

        <Tabs
          size={"small"}
          defaultActiveKey="algorithm"
          style={{ height: "100%", marginTop: "10px" }}
          className="algorithm__tabs"
        >
          <TabPane key="tab1" tab="Tab1" style={{ height: "100%" }}>
            Tab1
          </TabPane>

          <TabPane key="tab2" tab="Tab2" style={{ height: "100%" }}>
            Tab2
          </TabPane>
          <TabPane
            key="hiddenTab"
            tab="HiddenTab"
            disabled={ability.cannot(
              ActionsEnum.View,
              elementId(Elements.HiddenTab)
            )}
          >
            HiddenTab
          </TabPane>
        </Tabs>

        <Modal visible={isOpen} footer={""} onCancel={() => setIsOpen(!isOpen)}>
          <Formik
            initialValues={{
              field: "initial value",
              hiddenField: "hiddenField"
            }}
            onSubmit={(data: any, helpers: FormikHelpers<any>) => {
              helpers.setSubmitting(false);
            }}
            validationSchema={returnValidationSchema()}
          >
            {() => (
              <Form layout="vertical">
                <FormItem name="field" label="Field" key="field">
                  <Input
                    name="field"
                    // пример отключения кнопки в зависимости от роли
                    disabled={ability.cannot(
                      ActionsEnum.Edit,
                      elementId(Elements.MockModal)
                    )}
                  />
                  <Can
                    I={ActionsEnum.View}
                    a={elementId(Elements.HiddenFormField)}
                  >
                    <Input name="hiddenField" style={{ marginTop: "5px" }} />
                  </Can>
                </FormItem>

                <Row justify="end">
                  <Col offset={1}>
                    <Can I={ActionsEnum.Edit} a={elementId(Elements.MockModal)}>
                      <SubmitButton>Сохранить</SubmitButton>
                    </Can>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal>
      </Content>
    </Layout>
  );
};
