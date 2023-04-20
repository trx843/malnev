import { createContext, FC, useContext, useState } from "react";

interface ModalState {
  payload: any | null;
}

interface GlobalModalState extends ModalState {
  type: string | null;
}
interface ContextProps {
  setModal: (modal: GlobalModalState) => void;
  modal: GlobalModalState;
  onClose: () => void;
}
const Context = createContext<ContextProps>({
  setModal: () => null,
  onClose: () => null,
  modal: {
    type: null,
    payload: null
  }
});

export const useModals = () => useContext(Context);

export const ModalProvider: FC = ({ children }) => {
  const [modal, setModal] = useState<GlobalModalState>({
    type: null,
    payload: null
  });

  const handleCloseModal = () => {
    setModal({
      payload: null,
      type: null
    });
  };

  return (
    <Context.Provider value={{ setModal, modal, onClose: handleCloseModal }}>
      {children}
    </Context.Provider>
  );
};
