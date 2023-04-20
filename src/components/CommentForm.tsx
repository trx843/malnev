import { message } from "antd";
import { Formik, FormikHelpers } from "formik";
import { Form, FormItem, Input, SubmitButton, Checkbox } from "formik-antd";
import React, { useState } from "react";
import { ActionsEnum, Can } from "../casl";
import { elementId, FailuresElements } from "../pages/Failures/constant";

interface IUseInReports {
  useInReports: boolean;
}

interface ICommentFormProps<T extends IUseInReports> {
  initial: T;
  submitCallback: (item: T) => Promise<void>;
  showUseInReports: boolean;
}

export function CommentForm<T extends IUseInReports>(
  props: ICommentFormProps<T>
) {
  const [useInReports, setUseInReports] = useState(props.initial.useInReports);

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Formik
        initialValues={props.initial}
        onSubmit={(data: T, helpers: FormikHelpers<T>) => {
          console.log(data);
          props
            .submitCallback(data)
            .then(() => helpers.setSubmitting(false))
            .catch((err) => {
              helpers.setSubmitting(false);
              message.error(err);
            });
        }}
      >
        {() => (
          <Form>
            {props.showUseInReports === true ? (
              <FormItem name="useInReports" label="Учитывать в отчетах">
                <Checkbox
                  onClick={() => {
                    setUseInReports(!useInReports);
                  }}
                  checked={useInReports}
                  value={useInReports}
                  name="useInReports"
                />
              </FormItem>
            ) : (
              <></>
            )}
            <FormItem name="comment" label="Комментарий">
              <Input.TextArea name="comment" />
            </FormItem>
            <Can
              I={ActionsEnum.Edit}
              a={elementId(
                FailuresElements[FailuresElements.FailureCommit]
              )}
            >
              <SubmitButton>Квитировать</SubmitButton>
            </Can>
          </Form>
        )}
      </Formik>
    </div>
  );
}
