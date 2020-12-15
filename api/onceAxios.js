import axios from "axios";

let call = {};
const onceAxios = (config = {}, requestType = 'unnamed') => {
  if (call[requestType]) {
    call[requestType].cancel('cancel request');
  }
  call[requestType] = axios.CancelToken.source();
  config.cancelToken = call[requestType].token
  return axios(config);
}
export default onceAxios;
