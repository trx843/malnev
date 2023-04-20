export const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'sss', key: '0-0-1-0' }],
      },
    ],
  },
];

export const tableMock = {
  data: [
    {
      id: '01',
      name: 'СИКН 1',
      criticality: 'Информация',
      risk: 0.5,
      permanentRisk: 'постоянный риск 1'
    },
    {
      id: '02',
      name: 'СИКН 2',
      criticality: 'Высокий',
      risk: 1,
      permanentRisk: 'постоянный риск 2'
    },
    {
      id: '03',
      name: 'СИКН 3',
      criticality: 'Информация',
      risk: 0.3,
      permanentRisk: 'постоянный риск 1'
    },
  ]
}