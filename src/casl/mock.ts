export const mockCaslConf1 = [
  {
    id: '25e8bc6f-1764-44a2-bfcc-02eadd11edb6',
    route: '/casl-demo',
    name: 'Демонстрация CASL',
    elements: [
      {
        id: 1,
        name: 'OpenModal',
        readOnly: false,
      },
      {
        id: 2,
        name: 'MockModal',
        readOnly: false,
      },
      {
        id: 3,
        name: 'MockTab',
        readOnly: false,
      },
      {
        id: 4,
        name: 'UploadButtonReportOn',
        readOnly: false,
      },
      {
        id: 5,
        name: 'HiddenFormField',
        readOnly: false,
      },
      {
        id: 6,
        name: 'HiddenTab',
        readOnly: false,
      },
    ],
  },
];

export const mockCaslConf2 = [
  {
    id: '25e8bc6f-1764-44a2-bfcc-02eadd11edb6',
    route: '/casl-demo',
    name: 'Демонстрация CASL',
    elements: [
      {
        id: 1,
        name: 'OpenModal',
        readOnly: false,
      },
      {
        id: 2,
        name: 'MockModal',
        readOnly: true,
      },
    ],
  },
  {
    id: '1423d123-d1-23-d123d-123d1d1-312',
    route: '/casl-demo-redirect',
    name: 'Redirect Demo',
    elements: [],
  },
];

export interface MockCaslConfItem {
  id: string;
  route: string;
  name: string;
}


