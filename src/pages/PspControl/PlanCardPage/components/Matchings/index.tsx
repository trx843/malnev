import { FC, useEffect, useCallback, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { PageTableTemplate } from "../../../../../templates/PageTable";
import { MatchingsTable } from "./MatchingsTable";
import { MatchingTopPanel } from "./TopPanel";
import { ModalProvider } from "components/ModalProvider";
import { getCommissionsThunk } from "thunks/pspControl/planCard";
import styles from "./styles.module.css";
import { CommissionsModals } from "./modals";

const cx = classNames.bind(styles);

export const Matchings: FC = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { planId } = useParams<{ planId: string }>();

  const handleFetch = useCallback(async () => {
    try {
      await dispatch(getCommissionsThunk(planId));
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return (
    <ModalProvider>
      <div className={cx("matching-container")}>
        <PageTableTemplate
          loading={loading}
          childrenTop={<MatchingTopPanel />}
          childrenTable={<MatchingsTable />}
        />
      </div>
      <CommissionsModals />
    </ModalProvider>
  );
};
