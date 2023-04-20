import { Layout, PageHeader } from 'antd';
import React, { FC, useState } from 'react';
import defineAbilityFor, { AbilityContext } from '../../casl';
import { mockCaslConf1, mockCaslConf2 } from '../../casl/mock';
import { CaslDemoComponent } from '../../components/CaslDemoComponent';

export const CaslDemoPage: FC = () => {
  const [currentMock, setCurrentMock] = useState(mockCaslConf1);

  const onMockChange = (mockName: 'mockCaslConf1' | 'mockCaslConf2') => {
    const mocks = {
      mockCaslConf1,
      mockCaslConf2,
    };

    setCurrentMock(mocks[mockName]);
  };

  return (
    //<AbilityContext.Provider value={defineAbilityFor(n)}> {/* провайдер для правил CASL */}
      <Layout>
        <PageHeader style={{ padding: 0 }} title='Демонстрация CASL' />

        <CaslDemoComponent onMockChange={onMockChange} />
      </Layout>
    //</AbilityContext.Provider>
  );
};
