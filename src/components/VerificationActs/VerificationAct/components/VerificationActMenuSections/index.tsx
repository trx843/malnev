import { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import qs from "qs";
import { Button, Card, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ExportOutlined from "@ant-design/icons/ExportOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";

import { VerificationActMenu } from "../VerificationActMenu";
import { VerificationActSection } from "../../../../../containers/VerificationActs/VerificationAct/types";
import {
  Commission,
  CompositionOfAppendicesToReport,
  IdentifiedViolationsOrRecommendations,
  NumberOneSide,
  Recommendations
} from "../Sections";
import { exportToDoc, verificationActHasMain } from "../../../../../api/requests/verificationActs/verificationAct";
import { StateType } from "../../../../../types";
import { VerificationActStore } from "../../../../../slices/verificationActs/verificationAct/types";
import { completeCreatingThunk, getVerificationActPageThunk } from "../../../../../thunks/verificationActs/verificationAct";
import { useActStatusPermission } from "../../hooks/useActStatusPermission";
import { VerificationAttachments } from "../Attachments";
import { ActionsEnum, Can } from "../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { MainAttachmentErrorMessage } from "../../../../../constants";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

interface VerificationActMenuSectionProps { }

export const VerificationActMenuSections: FC<VerificationActMenuSectionProps> = () => {
  const buttonProps = useActStatusPermission();

  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams<{ actId: string }>();
  const [selectedKey, setSelectedKey] = useState<VerificationActSection>(
    VerificationActSection.NumberOneSide
  );

  const state = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, state?.act?.verificationLevelId);

  const act = state.act
  const actId = act?.id
  const isVisibilityInspection = state.act?.isVisibilityInspection

  const [exportDisabled, setExportDisabled] = useState(false);
  const [pendingChangeStatus, setPendingChangeStatus] = useState(false);

  const exportToWord = async () => {
    setExportDisabled(true);
    await exportToDoc(
      params.actId,
      act?.actName || "errorDocName"
    );
    setExportDisabled(false);
  };

  const handleCompleteStatus = async () => {
    try {
      setPendingChangeStatus(true);

      if (actId) {
        const hasMain = await verificationActHasMain(actId);
        if (!hasMain) {
          message.error({
            content: MainAttachmentErrorMessage,
            duration: 2,
          });

          return;
        }
        await dispatch(completeCreatingThunk({ actId }));
        await dispatch(getVerificationActPageThunk(actId));
      }
    } finally {
      setPendingChangeStatus(false);
    }
  };

  useEffect(() => {
    const { search } = location;
    const query = qs.parse(search.replace("?", ""), {}) as {
      section: VerificationActSection;
    };
    setSelectedKey(query.section);
  }, [location.search]);

  const renderContent = () => {
    switch (selectedKey) {
      case VerificationActSection.NumberOneSide: {
        return <NumberOneSide />;
      }
      case VerificationActSection.Commission: {
        return <Commission />;
      }
      case VerificationActSection.Recommendations: {
        return <Recommendations />;
      }
      case VerificationActSection.CompositionOfAppendicesToReport: {
        if (!isVisibilityInspection) return <NumberOneSide />;
        return <CompositionOfAppendicesToReport />;
      }
      case VerificationActSection.IdentifiedViolationsOrRecommendations: {
        return <IdentifiedViolationsOrRecommendations />;
      }
      default: {
        return <NumberOneSide />;
      }
    }
  };

  return (
    <div className="verification-act-page__content">
      <div className="verification-act-page__header">
        <div>
          <VerificationActMenu
            selectedKeys={selectedKey}
            showCompositionSection={isVisibilityInspection}
          />
        </div>
        <div className="verification-act-page__actions">
          {!buttonProps.isSigned && (
            <Can
              I={ActionsEnum.View}
              a={elementId(VerificationActsElements[VerificationActsElements.CompleteActCreation])}
            >
              <Button
                icon={<CheckCircleOutlined />}
                type="text"
                size="large"
                onClick={handleCompleteStatus}
                disabled={pendingChangeStatus || state.isActAttachmentsLoading || isOperationDisabled}
                loading={pendingChangeStatus}
              >
                Завершить создание
              </Button>
            </Can>
          )}
          <Can
            I={ActionsEnum.View}
            a={elementId(VerificationActsElements[VerificationActsElements.Export])}
          >
            <Button
              icon={<ExportOutlined />}
              type="text"
              size="large"
              onClick={exportToWord}
              disabled={exportDisabled || state.isActAttachmentsLoading}
              loading={exportDisabled}
            >
              Экспортировать
            </Button>
          </Can>
          <Can
            I={ActionsEnum.View}
            a={elementId(VerificationActsElements[VerificationActsElements.Attachments])}
          >
            <VerificationAttachments verificationLevelCouseDisabled={isOperationDisabled} />
          </Can>
        </div>
      </div>
      <Card className="verification-act-page__inner-content">
        {renderContent()}
      </Card>
    </div>
  );
};
