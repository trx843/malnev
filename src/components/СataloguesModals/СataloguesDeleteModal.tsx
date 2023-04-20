import React, { FC } from 'react';
import { Modal } from 'antd';
import { UniButton } from '../UniButton';
import { SchemeType } from '../../api/params/nsi-page.params';

type PropsType = {
    selectedScheme: SchemeType;
    isModalVisible: boolean;
    isButtonLoading: boolean;
    modalOnDeletelHandler: (scheme: SchemeType) => void;
    modalOnCancelHandler: () => void;
    modalTitle: string;
};

export const NsiDeleteModal: FC<PropsType> = React.memo(({
    isModalVisible,
    isButtonLoading,
    modalOnCancelHandler,
    modalTitle,
    selectedScheme,
    modalOnDeletelHandler
}) => {

    return <>
        {
            isModalVisible && <Modal
                closable={false}
                maskClosable={false}
                title={modalTitle}
                visible={isModalVisible}
                footer={[
                    <UniButton
                        key="back"
                        buttonHandler={modalOnCancelHandler}
                        isDisabled={isButtonLoading}
                        title={"Закрыть"}
                        type={"default"}
                    />,
                    <UniButton
                        key="submit"
                        danger={true}
                        title={"Удалить"}
                        type={"default"}
                        isButtonLoading={isButtonLoading}
                        buttonHandler={() => modalOnDeletelHandler(selectedScheme)}
                    />
                ]}
            >
                {"Вы действительно хотите удалить эту строку из таблицы?"}
            </Modal>
        }
    </>
});
