import { UniType } from "api/requests/verificationActCommissionModal";
import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ExtraSearchInput from "./ExtraSearchInput";

type PropsType = {
  label: string;
  items: Array<UniType>;
  onAddItem: (item: string) => void;
  onDeleteItem: (id: string) => void;
  onSelectItem: (value: string) => void;
}

const ExtraSearchInputContainer: FC<PropsType> = React.memo(({
  label, items, onAddItem, onDeleteItem, onSelectItem,
}) => {
  const dispatch = useDispatch();

  const [isToggled, setIsToggled] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const [newItem, setNewItem] = useState("");
  const [selectedItem, setSelectedItem] = useState(`Выберите ${label}`);

  useEffect(() => {
    setFilteredItems(items)
  }, [items]);

  const itemNameHandler = (name: string) => {
    let newName = name.length < 20 ? name : `${name.split("").splice(0, 21).join("")}...`;
    return newName
  };

  const onInputChangeHandler = (value: string) => {
    if (value === "") {
      setFilteredItems(items)
      setNewItem(value)
    } else {
      let result = items.filter(item => item.label.toLowerCase().indexOf(value.toLocaleLowerCase()) !== -1)
      setFilteredItems(result)
      setNewItem(value)
    }
  }

  const onAddButtonHandler = () => {
    dispatch(onAddItem(newItem));
  }

  const onDeleteButtonHandler = (id: string) => {
    let deletedItem = items.find(i => i.id === id)
    if (deletedItem && deletedItem.label === selectedItem) {
      setSelectedItem(`Выберите ${label}`)
    }
    dispatch(onDeleteItem(id));
  }

  const onToggleButtonHandler = () => {
    setIsToggled(!isToggled);
  }

  const onSelectItemHandler = (value: string) => {
    setIsToggled(!isToggled);
    setSelectedItem(value);
    setNewItem("");
    onSelectItem(value);
  }

  return (
    <ExtraSearchInput 
      filteredItems={filteredItems} 
      onInputChangeHandler={onInputChangeHandler} 
      newItem={newItem} 
      onAddButtonHandler={onAddButtonHandler} 
      onDeleteButtonHandler={onDeleteButtonHandler} 
      isToggled={isToggled} 
      onToggleButtonHandler={onToggleButtonHandler} 
      selectedItem={selectedItem}
      onSelectItemHandler={onSelectItemHandler}
      itemNameHandler={itemNameHandler}
    />
  );
});

export default ExtraSearchInputContainer;