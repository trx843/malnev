import _ from "lodash";

export function getSelectedItems<T>(
  newSelectedItems: T[], // новый массив выбранных/отмененных элементов
  selectedItemsOnCurrentPage: T[], // выбранные элементы таблицы на странице
  selectedItems: T[], // список всех выбранных элементы таблицы
  accessor: string // уникальное средство доступа по которому будут сопоставляться элементы для инициализции выбранных строк таблицы
) {
  // если пользователь отменил все на странице(deselect all)
  if (!newSelectedItems.length) {
    // получаем оставшиеся все выбранные элементы таблицы
    const remainingInitSelectedTableItems = _.differenceBy(
      selectedItems,
      selectedItemsOnCurrentPage,
      accessor
    );

    return {
      selectedItemsOnCurrentPage: newSelectedItems,
      selectedItems: remainingInitSelectedTableItems,
    };
  }

  // если пользователь отменил строку(deselect item)
  if (newSelectedItems.length < selectedItemsOnCurrentPage.length) {
    // получаем массив с отменненым элементом
    const diff = _.differenceBy(
      selectedItemsOnCurrentPage,
      newSelectedItems,
      accessor
    );

    // убираем элемент из исходного массива всех выбранных элементов таблицы
    const remainingInitSelectedTableItems = _.xorBy(
      diff,
      selectedItems,
      accessor
    );

    return {
      selectedItemsOnCurrentPage: newSelectedItems,
      selectedItems: remainingInitSelectedTableItems,
    };
  }

  // получаем новый массив с новым выбранным элементом
  const diff = _.differenceBy(newSelectedItems, selectedItems, accessor);

  return {
    selectedItemsOnCurrentPage: newSelectedItems,
    selectedItems: [...selectedItems, ...diff],
  };
}
