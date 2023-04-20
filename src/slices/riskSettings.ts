import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MssEventType } from '../classes/MssEventType';
import { SiknPermanentRisk } from '../components/cellRenderers/ConstantRiskBindRenderer/ConstantRiskBindModal/types';
import { SiknEditorTableItem } from '../components/SiknEditor/types';

interface RiskSettings {
  filter: string;
  siknRsusArr: SiknEditorTableItem[];
  selectedSiknArr: number[];
  constantRisks: SiknPermanentRisk[];
  selectedRiskId: string;
  mssEventTypesTreeKey: string;
  mssEventTypes: MssEventType[];
  selectedMssEventTypes: MssEventType[];
  filteredMssEventTypes: MssEventType[];
  isEventRisksModalOpen: boolean;
  openedModal: string;
}

export enum RiskSettingsModals {
  riskBindModal = 'riskBindModal',
}

const initialState: RiskSettings = {
  filter: 'init',
  siknRsusArr: [],
  selectedSiknArr: [],
  constantRisks: [],
  selectedRiskId: '',
  mssEventTypes: [],
  selectedMssEventTypes: [],
  filteredMssEventTypes: [],
  mssEventTypesTreeKey: '0',
  isEventRisksModalOpen: false,
  openedModal: '',
};

const risksSettings = createSlice({
  name: 'risksSettings',
  initialState,
  reducers: {
    setSiknRsusArr(state, action: PayloadAction<SiknEditorTableItem[]>) {
      state.siknRsusArr = action.payload;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setSelectedSiknArr(state, action: PayloadAction<number[]>) {
      state.selectedSiknArr = [...action.payload];
    },
    setConstantRisks(state, action: PayloadAction<SiknPermanentRisk[]>) {
      state.constantRisks = [...action.payload];
    },
    setSelectedRiskId(state, action: PayloadAction<string>) {
      state.selectedRiskId = action.payload;
    },
    setMssEventTypes(state, action: PayloadAction<MssEventType[]>) {
      state.mssEventTypes = action.payload;
    },
    setSelectedMssEventTypes(state, action: PayloadAction<MssEventType[]>) {
      state.selectedMssEventTypes = action.payload;
    },
    setFilteredMssEventTypes(state, action: PayloadAction<MssEventType[]>) {
      state.filteredMssEventTypes = action.payload;
    },
    setMssEventTypesTreeKey(state, action: PayloadAction<string>) {
      state.mssEventTypesTreeKey = action.payload;
    },
    setIsEventRisksModalOpen(state, action: PayloadAction<boolean>) {
      state.isEventRisksModalOpen = action.payload;
    },
    setOpenedModal(state, action: PayloadAction<string>) {
      state.openedModal = action.payload;
    },
  },
});

export const {
  setFilter,
  setSiknRsusArr,
  setSelectedSiknArr,
  setConstantRisks,
  setSelectedRiskId,
  setMssEventTypes,
  setSelectedMssEventTypes,
  setMssEventTypesTreeKey,
  setIsEventRisksModalOpen,
  setFilteredMssEventTypes,
  setOpenedModal,
} = risksSettings.actions;

export default risksSettings.reducer;
