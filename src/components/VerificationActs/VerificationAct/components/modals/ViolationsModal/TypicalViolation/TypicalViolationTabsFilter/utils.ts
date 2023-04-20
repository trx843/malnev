export const getListFilterBaseParams = (name: string, values: any) => {
  return {
    pageIndex: 0,
    isSortAsc: true,
    sortedField: name,
    filter: {
      ...values,
    },
  };
};
