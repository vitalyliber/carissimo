import onceAxios from "./onceAxios";
import axios from "axios";
import { endpoint } from "./credentials";

export const getGoods = async (url) => {
  return onceAxios({
    method: "get",
    url: url,
  }).then(({ data }) => {
    console.log("getGoods", data);
    return data;
  });
};

export const createGood = async (data) => {
  return axios({
    method: "post",
    url: `${endpoint}/car_goods`,
    data: { good: data },
  }).then(({ data }) => {
    console.log("createGood", data);
    return data;
  });
};
