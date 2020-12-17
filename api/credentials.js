import axios from "axios";

export const endpoint = 'https://gym-server.casply.com'

export const checkAuth = async (params) => {
  return axios({
    method: "post",
    url: `${endpoint}/car_goods/auth`,
    params,
  }).then(({ data }) => {
    console.log("getGoods", data);
    return data;
  });
};
