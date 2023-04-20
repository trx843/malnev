import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServicesItem } from '../../api/responses/get-algorithm-tree.response';
import { OperandsTreeItem } from '../../api/responses/get-operands-tree.response';
import { AlgorithmTreeViewData } from '../../components/AlgorithmTree/types';

export interface OperandsSlice {
  operandsTreeData: OperandsTreeItem[];
  algTreeData: ServicesItem[];
  selectedNodes: SelectedNodes | null;
  isOperandsLoading: boolean;
  isAlgorithmsLoading: boolean;
}

export interface SelectedNodes {
  [key: string]: {
    algorithms: AlgorithmTreeViewData[];
    operand: OperandsTreeItem;
  };
}

const initialState: OperandsSlice = {
  operandsTreeData: [],
  algTreeData: [],
  selectedNodes: null,
  isOperandsLoading: false,
  isAlgorithmsLoading: false,
};

const operands = createSlice({
  name: 'operands',
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
    clearOperands(state) {
      state = initialState;
    },
  },
});

export const {
  setOperandsTreeData,
  setAlgTreeData,
  setSelectedNode,
  clearOperands,
  setAlgorithmsLoading,
  setOperandsLoading,
} = operands.actions;

export const operandsReducer = operands.reducer;
