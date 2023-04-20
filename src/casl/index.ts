import { Ability, Subject, AbilityBuilder } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import { User } from "classes/User";
import { createContext } from "react";
import { IFeature, IFeatureElements } from "../interfaces";

type Actions = "go" | "view" | "edit" | string;

type AppAbility = Ability<[Actions, Subject]>;

// определяем типы действия пользователя
export enum ActionsEnum {
  Go = "go",
  View = "view",
  Edit = "edit",
}

// функция формирования конфига для CASL
export default function defineAbilityFor(user: User) {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(Ability); // методы для создания конфига

  user.featuresList?.forEach((route) => {
    if (!route.route) return;
    // мапим роуты из конфигурационного файла с бэка
    can(ActionsEnum.Go, route.route); // добавляем роуты доступные к просмотру данному пользователю в конфиг
  });

  if (user.ignoreElementsSettings) {
    can(ActionsEnum.Edit, "all");
    can(ActionsEnum.View, "all");
  } else {
    user.featureElementsList?.forEach((element) => {
      // мапим элементы по этому роуту
      const elementId = `${element.route}${element.name}`; // создаем индивидуальный идентификатор элемента состоящий из роута и названия элемента

      can(ActionsEnum.View, elementId); // добавляем элементы доступные к просмотру данному пользователю

      if (element.readOnly) {
        // по флагу readOnly определяем доступность редактирования пользователю экранных форм и элементов
        cannot(ActionsEnum.Edit, elementId);
      } else {
        can(ActionsEnum.Edit, elementId);
      }
    });
  }

  user.webFeaturesTypes.special?.forEach((wf) => {
    if (!wf.route) return;
    can(ActionsEnum.View, wf.route);
  });

  return new Ability(rules); // возвращаем конфигурацию
}

export const AbilityContext = createContext({} as AppAbility);

export const Can = createContextualCan(AbilityContext.Consumer);
