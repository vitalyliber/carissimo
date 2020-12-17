import onceAxios from "./onceAxios";
import axios from "axios";
import { endpoint } from "./credentials";
import cookieCutter from "cookie-cutter";

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
  const token = await cookieCutter.get("token");
  return axios({
    method: "post",
    url: `${endpoint}/car_goods`,
    data: { good: data, token },
  }).then(({ data }) => {
    console.log("createGood", data);
    return data;
  });
};

export const editGood = async ({ data, id }) => {
  const token = await cookieCutter.get("token");
  return axios({
    method: "patch",
    url: `${endpoint}/car_goods/${id}`,
    data: { good: data, token },
  }).then(({ data }) => {
    console.log("editGood", data);
    return data;
  });
};

export const deleteGood = async (id) => {
  const token = await cookieCutter.get("token");
  return axios({
    method: "delete",
    url: `${endpoint}/car_goods/${id}`,
    params: { token },
  }).then(({ data }) => {
    console.log("deleteGood", data);
    return data;
  });
};
