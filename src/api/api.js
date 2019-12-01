import axios from 'axios';
import qs from 'qs'
//let base = '';

//export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

//后端登录
export function requestLogin(loginParams) {

    return axios.post('/admin/login',loginParams)
}
//管理用户信息修改
export function EditAdmininfo(id,nickname,headimg) {

    return axios.post('/admin/editadmin',qs.stringify({
        id:id,
        nickname:nickname,
        headimg:headimg,
    }))
}
//管理用户密码修改
export function EditAdminPwd(id,oldpwd,newpwd) {

    return axios.post('/admin/editpwd',qs.stringify({
        id:id,
        oldpwd:oldpwd,
        newpwd:newpwd,
    }))
}

//vip统计
export function vipcount() {
    return axios.post('/count/vipcount')
}