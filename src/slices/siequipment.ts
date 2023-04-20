import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message, notification } from "antd";
import { IObjectAffectedInfo } from "api/requests/siequipments";
import moment from "moment";
import { EditorSiMapItem, SiEquipment, TechPositions } from "../classes";
import {
  checkPseudonimsTC,
  getObjectAffectedInfoTC,
  getSiequipmentsbySiTypeTC,
  getTechPosInfoTC,
} from "../thunks/siequipmentPage";

const initialState = {
  modalIsLoading: false,
  siTableisLoading: false,
  isInstallSi: true,
  siequipmentsForTable: [] as SiEquipment[],
  techPosition: {} as TechPositions,
  siTypeId: undefined as number | undefined,
  oldSi: undefined as SiEquipment | undefined,
  newSi: undefined as SiEquipment | undefined,
  lastBinding: null as EditorSiMapItem | null,
  objectAffectedInfo: null as null | IObjectAffectedInfo,
  isBtnLoading: false,
  pseudonimsIsOkFlag: false,
};

//slice
const siequipmentsSlice = createSlice({
  name: "siequipments",
  initialState,
  reducers: {
    setIsInstallSi: (state, action: PayloadAction<boolean>) => {
      state.isInstallSi = action.payload;
    },
    setTechPosition: (state, action: PayloadAction<TechPositions>) => {
      state.techPosition = action.payload;
    },
    setOldSi: (state, action: PayloadAction<SiEquipment | undefined>) => {
      state.oldSi = action.payload;
    },
    setNewSi: (state, action: PayloadAction<SiEquipment | undefined>) => {
      state.newSi = action.payload;
    },
    setLastBinding: (state, action: PayloadAction<EditorSiMapItem | null>) => {
      state.lastBinding = action.payload;
    },
    setSiTypeId: (state, action: PayloadAction<number | undefined>) => {
      state.siTypeId = action.payload;
    },
    setPseudonimsIsOkFlag: (state, action: PayloadAction<boolean>) => {
      state.pseudonimsIsOkFlag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSiequipmentsbySiTypeTC.pending, (state) => {
        state.siTableisLoading = true;
      })
      .addCase(
        getSiequipmentsbySiTypeTC.fulfilled,
        (state, action: PayloadAction<SiEquipment[]>) => {
          state.siequipmentsForTable = action.payload;
          state.siTableisLoading = false;
        }
      )
      .addCase(getSiequipmentsbySiTypeTC.rejected, (state) => {
        state.siTableisLoading = false;
      })
      .addCase(getTechPosInfoTC.pending, (state) => {
        state.modalIsLoading = true;
      })
      .addCase(
        getTechPosInfoTC.fulfilled,
        (state, action: PayloadAction<TechPositions>) => {
          const techPos = action.payload;
          if (techPos) {
            state.techPosition = techPos;
            state.oldSi = techPos.siEquipment;
            state.lastBinding = techPos.siEquipment?.lastSiEquipmentBinding;
          } else {
            message.error("Не удалось загрузить данные по тех. позиции");
          }
          state.modalIsLoading = false;
        }
      )
      .addCase(getTechPosInfoTC.rejected, (state) => {
        state.modalIsLoading = false;
      })
      .addCase(getObjectAffectedInfoTC.pending, (state) => {
        state.siTableisLoading = true;
        state.isBtnLoading = true;
      })
      .addCase(getObjectAffectedInfoTC.fulfilled, (state, { payload }) => {
        state.objectAffectedInfo = payload;
        state.siTableisLoading = false;
        state.isBtnLoading = false;
      })
      .addCase(getObjectAffectedInfoTC.rejected, (state) => {
        state.siTableisLoading = false;
        state.isBtnLoading = false;
      })
      .addCase(checkPseudonimsTC.pending, (state) => {
        state.isBtnLoading = true;
      })
      .addCase(checkPseudonimsTC.fulfilled, (state, { payload }) => {
        state.isBtnLoading = false;
        if (payload !== null) {
          payload.map((item) => {
            if (item.isDuplicate) {
              notification.error({
                message: item.pseudonimName,
                description: `Такой псевдоним уже был сохранен.
                  Удалите дубль и повторите попытку сохранения.`,
                duration: 0,
              });
            } else {
              if (item.message) {
                notification.error({
                  message: item.pseudonimName,
                  description: item.message,
                  duration: 0,
                });
              } else {
                notification.error({
                  message: item.pseudonimName,
                  description: `
                Технологическая позиция: ${item.techPosName};
                Действует с: ${
                  item.effectiveFrom === null
                    ? "Н/д"
                    : moment(item.effectiveFrom).format("DD.MM.YYYY HH:mm")
                };
                Действует по: ${
                  item.effectiveFor === null
                    ? "Н/д"
                    : moment(item.effectiveFor).format("DD.MM.YYYY HH:mm")
                };
                Тип СИ: ${item.siTypeId};
                Модель СИ: ${item.siModel};
                Заводской номер: ${item.manufNumber};
                `,
                  duration: 0,
                });
              }
            }
          });
        } else {
          state.pseudonimsIsOkFlag = true;
        }
      })
      .addCase(checkPseudonimsTC.rejected, (state, { payload }) => {
        if (payload) {
          message.error(payload);
        }
        state.isBtnLoading = false;
      });
  },
});

//exports
export default siequipmentsSlice.reducer;
export const {
  setIsInstallSi,
  setTechPosition,
  setOldSi,
  setNewSi,
  setLastBinding,
  setSiTypeId,
  setPseudonimsIsOkFlag,
} = siequipmentsSlice.actions;

//type
export type SiequipmentsStateType = typeof initialState;
