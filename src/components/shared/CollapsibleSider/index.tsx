import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { FC } from 'react';

const { Sider } = Layout;

interface IProps {
  collapsed: boolean;
  children: any;
  onCollapse: () => void;
  title: string;
  collapsedIcon: any;
}

export const CollapsibleSider: FC<IProps> = ({
  collapsed,
  children,
  onCollapse,
  title,
  collapsedIcon,
}) => (
  <Sider
    width={450}
    style={{ background: 'white', overflowY: 'scroll' }}
    collapsed={collapsed}
    onCollapse={onCollapse}
  >
    {collapsed ? (
      <div style={{ padding: 21 }}>
        <Button
          icon={collapsedIcon}
          onClick={onCollapse}
          style={{ backgroundColor: '#1F4664', color: 'white', borderRadius: '4px' }}
        />
      </div>
    ) : (
      <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between' }}>
        {' '}
        <Title level={4}>{title}</Title>
        <ArrowLeftOutlined
          onClick={onCollapse}
          style={{ fontSize: '23px', margin: '3px' }}
        />
      </div>
    )}

    {!collapsed && <div style={{ padding: '0 16px' }}>{children}</div>}
  </Sider>
);
