import axios from 'axios';

//请求拦截
axios.interceptors.request.use(config => {
    // Do something before request is sent
    let token = JSON.parse(sessionStorage.getItem("token"))
        ? JSON.parse(sessionStorage.getItem("token"))
        : "";
    config.headers.Authorization = token;
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

//响应拦截
axios.interceptors.response.use(response => {
    // Do something before response is sent
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});




export default axios