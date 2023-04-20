import { FC } from "react";

import { SiderPage } from "../../../../SiderPage";
import { getFormatDate } from "../../helpers";
import { VerificationPage } from "../../../../../slices/verificationActs/verificationAct/types";
import "./style.css";
import { Link } from "react-router-dom";
import Typography from "antd/lib/typography";

interface CommonInfoSiderProps {
  loading?: boolean;
  data?: VerificationPage | null;
}

export const CommonInfoSider: FC<CommonInfoSiderProps> = ({
  loading,
  data,
}) => {

  return (
    <SiderPage title="" loading={loading}>
      <SiderPage.Field
        name="Дата создания"
        field={getFormatDate(data?.createdOn)}
      />
      <SiderPage.Field
        name="Дата проведения"
        field={getFormatDate(data?.verificatedOn)}
      />
      <SiderPage.Field
        name="Место проведения"
        field={data?.verificationPlace}
      />
      <SiderPage.Field
        name="Дата подготовки плана мероприятия"
        field={getFormatDate(data?.preparedOn)}
      />
      {data?.isVisibilityInspection && (
        <SiderPage.Field name="Тип поверки" field={data?.inspectedType} />
      )}
      <SiderPage.Field
        name="График проверки"
        component={
          data?.verificationSchedulesId
            ? <Link
              to={`/pspcontrol/verification-schedule/${data?.verificationSchedulesId}`}
            >
              <Typography.Text>{data?.verificationShedulesText}</Typography.Text>
            </Link>
            : <Typography.Text>{data?.verificationShedulesText}</Typography.Text>
        }
      />
      <SiderPage.Field
        name="План мероприятий"
        component={
          data?.verificationPlanId
            ? <Link
              to={`/pspcontrol/action-plans/cards/${data?.verificationPlanId}`}
            >
              <Typography.Text>{data?.verificationPlanText}</Typography.Text>
            </Link>
            : "Н/Д"
        }
      />
      <SiderPage.Field name="Наименование ОСТ" field={data?.ostName} />
      <SiderPage.Field name="Наименование филиала ОСТ" field={data?.filial} />
      <SiderPage.Field name="Наименование ПСП" field={data?.psp} />
      <SiderPage.Field name="Владелец ПСП" field={data?.pspOwner} />
      <SiderPage.Field name="Собственный/сторонний" field={data?.pspOwned} />
    </SiderPage>
  );
};
