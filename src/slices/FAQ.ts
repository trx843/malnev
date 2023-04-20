import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  DocTypesResponseType,
  FAQFileItemsType,
} from "../api/responses/faq-page.response";
import {
  UpdatedFAQItemsType,
  UpdatedFAQItemType,
} from "../pages/FAQ/presenter";
import {
  addNewFileTC,
  deleteFileTC,
  getAllFilesTC,
  getDocTypesTC,
  replaceFileTC,
} from "../thunks/FAQPage";
import { IdType } from "../types";

const initialState = {
  FAQFiles: [] as Array<FAQFileItemsType>,
  updatedFAQFiles: [] as Array<UpdatedFAQItemsType>,
  selectedModel: null as UpdatedFAQItemsType | null,
  selectedDocType: null as DocTypesResponseType | null,
  selectedFile: null as File | null,
  selectedForChangingFile: null as UpdatedFAQItemType | null,
  isLoading: false,
  isButtonLoading: false,
  docTypes: [] as Array<DocTypesResponseType>,
  errorText: "",
  isSuccessMessage: false,
  deleteFileId: null as IdType | null,
  isDeleteModalVisible: false,
  confirmLoading: false,
};

const FAQSlice = createSlice({
  name: "FAQ",
  initialState,
  reducers: {
    setUpdatedFAQFiles: (
      state,
      action: PayloadAction<Array<UpdatedFAQItemsType>>
    ) => {
      state.updatedFAQFiles = action.payload;
    },
    setItemDisabled: (state, action: PayloadAction<IdType>) => {
      let newModels = [...state.updatedFAQFiles];
      newModels.forEach((item) => {
        item.items.forEach((elem: any) => {
          if (elem.id === action.payload) {
            elem.disabled = !elem.disabled;
          }
        });
      });
      state.updatedFAQFiles = newModels;
    },
    setSelectedDocType: (
      state,
      action: PayloadAction<DocTypesResponseType | null>
    ) => {
      state.selectedDocType = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<File | null>) => {
      state.selectedFile = action.payload;
    },
    setSelectedModel: (
      state,
      action: PayloadAction<UpdatedFAQItemsType | null>
    ) => {
      state.selectedModel = action.payload;
    },
    setSelectedForChangingFile: (
      state,
      action: PayloadAction<UpdatedFAQItemType | null>
    ) => {
      state.selectedForChangingFile = action.payload;
    },
    clearErrorText: (state) => {
      state.errorText = "";
    },
    changeValueIsSuccessMessage: (state, action: PayloadAction<boolean>) => {
      state.isSuccessMessage = action.payload;
    },
    setDeleteFileId: (state, action: PayloadAction<IdType | null>) => {
      state.deleteFileId = action.payload;
    },
    setIsDeleteModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isDeleteModalVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFilesTC.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFilesTC.fulfilled, (state, action) => {
        if (action.payload) {
          state.FAQFiles = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(getAllFilesTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isLoading = true;
      })
      .addCase(getDocTypesTC.fulfilled, (state, action) => {
        if (action.payload) {
          state.docTypes = action.payload;
        }
      })
      .addCase(getDocTypesTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
      })
      .addCase(addNewFileTC.pending, (state) => {
        state.isButtonLoading = true;
      })
      .addCase(addNewFileTC.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isSuccessMessage = true;
        }
        if (!action.payload.success) {
          state.errorText = action.payload.message;
        }
        state.isButtonLoading = false;
      })
      .addCase(addNewFileTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isButtonLoading = false;
      })
      .addCase(replaceFileTC.pending, (state) => {
        state.isButtonLoading = true;
      })
      .addCase(replaceFileTC.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isSuccessMessage = true;
        }
        if (!action.payload.success) {
          state.errorText = action.payload.message;
        }
        state.isButtonLoading = false;
      })
      .addCase(replaceFileTC.rejected, (state, action) => {
        if (action.payload) {
          state.errorText = action.payload;
        }
        state.isButtonLoading = false;
      })
      .addCase(deleteFileTC.pending, (state) => {
        state.confirmLoading = true;
      })
      .addCase(deleteFileTC.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isDeleteModalVisible = false;
          message.success("Файл успешно удален");
        }else
        {
          message.error(action.payload.message);
        }
        
        state.confirmLoading = false;
      })
      .addCase(deleteFileTC.rejected, (state, action) => {
        if (action.payload) {
          message.error(action.payload);
        }
        state.confirmLoading = false;
      });
  },
});

//exports
export default FAQSlice.reducer;
export const {
  setUpdatedFAQFiles,
  setItemDisabled,
  setSelectedDocType,
  setSelectedFile,
  setSelectedModel,
  setSelectedForChangingFile,
  clearErrorText,
  changeValueIsSuccessMessage,
  setDeleteFileId,
  setIsDeleteModalVisible
} = FAQSlice.actions;

//types
export type FAQStateType = typeof initialState;
export type ErrorType = { message: string };
