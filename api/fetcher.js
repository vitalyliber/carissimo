import axios from "axios";
import cookieCutter from "cookie-cutter";

export default async function (url) {
  const token = await cookieCutter.get("token");
  return axios({
    method: "get",
    url: `${url}?token=${token}`,
  }).then(({ data }) => {
    console.log(url, data);
    return data;
  });
}
