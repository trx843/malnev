import React, { FunctionComponent, useContext } from "react";
import { Route, RouteProps } from "react-router-dom";
import { AbilityContext, ActionsEnum } from "../casl";
import { User } from "../classes";
import { history } from "../history/history";

export const PrivateRoute: FunctionComponent<RouteProps> = (
  props: RouteProps
) => {
  const userJsonStr = localStorage.getItem("userContext");

  // защита закрытого роута
  if (userJsonStr === null) {
    history.push("/"); // если нет прав, то редирект на главную страницу
  } else {
    const user = JSON.parse(userJsonStr) as User;

    const pathname = props.location?.pathname as string;

    const cannotByStartWith = (): boolean =>
      user.featuresList
        .map((x) => x.route)
        .findIndex((route) => {
          return pathname.startsWith(route);
        }, pathname) == -1;

    const ability = useContext(AbilityContext);

    const cannot = ability.cannot(ActionsEnum.Go, pathname);

    if (
      pathname
      && pathname.indexOf('myreport') === -1 // условие для личных отчетов
      && (cannot ? cannotByStartWith() : cannot)
    ) {
      history.push("/");
    }

    return (
      <Route
        exact={props.exact}
        path={props.path}
        component={props.component}
        location={props.location}
        render={props.render}
        children={props.children}
        sensitive={props.sensitive}
        strict={props.strict}
      ></Route>
    );
  }

  return null;
};
