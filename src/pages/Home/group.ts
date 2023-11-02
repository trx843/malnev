const useGroup = () => {
  const userContext = JSON.parse(String(localStorage.getItem("userContext")));

  const isUIB = userContext.groupsList.length && userContext.groupsList[0].name === "TKO_UIB";

  return isUIB;
};

export default useGroup;