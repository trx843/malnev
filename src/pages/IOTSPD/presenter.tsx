import { message } from "antd";
import { ObjectType, SelectItemsType } from "api/responses/iotspd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { iotspd, iotspdActions, ObjectElementCardType } from "slices/iotspd";
import {
  updateParamTC,
  addParamTC,
  getObjectElementsTC,
  getObjectItemsTC,
  getParamItemsTC,
  getTreeDataTC,
  deleteParamTC,
  getToNumListTC,
  objectExportTC,
  updateObjectTC,
  getShortObjectCodeTC,
} from "thunks/iotspd";
import * as Yup from "yup";

const usePresenter = () => {
  const dispatch = useDispatch();
  const iotspdState = useSelector(iotspd);

  useEffect(() => {
    if (iotspdState.treeData.length < 1) {
      dispatch(getTreeDataTC()); //запрос дерева объектов для сайдера
      dispatch(getObjectItemsTC()); //запрос словаря формы для объекта
      dispatch(getParamItemsTC()); //запрос словаря формы для параметра
    }
  }, []);

  //page sider
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);

  const onSiderCollapseHandler = () => {
    setSiderCollapsed(!siderCollapsed);
  }; //хэндлер для закрытия и раскрытия сайдера

  const loopHandler = (data: any) =>
    data.map((item) => {
      const index = typeof item.title === "string" ? item.title.indexOf(iotspdState.searchValue) : -1;
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(
        index + iotspdState.searchValue.length
      );
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">
              {iotspdState.searchValue}
            </span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {
          title,
          key: item.key,
          children: loopHandler(item.children),
          paramExists: item.paramExists,
        };
      }

      return {
        title,
        key: item.key,
        paramExists: item.paramExists,
      };
    }); //хэндлер для обработки дерева объектов при поиске по дереву

  const setSearchValueHandler = useCallback(
    (value) => {
      const dataList: any = [];
      const generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key, title } = node;
          dataList.push({ key, title });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(iotspdState.treeData);
      const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some((item) => item.key === key)) {
              parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
              parentKey = getParentKey(key, node.children);
            }
          }
        }
        return parentKey;
      };

      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, iotspdState.treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      dispatch(iotspdActions.setExpandedKeys(expandedKeys));
      dispatch(iotspdActions.setAutoExpandParent(true));
      dispatch(iotspdActions.setSearchValue(value));
    },
    [iotspdState.treeData]
  ); //хэндлер для обработки вводимого значения в строку поиска по дереву

  const setSelectedTreeObjectsHandler = useCallback((values) => {
    if (values[0]) {
      dispatch(getShortObjectCodeTC(values[0]));
      //получаем код объекта для отображения пользователю
      dispatch(iotspdActions.setSelectedTreeObject(values[0]));
      //получение элементов по выбранному объекту
      dispatch(getObjectElementsTC(values[0]));
    }
  }, []); //хэндлер для запроса объекта выбранного в дереве

  const onExpandTreeHandler = (expandedKyes: any) => {
    dispatch(iotspdActions.setExpandedKeys(expandedKyes));
    dispatch(iotspdActions.setAutoExpandParent(false));
  }; //хэндлер на обработку раскрытия узлов в дереве

  //page objects card
  const [cardCollapsed, setCardCollapsed] = useState<boolean>(false);

  const onCardCollapseHandler = () => {
    setCardCollapsed(!cardCollapsed);
  }; //хэндлер для закрытия и раскрытия блока карточек с кодами элементов объекта

  const objectElementsDictionary = {
    ost: "Код ОСТ",
    rnu: "Код РНУ",
    po: "Код площадочного объекта",
    mt: "Код МТ",
    uchMt: "Код ЛЧ",
    routeType: "Код маршрута",
    routenum: "№ маршрута",
    toType: "Код ТО",
    toNum: "Номер ТО",
    saType: "Код СА",
    saTransmitterType: "Код оборудования передачи данных",
    saTransmitterNum: "№ оборудования передачи данных",
    tbType: "Код ТБ",
    tbNum: "Номер ТБ",
    muType: "Код места установки",
    muNum: "Номер места установки",
    docType: "Тип отчетного документа",
    docSubType: "Подтип отчетного документа",
    tou: "Код ТОУ",
    touNum: "№ ТОУ",
  }; //словарь элементов объекта

  const objElemCardsHandler = (key: string, value: string | number) => {
    switch (key) {
      case "ost":
        return iotspdState.objectItems["1"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "rnu":
        return iotspdState.objectItems["2"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "po":
        return iotspdState.objectItems["3"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "mt":
        return iotspdState.objectItems["4"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "uchMt":
        return iotspdState.objectItems["5"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "routeType":
        return iotspdState.objectItems["6"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "toType":
        return iotspdState.objectItems["7"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "toNum":
        if (iotspdState.toNumList && iotspdState.toNumList.length) {
          return iotspdState.toNumList.find((item: SelectItemsType) => item.id == value)?.fullName;
        } else {
          return ""
        }
      case "saType":
        return iotspdState.objectItems["8"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "saTransmitterType":
        return iotspdState.objectItems["9"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "tbType":
        return iotspdState.objectItems["10"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "muType":
        return iotspdState.objectItems["11"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "docType":
        return iotspdState.objectItems["12"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "docSubtype":
        return iotspdState.objectItems["13"].find((item: SelectItemsType) => item.id == value)?.fullName;
      case "tou":
        return iotspdState.objectItems["14"].find((item: SelectItemsType) => item.id == value)?.fullName;
      default:
        return "";
    }
  }

  useEffect(() => {
    if (iotspdState.codeElems && "ost" in iotspdState.codeElems) {
      dispatch(iotspdActions.setModifingObjectFormInitialValues());
      let cards: Array<ObjectElementCardType> = [];
      for (let [key, value] of Object.entries(iotspdState.codeElems)) {
        const result = objElemCardsHandler(key, value);
        cards.push({
          key,
          elName: objectElementsDictionary[key],
          value,
          toolTip: result ? result : "",
        });
      }
      dispatch(iotspdActions.setObjectElementCards(cards));
    }
  }, [iotspdState.codeElems]); //запуск перерисовки карточек с кодами объекта при выборе нового объекта

  //modal - object
  const objectValidationSchema = Yup.object({
    ost: Yup.string().required("Поле обязательно к заполнению!"),
    rnu: Yup.string().required("Поле обязательно к заполнению!"),
    po: Yup.string().required("Поле обязательно к заполнению!"),
    mt: Yup.string().required("Поле обязательно к заполнению!"),
    uchMt: Yup.string().required("Поле обязательно к заполнению!"),
    routeType: Yup.string().required("Поле обязательно к заполнению!"),
    routeNum: Yup.number().required("Поле обязательно к заполнению!"),
    toType: Yup.string().required("Поле обязательно к заполнению!"),
    toNum: Yup.string().required("Поле обязательно к заполнению!"),
    saType: Yup.string().required("Поле обязательно к заполнению!"),
    saTransmitterType: Yup.string().required("Поле обязательно к заполнению!"),
    saTransmitterNum: Yup.number().required("Поле обязательно к заполнению!"),
    tbType: Yup.string().required("Поле обязательно к заполнению!"),
    tbNum: Yup.number().required("Поле обязательно к заполнению!"),
    muType: Yup.string().required("Поле обязательно к заполнению!"),
    muNum: Yup.number().required("Поле обязательно к заполнению!"),
    docType: Yup.string().required("Поле обязательно к заполнению!"),
    docSubtype: Yup.string().required("Поле обязательно к заполнению!"),
    tou: Yup.string().required("Поле обязательно к заполнению!"),
    touNum: Yup.number().required("Поле обязательно к заполнению!"),
    paramList: Yup.array().of(
      Yup.object({
        dataType: Yup.string().required("Поле обязательно к заполнению!"),
        paramGroup: Yup.string().required("Поле обязательно к заполнению!"),
        param: Yup.string().required("Поле обязательно к заполнению!"),
        paramNum: Yup.number().required("Поле обязательно к заполнению!"),
        comment: Yup.string().trim(),
      })
    ),
  }); //схема валидации для модального окна объекта

  const newObjectInitialValues = {
    ost: "",
    rnu: "",
    po: "",
    mt: "",
    uchMt: "",
    routeType: "",
    routeNum: 0,
    toType: "",
    toNum: "0",
    saType: "",
    saTransmitterType: "",
    saTransmitterNum: 0,
    tbType: "",
    tbNum: 0,
    muType: "",
    muNum: 0,
    docType: "",
    docSubtype: "",
    tou: "",
    touNum: 0,
    paramList: [
      {
        dataType: "",
        paramGroup: "",
        param: "",
        paramNum: 0,
        comment: "",
      },
    ],
  }; //инициализационные значения формы модального окна объекта при создании нового объекта

  const addNewObjectModalOnOpenHandler = () => {
    dispatch(iotspdActions.setObjectModalVariant("add"));
    dispatch(iotspdActions.setIsObjectModalVisible(true));
  }; //хэндлер на открытие модального окна создания нового объекта

  const addNewChildObjectModalOnOpenHandler = async () => {
    const result = await prepareInitValue();
    if (result === 12) {
      message.warn({
        content: "К выбранному объекту не может быть добавлен дочерний объект",
        duration: 4,
      });
      return;
    }
    dispatch(iotspdActions.setObjectModalVariant("addChild"));
    dispatch(iotspdActions.setIsObjectModalVisible(true));
  }; //хэндлер на открытие модального окна создания дочернего объекта от выбранного в дереве объекта

  const addObjectCopyModalOnOpenHandler = async () => {
    dispatch(
      getToNumListTC(iotspdState.modifingObjectFormInitialValues["toType"])
    );
    await prepareInitValueWithNotFullParamList();
    dispatch(iotspdActions.setObjectModalVariant("addCopy"));
    dispatch(iotspdActions.setIsObjectModalVisible(true));
  }; //хэндлер на открытие модального окна создания нового объекта по копии выбранного в дереве объекта

  const editObjectModalOnOpenHandler = async () => {
    if (iotspdState.rowData.length < 1) {
      message.warn({
        content: "Допустимо редактирование только объектов с параметрами",
        duration: 4,
      });
      return;
    }
    dispatch(
      getToNumListTC(iotspdState.modifingObjectFormInitialValues["toType"])
    );
    await prepareInitValueWithNotFullParamList();
    dispatch(iotspdActions.setObjectModalVariant("edit"));
    dispatch(iotspdActions.setIsObjectModalVisible(true));
  }; //хэндлер на открытие модального окна редактирования объекта

  const objectModalOnCloseHandler = () => {
    dispatch(iotspdActions.setObjectModalVariant(""));
    dispatch(iotspdActions.setIsObjectModalVisible(false));
  }; //хэндлер на закрытие модального окна объекта

  const objectModalOnSubmitHandler = useCallback(
    (params) => {
      dispatch(iotspdActions.setWarnFieldsMessage(""))
      if (iotspdState.objectModalVariant === "edit") {
        let paramsWithId = JSON.parse(JSON.stringify(params));
        let newParams = paramsWithId.paramList.map((param, index) => ({
          id: iotspdState.rowData[index].id,
          dataType: param.dataType,
          paramGroup: param.paramGroup,
          param: param.paramGroup,
          paramNum: param.paramGroup,
          comment: param.paramGroup,
        }));
        paramsWithId.paramList = [...newParams];
        dispatch(updateObjectTC(paramsWithId));
      }
      if (
        iotspdState.objectModalVariant === "add" ||
        iotspdState.objectModalVariant === "addChild" ||
        iotspdState.objectModalVariant === "addCopy"
      ) {
        dispatch(addParamTC(params));
      }
    },
    [
      iotspdState.objectModalVariant,
      iotspdState.modifingObjectFormInitialValues,
    ]
  ); //хэндлер по кнопке сабмита модального окна объекта

  const toTypeSelectHandler = useCallback((value) => {
    dispatch(getToNumListTC(value));
  }, []); //хэндлер для запроса спсика значений тоНам при выборе значения тоТайп

  const prepareInitValue = useCallback(() => {
    let levelNumber = iotspdState.selectedTreeObject.split("-").length;
    let newInitValue = {};
    if (levelNumber === 1) {
      newInitValue = {
        rnu: "",
        po: "",
        mt: "",
        uchMt: "",
        routeType: "",
        routeNum: 0,
        toType: "",
        toNum: "0",
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 2) {
      newInitValue = {
        po: "",
        mt: "",
        uchMt: "",
        routeType: "",
        routeNum: 0,
        toType: "",
        toNum: "0",
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 3) {
      newInitValue = {
        mt: "",
        uchMt: "",
        routeType: "",
        routeNum: 0,
        toType: "",
        toNum: "0",
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 4) {
      newInitValue = {
        uchMt: "",
        routeType: "",
        routeNum: 0,
        toType: "",
        toNum: "0",
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 5) {
      newInitValue = {
        routeType: "",
        routeNum: 0,
        toType: "",
        toNum: "0",
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 6) {
      newInitValue = {
        toType: "",
        toNum: "0",
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 7) {
      newInitValue = {
        saType: "",
        saTransmitterType: "",
        saTransmitterNum: 0,
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 8) {
      newInitValue = {
        tbType: "",
        tbNum: 0,
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 9) {
      newInitValue = {
        muType: "",
        muNum: 0,
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 10) {
      newInitValue = {
        docType: "",
        docSubtype: "",
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }

    if (levelNumber === 11) {
      newInitValue = {
        tou: "",
        touNum: 0,
        paramList: [
          {
            dataType: "",
            paramGroup: "",
            param: "",
            paramNum: 0,
            comment: "",
          },
        ],
      };
    }
    dispatch(
      iotspdActions.setModifingObjectFormInitialValuesForChildEls(newInitValue)
    );
    if (newInitValue["toType"]) {
      dispatch(getToNumListTC(newInitValue["toType"]));
    }
    return levelNumber;
  }, [iotspdState.selectedTreeObject, iotspdState.codeElems]); //хэндлер подготовки инициализационных данных при открытии модалки создания дочернего объекта от выбранного

  const prepareInitValueWithNotFullParamList = useCallback(() => {
    let paramList: Array<any> = [];
    iotspdState.rowData.map((param: any) =>
      paramList.push({
        // id: param.id,
        dataType: param.dataType,
        paramGroup: param.paramGroup,
        param: param.param,
        paramNum: param.paramNum,
        comment: param.comment,
      })
    );
    if (paramList.length < 1) {
      paramList.push({
        // id: "",
        dataType: "",
        paramGroup: "",
        param: "",
        paramNum: 0,
        comment: "",
      });
    }
    let newInitValue = {
      ost: iotspdState.codeElems.ost.toString(),
      rnu: iotspdState.codeElems.rnu.toString(),
      po: iotspdState.codeElems.po.toString(),
      mt: iotspdState.codeElems.mt.toString(),
      uchMt: iotspdState.codeElems.uchMt.toString(),
      routeType: iotspdState.codeElems.routeType.toString(),
      routeNum: iotspdState.codeElems.routenum,
      toType: iotspdState.codeElems.toType.toString(),
      toNum: iotspdState.codeElems.toNum.toString(),
      saType: iotspdState.codeElems.saType.toString(),
      saTransmitterType: iotspdState.codeElems.saTransmitterType.toString(),
      saTransmitterNum: iotspdState.codeElems.saTransmitterNum,
      tbType: iotspdState.codeElems.tbType.toString(),
      tbNum: iotspdState.codeElems.tbNum,
      muType: iotspdState.codeElems.muType.toString(),
      muNum: iotspdState.codeElems.muNum,
      docType: iotspdState.codeElems.docType.toString(),
      docSubtype: iotspdState.codeElems.docSubType.toString(),
      tou: iotspdState.codeElems.tou.toString(),
      touNum: iotspdState.codeElems.touNum,
      paramList,
    };
    newInitValue;
    dispatch(
      iotspdActions.setModifingObjectFormInitialValuesForChildEls(newInitValue)
    );
  }, [iotspdState.rowData, iotspdState.codeElems]); //хэндлер подготовки инициализационных данных при открытии модалки создания нового объекта по копии от выбранного и модалки редактирования объетка

  const objectExportHandler = useCallback(() => {
    // let object: Array<FullParamType> = [];
    // iotspdState.rowData.map((param: ParamType) =>
    //   object.push({ ...param, ...iotspdState.codeElems })
    // );
    dispatch(objectExportTC(iotspdState.codeElems));
  }, [iotspdState.codeElems]); //хэндлер по нажатию кнопки экспорта данных по выбранному в дереве объекту

  //modal - parametr
  const parametrValidationSchema = Yup.object({
    paramList: Yup.array().of(
      Yup.object({
        dataType: Yup.string().required("Поле обязательно к заполнению!"),
        paramGroup: Yup.string().required("Поле обязательно к заполнению!"),
        param: Yup.string().required("Поле обязательно к заполнению!"),
        paramNum: Yup.number().required("Поле обязательно к заполнению!"),
        comment: Yup.string().trim(),
      })
    ),
  }); //схема валидации для модального окна параметра

  const newParamsListInitialValues = {
    paramList: [
      {
        dataType: "",
        paramGroup: "",
        param: "",
        paramNum: 0,
        comment: "",
      },
    ],
  }; //инициализационные значения формы модального окна параметра при создании нового параметра выбраного объекта

  const maxCountNumberHandler = useCallback((value: string) => {
    let res = +value;
    if (res > 999999) {
      res = 999999
      message.warn('Вводимое число должно быть не больше 999 999')
    }
    return res;
  }, []) //проверка вводимого числа для инпутов в модальном окне объекта

  const addParametrModalOnOpenHandler = useCallback(() => {
    dispatch(iotspdActions.setParametrModalVariant("add"));
    dispatch(iotspdActions.setIsParametrModalVisible(true));
  }, []); //хэндлер при открытии модалки добавления нового параметра

  const editParametrModalOnOpenHandler = useCallback((params) => {
    dispatch(iotspdActions.setSelectedParamId(params.id));
    dispatch(iotspdActions.setUpdateParamFormInitialValues(params));
    dispatch(getParamItemsTC());
    dispatch(iotspdActions.setParametrModalVariant("edit"));
    dispatch(iotspdActions.setIsParametrModalVisible(true));
  }, []); //хэндлер при открытии модалки редактирования параметра

  const parametrModalOnCloseHandler = useCallback(() => {
    dispatch(iotspdActions.setParametrModalVariant(""));
    dispatch(iotspdActions.setSelectedParamId(""));
    dispatch(iotspdActions.setIsParametrModalVisible(false));
  }, []); //хэндлер на закрытие модалки параметра

  const parametrModalOnSubmitHandler = useCallback(
    (params) => {
      if (iotspdState.parametrModalVariant === "add") {
        if (!!iotspdState.codeElems["ost"]) {
          dispatch(addParamTC({ ...iotspdState.codeElems, ...params }));
        }
      }
      if (iotspdState.parametrModalVariant === "edit") {
        dispatch(
          updateParamTC({
            id: iotspdState.selectedParamId,
            ...params.paramList[0],
          })
        );
      }
    },
    [
      iotspdState.codeElems,
      iotspdState.parametrModalVariant,
      iotspdState.selectedParamId,
    ]
  ); //хэндлер по сабмиту модалки параметра

  const setSelectedParamIdHandler = useCallback((id: string) => {
    dispatch(iotspdActions.setSelectedParamId(id));
  }, []); //хэндлер установки айдишника выбранного параметра

  const deleteParametrConfirmHandler = useCallback(() => {
    dispatch(deleteParamTC());
  }, []); //хэндлер при подтверждении удаления параметра

  const canceldDeleteParametr = useCallback(() => {
    message.warn("Вы отменили удаление параметра");
  }, []); //хэндлер при отмене удаления параметра

  const customTitleRender = (node: ObjectType) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {node.paramExists > 0 ? <strong>{node.title}</strong> : node.title}
      </div>
    );
  };

  const setWarnFieldsMessageHandler = useCallback((errors: any) => {
    let warnItems: Array<string> = []

    const addItem = () => {
      for (let key in errors) {
        if (key === "paramList") {
          warnItems.push("Параметр объекта")
        }
        let result = objectElementsDictionary[key]
        if (result) warnItems.push(result)
      }
    }

    for (let key in errors) {
      warnItems = []
      addItem()
    }

    if (warnItems.length > 0) {
      dispatch(iotspdActions.setWarnFieldsMessage(warnItems))
    }

  }, [
    objectElementsDictionary
  ])

  const onOpenWarnMessageHandler = useCallback(() => {
    dispatch(iotspdActions.setIsWarnMessageVisible(true))
  }, [])

  const onCloseWarnMessageHandler = useCallback(() => {
    dispatch(iotspdActions.setIsWarnMessageVisible(false))
    dispatch(iotspdActions.setWarnFieldsMessage([]))
  }, [])

  return {
    iotspdState,
    siderCollapsed,
    onSiderCollapseHandler,
    cardCollapsed,
    onCardCollapseHandler,
    setSearchValueHandler,
    setSelectedTreeObjectsHandler,
    addNewObjectModalOnOpenHandler,
    addNewChildObjectModalOnOpenHandler,
    addObjectCopyModalOnOpenHandler,
    editObjectModalOnOpenHandler,
    objectModalOnSubmitHandler,
    objectModalOnCloseHandler,
    parametrValidationSchema,
    newParamsListInitialValues,
    addParametrModalOnOpenHandler,
    editParametrModalOnOpenHandler,
    parametrModalOnCloseHandler,
    parametrModalOnSubmitHandler,
    deleteParametrConfirmHandler,
    canceldDeleteParametr,
    setSelectedParamIdHandler,
    toTypeSelectHandler,
    objectValidationSchema,
    newObjectInitialValues,
    objectExportHandler,
    onExpandTreeHandler,
    loopHandler,
    customTitleRender,
    setWarnFieldsMessageHandler,
    onCloseWarnMessageHandler,
    onOpenWarnMessageHandler,
    maxCountNumberHandler,
  };
};

export default usePresenter;
