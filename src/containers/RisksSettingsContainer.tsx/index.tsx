import { Tabs } from 'antd'
import {FC} from 'react'
import { PageStyledTabs } from '../../styles/commonStyledComponents'
import { EventRisksEditor } from '../../components/EventRisksEditor'
import { RisksEditor } from '../../components/RisksEditor'
import { SiknEditor } from '../../components/SiknEditor'

const { TabPane } = Tabs

export const RisksSettingsContainer: FC = () => {

  return (
    <PageStyledTabs 
      defaultActiveKey="sikn" 
      destroyInactiveTabPane={true}
    >
      <PageStyledTabs.TabPane key="sikn" tab="Редактор СИКН">
        <SiknEditor/>
      </PageStyledTabs.TabPane>
      <PageStyledTabs.TabPane key="permanentRisks" tab="Редактор постоянных рисков">
        <RisksEditor/>
      </PageStyledTabs.TabPane>
      <PageStyledTabs.TabPane key="eventsRisks" tab="Редактор рисков событий">
        <EventRisksEditor/>
      </PageStyledTabs.TabPane>
    </PageStyledTabs>
  )
}