import React from "react";
import { IOption } from "types";
import {
  getDictionaryOstList,
  getDictionaryPspList,
  getDictionaryVerificationLevels,
  getDictionaryVerificationYears,
} from "api/requests/pspControl/dictionaries";
import { mapDictionary } from "./utils";

export const useExportOptions = () => {
  const [verificationLevels, setVerificationLevels] = React.useState<IOption[]>(
    []
  );
  const [verificationYears, setVerificationYears] = React.useState<IOption[]>(
    []
  );
  const [ostList, setOstList] = React.useState<IOption[]>([]);
  const [pspList, setPspList] = React.useState<IOption[]>([]);

  const [isLoadingOptions, setIsLoadingOptions] = React.useState(false);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoadingOptions(true);
    await fetchVerificationLevels();
    await fetchVerificationYears();
    await fetchOstList();
    setIsLoadingOptions(false);
  };

  const fetchVerificationLevels = async () => {
    const options = await getDictionaryVerificationLevels();
    setVerificationLevels(mapDictionary(options));
  };

  const fetchVerificationYears = async () => {
    const options = await getDictionaryVerificationYears();
    setVerificationYears(options.map(o => ({ value: o.label, label: o.label })));
  };

  const fetchOstList = async () => {
    const options = await getDictionaryOstList();
    setOstList(mapDictionary(options));
  };

  const fetchPspList = async (ostId: string) => {
    const options = await getDictionaryPspList(ostId);
    setPspList(mapDictionary(options));
  };

  return {
    verificationLevels,
    verificationYears,
    ostList,
    pspList,
    isLoadingOptions,
    fetchPspList,
  };
};
