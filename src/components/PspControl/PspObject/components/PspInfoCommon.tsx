import { FC } from "react";
import isEmpty from "lodash/isEmpty";

import { PspSystemControlTableObject } from "./system-control-table";
import { IPspObject } from "../types";
import { SiderPage } from "../../../SiderPage";

interface PspObjectProps {
  data?: IPspObject;
  id: string;
}

export const PspInfoCommon: FC<PspObjectProps> = ({ data, id }) => {
  return (
    <>
      <SiderPage title="Общая информация" loading={isEmpty(data)}>
        <SiderPage.Field name="Наименование ОСТ" field={data?.ostName} />
        <SiderPage.Field
          name="Наименование филиала ОСТ"
          field={data?.rnuName}
        />
        <SiderPage.Field name="Наименование ПСП" field={data?.pspFullName} />
        <SiderPage.Field name="Назначение ПСП" field={data?.pspPurpose} />
        <SiderPage.Field name="Владелец ПСП" field={data?.pspOwner} />
        <SiderPage.Field name="Собственный/сторонний ПСП" field={data?.pspOwned} />
        <SiderPage.Field
          name="Принадлежность ПСП к группе"
          field={data?.pspAffiliation}
        />
      </SiderPage>
      <PspSystemControlTableObject pspId={id} />
    </>
  );
};
