import React, { FC } from "react";

import { TopPanel } from "./TopPanel";
import { AcquaintanceTable } from "./Table";
import { FilterSider } from "./FilterSlider";
import { AcquaintanceModals } from "./Modals";
import { ModalProvider } from "components/ModalProvider";

import "./styles.css";

export const AcquaintanceContainer: FC = () => {
  return (
    <ModalProvider>
      <FilterSider />
      <div className="acquaintance__table-container">
        <TopPanel />
        <AcquaintanceTable />
      </div>
      <AcquaintanceModals />
    </ModalProvider>
  );
};
