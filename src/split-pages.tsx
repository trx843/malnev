import loadable from "@loadable/component";
import { Loading } from "components/Loading";

export const CheckingObjectsPage = loadable(
  () =>
    import(
      /* webpackChunkName: "checkingobjects-page" */ "./pages/PspControl/CheckingObjectsPage"
    ),
  {
    resolveComponent: ({ CheckingObjectsPage }) => CheckingObjectsPage,
    fallback: <Loading />,
  }
);

export const VerificationActPage = loadable(
  () =>
    import(
      /* webpackChunkName: "verification-act-page" */ "./pages/VerificationActs/VericationAct"
    ),
  {
    resolveComponent: ({ VerificationActPage }) => VerificationActPage,
    fallback: <Loading />,
  }
);

export const AcquaintancePage = loadable(
  () =>
    import(
      /* webpackChunkName: "acquaintance-page" */ "./pages/PspControl/Acquaintance/AcquaintancePage"
    ),
  {
    resolveComponent: ({ AcquaintancePage }) => AcquaintancePage,

    fallback: <Loading />,
  }
);

export const EliminationOfTypicalViolationsPage = loadable(
  () =>
    import(
      /* webpackChunkName: "elimination-of-typical-violations-page" */ "./pages/PspControl/ActionPlans/EliminationOfTypicalViolations"
    ),
  {
    resolveComponent: ({ EliminationOfTypicalViolations }) =>
    EliminationOfTypicalViolations,

    fallback: <Loading />,
  }
);
