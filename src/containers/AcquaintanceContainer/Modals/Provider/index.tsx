import { createContext, FC, useContext, useState } from "react";

interface ModalState {
  payload: unknown | null;
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

export const useAcquaintanceModals = () => useContext(Context);

export const AcquaintanceModalProvider: FC = ({ children }) => {
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
