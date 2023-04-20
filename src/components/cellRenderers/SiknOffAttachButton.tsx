import {
  Button,
  Popover,
  Modal,
  message,
  Upload,
  Select,
  DatePicker,
} from "antd";
import React, { FunctionComponent, useState } from "react";
import PaperClipOutlined from "@ant-design/icons/PaperClipOutlined";
import { SiknOffItem } from "../../classes";
import UploadOutlined from "@ant-design/icons/UploadOutlined";
import { apiBase } from "../../utils";
import { Formik, FormikHelpers } from "formik";
import { Form, FormItem, Input, SubmitButton } from "formik-antd";
import styled from "styled-components";
import dayjs from "dayjs";
import { Moment } from "moment";
import "moment/locale/ru";
import locale from "antd/es/date-picker/locale/ru_RU";
import { TextGrayStyled } from "../../styles/commonStyledComponents";

interface AttachProps {
  data: SiknOffItem;
  submitCallback: (item: SiknOffItem) => Promise<void>;
  reDraw: () => void;
  setNewItem: (newItem: SiknOffItem) => SiknOffItem;
}

const { Option } = Select;

const UploadStyled = styled(Upload)`
  .ant-upload {
    width: 100%;
  }
`;

export const AttachButton: FunctionComponent<AttachProps> = (
  props: AttachProps
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(-1);
  const [item, setItem] = useState<SiknOffItem>(props.data);
  const [actUploadTS, setActUploadTS] = useState<Date | null>(null);
  const [actInvUploadTS, setActInvUploadTS] = useState<Date | null>(null);

  const MenuModal = (content: JSX.Element) => (
    <Modal
      maskClosable={false}
      visible={modalVisible}
      destroyOnClose
      footer={null}
      title={titles[index]}
      onCancel={() => {
        setModalVisible(false);
        setIndex(-1);
        props.reDraw();
      }}
    >
      {content}
    </Modal>
  );

  const ActUpload = (_item: SiknOffItem) => {
    let now = new Date();

    const uploadOpts = {
      name: "file",
      action: `${apiBase}/siknoff/${props.data.id}/LoadActFile?timestamp=${
        actUploadTS == null
          ? dayjs(now).format("YYYY-MM-DDTHH:mm:ss")
          : dayjs(actUploadTS).format("YYYY-MM-DDTHH:mm:ss")
      }`,

      withCredentials: true,
      onChange(info: any) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success({
            content: `${info.file.name} файл импортирован.`,
            key: "act",
          });
          let newItem = info.file.response.result as SiknOffItem;
          setItem(props.setNewItem(newItem));
          setActUploadTS(null);
          setModalVisible(false);
          props.reDraw();
        } else if (info.file.status === "error") {
          message.error({
            content: `${info.file.name} файл не загружен на сервер.`,
            key: "act",
          });
        }
      },
    };

    const onChange = (value: Moment, dateString: string) => {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
      setActUploadTS(value?.toDate());
    };

    const onOk = (value: any) => {
      console.log("onOk: ", value);
      setActUploadTS(value?.toDate());
    };

    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <TextGrayStyled>
          Дата создания акта (если отличается от текущей)
        </TextGrayStyled>
        <DatePicker
          style={{ width: "100%", marginBottom: "10px" }}
          locale={locale}
          showTime
          onChange={onChange}
          onOk={onOk}
        />
        <UploadStyled {...uploadOpts}>
          <Button style={{ width: "100%" }} icon={<UploadOutlined />}>
            Загрузить
          </Button>
        </UploadStyled>
      </div>
    );
  };

  const InvestigateActUpload = (_item: SiknOffItem) => {
    let now = new Date();

    const uploadOpts = {
      name: "file",
      action: `${apiBase}/siknoff/${
        props.data.id
      }/LoadInvestigateActFile?timestamp=${
        actInvUploadTS == null
          ? dayjs(now).format("YYYY-MM-DDTHH:mm:ss")
          : dayjs(actInvUploadTS).format("YYYY-MM-DDTHH:mm:ss")
      }`,
      withCredentials: true,
      onChange(info: any) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success({
            content: `${info.file.name} файл импортирован.`,
            key: "invAct",
          });
          let newItem = info.file.response.result as SiknOffItem;
          setItem(props.setNewItem(newItem));
          setActInvUploadTS(null);
          setModalVisible(false);
          props.reDraw();
        } else if (info.file.status === "error") {
          message.error({
            content: `${info.file.name} файл не загружен на сервер.`,
            key: "invAct",
          });
        }
      },
    };

    const onChange = (value: Moment, dateString: string) => {
      console.log("Selected Time: ", value);
      console.log("Formatted Selected Time: ", dateString);
      setActInvUploadTS(value?.toDate());
    };

    const onOk = (value: any) => {
      console.log("onOk: ", value);
      setActInvUploadTS(value?.toDate());
    };

    return (
      <div style={{ width: "100%", margin: "auto", alignContent: "center" }}>
        <TextGrayStyled>
          Дата создания акта (если отличается от текущей)
        </TextGrayStyled>
        <DatePicker
          style={{ width: "100%", marginBottom: "10px" }}
          locale={locale}
          showTime
          onChange={onChange}
          onOk={onOk}
        />
        <UploadStyled {...uploadOpts}>
          <Button style={{ width: "100%" }} icon={<UploadOutlined />}>
            Загрузить
          </Button>
        </UploadStyled>
      </div>
    );
  };

  const AddActReference = (item: SiknOffItem) => (
    <div style={{ width: "100%", margin: "auto" }}>
      <Formik
        initialValues={item}
        onSubmit={(data: SiknOffItem, helpers: FormikHelpers<SiknOffItem>) => {
          props.submitCallback(data).then(() => {
            helpers.setSubmitting(false);
            setModalVisible(false);
            setIndex(-1);
            setItem(data);
            props.reDraw();
          });
        }}
      >
        {() => (
          <Form layout={"vertical"}>
            <FormItem name="actReference" label="Ссылка на акт отключения">
              <Input name="actReference" />
            </FormItem>
            <SubmitButton>Добавить</SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  );

  const AddInvestigateActReference = (item: SiknOffItem) => (
    <div style={{ width: "100%", margin: "auto" }}>
      <Formik
        initialValues={item}
        onSubmit={(data: SiknOffItem, helpers: FormikHelpers<SiknOffItem>) => {
          props.submitCallback(data).then(() => {
            helpers.setSubmitting(false);
            setModalVisible(false);
            setIndex(-1);
            setItem(data);
            props.reDraw();
          });
        }}
      >
        {() => (
          <Form layout={"vertical"}>
            <FormItem
              name="investigateActReference"
              label="Ссылка на акт расследования"
            >
              <Input name="investigateActReference" />
            </FormItem>
            <SubmitButton>Добавить</SubmitButton>
          </Form>
        )}
      </Formik>
    </div>
  );

  const contents = [
    ActUpload,
    InvestigateActUpload,
    AddActReference,
    AddInvestigateActReference,
  ];
  const titles = [
    "Добавить акт отключения",
    "Добавить акт расследования",
    "Добавить ссылку на акт отключения",
    "Добавить ссылку на акт расследования",
  ];

  const content: JSX.Element = (
    <div>
      {titles.map((title, i) => (
        <div style={{ display: "flex" }}>
          <Button
            style={{ width: "100%", textAlign: "start", marginBottom: 8 }}
            type={"text"}
            onClick={() => {
              setIndex(i);
              setModalVisible(true);
            }}
          >
            {title}
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Popover
        title={`Прикрепить для ` + props.data.siknFullName}
        arrowPointAtCenter
        content={content}
        trigger="hover"
        placement="bottomRight"
      >
        <Button
          type={"link"}
          style={{ width: "100%" }}
          icon={<PaperClipOutlined />}
        />
      </Popover>
      {index > -1 && MenuModal(contents[index](item))}
    </div>
  );
};
