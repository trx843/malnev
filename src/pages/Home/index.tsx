import { FunctionComponent } from "react";
import {
  Col,
  Layout,
  Button,
  Divider
} from "antd";
import {
  FilterItemLabelStyled,
  FilterRowStyled,
  PageLayoutStyled,
  SiderFilterStyled,
  TkoTreeStyled,
  WrapperTreeRowStyled
} from "../../styles/commonStyledComponents";
import { history } from "../../history/history";

const { Content } = Layout;

export const Home: FunctionComponent = () => {
  return (
    <PageLayoutStyled>
      <Layout>
        <SiderFilterStyled
          width={260}
          collapsed={false}
        >
          <FilterRowStyled $collapsed={false}>
            <Col>
              <FilterItemLabelStyled>Выберите объект в дереве</FilterItemLabelStyled>
            </Col>
          </FilterRowStyled>

          <WrapperTreeRowStyled $collapsed={false}>
            <Col>
              <TkoTreeStyled onSelectCallback={() => {}}/>
            </Col>
          </WrapperTreeRowStyled>
        </SiderFilterStyled>

        <Content className="content">          
          <Button size="large">Баланс ОСУ и РСУ</Button>
          <Divider />
          <Button size="large" type="primary" onClick={() => history.push("/events")}>События</Button>
          <Divider />
          <Button size="large">Баланс с учетом КПХ</Button>
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};
