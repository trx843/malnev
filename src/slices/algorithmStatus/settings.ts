import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServicesItem } from '../../api/responses/get-algorithm-tree.response';
import { OperandsTreeItem } from '../../api/responses/get-operands-tree.response';
import { AlgorithmTreeViewData } from '../../components/AlgorithmTree/types';
import { OperandNode } from '../../customHooks/useNodeTableData';

export interface SettingsSlice {
  operandsTreeData: OperandsTreeItem[];
  algTreeData: ServicesItem[];
  selectedNodes: SelectedNodes | null;
  isOperandsLoading: boolean;
  isAlgorithmsLoading: boolean;
  selectedOperandNode: OperandNode | null;
  isFormLoading: boolean;
}

export interface SelectedNodes {
  [key: string]: {
    algorithms: AlgorithmTreeViewData[];
    operand: OperandsTreeItem;
  };
}

const initialState: SettingsSlice = {
  operandsTreeData: [],
  algTreeData: [],
  selectedNodes: null,
  isOperandsLoading: false,
  isAlgorithmsLoading: false,
  isFormLoading: false,
  selectedOperandNode: null,
};

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setOperandsTreeData(state, action: PayloadAction<OperandsTreeItem[]>) {
      state.operandsTreeData = action.payload;
    },
    setAlgTreeData(state, action: PayloadAction<ServicesItem[]>) {
      state.algTreeData = action.payload;
    },
    setSelectedNode(state, action: PayloadAction<SelectedNodes>) {
      state.selectedNodes = {
        ...state.selectedNodes,
        ...action.payload,
      };
    },
    setOperandsLoading(state, action: PayloadAction<boolean>) {
      state.isOperandsLoading = action.payload;
    },
    setAlgorithmsLoading(state, action: PayloadAction<boolean>) {
      state.isAlgorithmsLoading = action.payload;
    },
    setSelectedOperandNode(state, action: PayloadAction<OperandNode | null>) {
      state.selectedOperandNode = action.payload;
    },
    setIsFormLoading(state, action: PayloadAction<boolean>) {
      state.isFormLoading = action.payload;
    },
    clearSettings(state) {
      state = initialState;
    },
  },
});

export const {
  setOperandsTreeData,
  setAlgTreeData,
  setSelectedNode,
  clearSettings,
  setAlgorithmsLoading,
  setOperandsLoading,
  setSelectedOperandNode,
  setIsFormLoading,
} = settings.actions;

export const settingsReducer = settings.reducer;
