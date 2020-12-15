import onceAxios from "./onceAxios";

export const getGoods = async (url) => {
  return onceAxios({
    method: "get",
    url: url,
  }).then(({ data }) => {
    console.log("getGoods", data);
    return data;
  });
};

