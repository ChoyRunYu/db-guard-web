import axios from "axios";
// src/utils/axios.js
import { ElMessage } from 'element-plus'


// 创建Axios实例
const instance = axios.create({
  baseURL: '/db_guard',
  timeout: 30000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    console.log('请求拦截器', config);
    return config;
  },
  error => {
    ElMessage.error('请求超时')
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const res = response.data;

    if (res.code === 0) {
      return res;
    } 
    else {
      ElMessage.error(res.message)

      return Promise.reject({
        message: res.message || 'Error',
        status: res.code
      });
    }
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

export default instance;