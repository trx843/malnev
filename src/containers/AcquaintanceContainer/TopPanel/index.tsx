import { FC, useState } from "react";
import { Button, Card } from "antd";
import FilterFilled from "@ant-design/icons/lib/icons/FilterFilled";
import { ExportOutlined } from "@ant-design/icons";

import { AppliedAcquaintanceFilterTags } from "./AppliedAcquaintanceFilterTags";
import { ModalAcquaintanceFilters } from "./ModalAcquaintanceFilters";
import { AcquaintanceModalTypes } from "containers/AcquaintanceContainer/Modals/Provider/enums";
import { useModals } from "components/ModalProvider";
import { ActionsEnum, Can } from "../../../casl";
import { elementId, AcquaintanceElements } from "pages/PspControl/Acquaintance/constant";

export const TopPanel: FC = () => {
  const modal = useModals();
  const [visible, setVisibleModalFilter] = useState(false);

  const handleModal = () => {
    modal.setModal({
      type: AcquaintanceModalTypes.ExportModal,
      payload: {}
    });
  };

  return (
    <>
      <Card size="small">
        <Button
          type="link"
          icon={<FilterFilled />}
          onClick={() => setVisibleModalFilter(true)}
        >
          Раскрыть фильтр
        </Button>
        <AppliedAcquaintanceFilterTags />
      </Card>
      <Card className="acquaintance__top-export-card" size="small">
        <Can
          I={ActionsEnum.View}
          a={elementId(AcquaintanceElements[AcquaintanceElements.Export])}
        >
          <Button type="link" icon={<ExportOutlined />} onClick={handleModal}>
            Экспортировать
          </Button>
        </Can>
      </Card>
      <ModalAcquaintanceFilters
        visible={visible}
        onClose={() => setVisibleModalFilter(false)}
      />
    </>
  );
};
