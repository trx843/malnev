import { FC, useEffect, useCallback, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { PageTableTemplate } from "../../../../../templates/PageTable";
import { CommissionsTable } from "./CommissionsTable";
import { CommissionTopPanel } from "./TopPanel";
import { ModalProvider } from "components/ModalProvider";
import styles from "./styles.module.css";
import { getVerificationCommissionsThunk } from "thunks/pspControl/verificationScheduleCard";
import { CommissionsModals } from "./modals";

const cx = classNames.bind(styles);

export const Comissions: FC = () => {
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(false);
  const dispatch = useDispatch();
  const { scheduleId } = useParams<{ scheduleId: string }>();

  const handleFetch = useCallback(async () => {
    if (attempt) {
      return;
    }
    try {
      setAttempt(true);
      await dispatch(getVerificationCommissionsThunk(scheduleId));
    } finally {
      setLoading(false);
    }
  }, [scheduleId, attempt]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return (
    <ModalProvider>
      <div className={cx("container")}>
        <PageTableTemplate
          loading={loading}
          childrenTop={<CommissionTopPanel />}
          childrenTable={<CommissionsTable />}
        />
      </div>
      <CommissionsModals />
    </ModalProvider>
  );
};
