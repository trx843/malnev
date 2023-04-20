import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import { Button, Divider, Input, Tooltip } from "antd";
import React, { FC } from "react";
import styles from "./extraSearchInput.module.css";

type PropsType = {
    filteredItems: Array<{id: string, label: string}>;
    onInputChangeHandler: (value: string) => void;
    newItem: string;
    onAddButtonHandler: () => void;
    onDeleteButtonHandler: (id: string) => void;
    isToggled: boolean;
    onToggleButtonHandler: () => void;
    selectedItem: string;
    onSelectItemHandler: (value: string) => void;
    itemNameHandler: (name: string) => string;
}

const ExtraSearchInput: FC<PropsType> = React.memo(({
        filteredItems, onInputChangeHandler, newItem, onAddButtonHandler, onDeleteButtonHandler,
        isToggled, onToggleButtonHandler, selectedItem, onSelectItemHandler, itemNameHandler,
    }) => {

    return <>
        {filteredItems && <div className={styles.select}>
            <Tooltip title={selectedItem}>
                <button type="button"
                    className={isToggled ? styles.selectToggleShow : styles.selectToggle}
                    onClick={onToggleButtonHandler}
                >
                    {selectedItem.length < 20 ? selectedItem : `${selectedItem.split("").splice(0, 21).join("")}...`}
                </button>
            </Tooltip>
            <div className={isToggled ? styles.selectDropdownShow : styles.selectDropdown}>
                <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <Input
                        style={{ flex: 'auto' }}
                        value={newItem}
                        onChange={e => onInputChangeHandler(e.currentTarget.value)}
                    />
                    <Button
                        onClick={onAddButtonHandler}
                        disabled={newItem.length === 0}
                    >
                        <PlusOutlined /> Добавить
                    </Button>
                </div>
                <Divider style={{ margin: '4px 0' }} />
                <div className={styles.selectOptions}>
                    {filteredItems.length > 0
                        ? filteredItems.map(item => (
                            <Tooltip title={item.label} key={item.id}>
                                <div className={styles.selectOption}>
                                    <div onClick={() => onSelectItemHandler(item.label)}>
                                        {item.label.length < 20 ? item.label : `${item.label.split("").splice(0, 21).join("")}...`}
                                    </div>
                                    <Button danger type={"text"} icon={<DeleteOutlined onClick={() => onDeleteButtonHandler(item.id)} />} />
                                </div>
                            </Tooltip>))
                        : ""
                    }
                </div>
            </div>
        </div>}
    </>
});

export default ExtraSearchInput;