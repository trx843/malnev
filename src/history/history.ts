import axios from "axios";

import { User } from "../classes";
import { IFeature } from "../interfaces";
import { apiBase, zeroGuid } from "../utils";

import { createBrowserHistory } from "history";

const isDevelopment = process.env.NODE_ENV === "development";

export const basename = !isDevelopment
  ? process.env.REACT_APP_PUBLIC_URL_PROD
  : process.env.REACT_APP_PUBLIC_URL_DEV;

export const history = createBrowserHistory({
  basename: basename,
});

history.listen((x) => {
  let pageRoute = x.pathname;
  const currentUser = JSON.parse(
    localStorage.getItem("userContext") as string
  ) as User;
  let homePage: IFeature = {
    id: zeroGuid,
    name: "Главная страница",
    route: "/",
  };
  let eventPage: IFeature = {
    id: zeroGuid,
    name: "События",
    route: "/events",
  };
  currentUser.featuresList.push(homePage);
  currentUser.featuresList.push(eventPage);
  let pageName = currentUser.featuresList.find(
    (x) => pageRoute.startsWith(x.route) 
  )?.name;
  axios
    .post(
      `${apiBase}/changePage?pageName=${
        pageName ? pageName : "Неизвестная страница"
      }`
    )
    .catch((err) => console.log(err));
});
