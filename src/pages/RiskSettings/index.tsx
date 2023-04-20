import { PageHeader } from 'antd';
import {FC} from 'react';
import { PageLayoutStyled } from '../../styles/commonStyledComponents';
import { RisksSettingsContainer } from '../../containers/RisksSettingsContainer.tsx';
import './styles.css'
import { useHistory } from 'react-router';

interface RiskSettingsProps {}

const b = (name: string): string => `risks-settings__${name}`

export const RiskSettings: FC<RiskSettingsProps> = ({}) => {
  const history = useHistory()

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Настройка рисков"
        subTitle=""
      />
      <RisksSettingsContainer/>
    </PageLayoutStyled>
  )
}

