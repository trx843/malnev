import { Layout, PageHeader, Breadcrumb, Card, Row, Col, Upload, Button } from "antd";
import React, {FunctionComponent, useEffect, useState} from "react";
import { ValidateInputOneAttrModel } from "../classes/ValidateInputOneAttrModel";
import {ValidateInputOneAttrContainer} from "../containers/ValidateInputOneAttrContainer";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import styled from "styled-components";

const { Content } = Layout;

const StyledBreadcrumb = styled(Breadcrumb)`margin-bottom: 20px;`

const validateInputOneAttrModel = new ValidateInputOneAttrModel(
    "\\\\VDC01-DIAFSKD01\\AISMSS\\АО Транснефть - Урал\\Курганское НУ\\ЛПДС Юргамыш\\ПСП нефти ЛПДС Юргамыш\\СИКН 115\\БИЛ\\ИЛ - 1\\Датчик давления - РТ201|Значение",
    new Date("2020-12-12 00:00:00"),
    new Date("2021-07-12 14:00:00"),   
)

export const ValidateInputOneAttrPage: FunctionComponent = () => { 
    const routes = [
      {
        path: "/validationinput",
        breadcrumbName: "Сравнение до и после достоверизации",
      },
      {
        path: "",
        breadcrumbName: `Подробный отчет \"${validateInputOneAttrModel.atrName}\"`,
      }
    ];

    function itemRender(
      route: Route,
      params: any,
      routes: Route[],
      paths: string[]
    ) {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? (
        <span>{route.breadcrumbName}</span>
      ) : (
        <Link to={route.path}>{route.breadcrumbName}</Link>
      );
    }

    return (
      <Layout>
        <StyledBreadcrumb itemRender={itemRender} routes={routes} separator=">"></StyledBreadcrumb>
        <Content>
          <ValidateInputOneAttrContainer />
        </Content>
      </Layout>
    );
};