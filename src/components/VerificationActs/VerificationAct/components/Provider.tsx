import React, { createContext, FC, useContext, useState } from "react";

export interface SidePageContextProps {
  addModalVisible: boolean;
  editModalVisible: {
    visible: boolean;
    id: null | string;
    payload: unknown | null;
  };
  onToggleCreateModal: (open: boolean) => void;
  onOpenEditModal: (id: string, payload: unknown) => void;
  onCloseEditModal: () => void;
  setModal: (modal: GlobalModalState) => void;
  modal: GlobalModalState;
}

interface ModalState {
  visible: boolean;
  payload: any | null;
}

interface CreateModalState extends ModalState {
  id: null | string;
}

interface GlobalModalState extends ModalState {
  type: string | null;
}

export const PageContext = createContext<SidePageContextProps>({
  addModalVisible: false,
  editModalVisible: {
    visible: false,
    id: null,
    payload: null
  },
  onToggleCreateModal: () => null,
  onOpenEditModal: () => null,
  onCloseEditModal: () => null,
  setModal: () => null,
  modal: {
    visible: false,
    type: null,
    payload: null
  }
});

export const useVerificationModals = () => useContext(PageContext);

export const VerificationSectionModalProvider: FC = ({ children }) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState<CreateModalState>({
    visible: false,
    id: null,
    payload: null
  });
  const [modal, setModal] = useState<GlobalModalState>({
    visible: false,
    type: null,
    payload: null
  });

  const handleCreateModal = (open: boolean) => {
    setAddModalVisible(open);
  };

  const handleOpenEditModal = (id: string, payload: unknown) => {
    setEditModalVisible({
      id,
      visible: true,
      payload
    });
  };

  const handleCloseEditModal = () => {
    setEditModalVisible({
      id: null,
      visible: false,
      payload: null
    });
  };

  return (
    <PageContext.Provider
      value={{
        addModalVisible,
        editModalVisible,
        onToggleCreateModal: handleCreateModal,
        onOpenEditModal: handleOpenEditModal,
        onCloseEditModal: handleCloseEditModal,
        setModal,
        modal
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
