import request from '../utils/request.js'

// 发送验证码
export const getCode = (data) => {
    return request.post('/get/code', data)
}

export const UserAuthentication = (data) => {
    return request.post('/user/authentication', data)
}

// 登录
export const Login = (data) => {
    return request.post('/login', data)
}

// 权限管理列表
export const AuthAdmin = (params) => {
    return request.get('/auth/admin', { params })
}

// 菜单权限数据
export const UserGetmenu = () => {
    return request.get('/user/getmenu'); // 该请求会自动携带 x-token
};

// 菜单权限修改
export const UserSetmenu = (data) => {
    return request.post('/user/setmenu', data)
}

// 菜单权限列表
export const MenuList = (params) => {
    return request.get('/menu/list', { params })
}

// 权限下拉列表
export const MenuSelectlist = () => {
    return request.get('/menu/selectlist')
}

// 用户信息修改
export const UpdateUser = (data) => {
    return request.post('/update/user', data)
}

// 用户菜单权限
export const MenuPermissions = () => {
    return request.get('/menu/permissions')
}

// 陪护师头像列表
export const PhotoList = () => {
    return request.get('/photo/list')
}

// 陪护师创建
export const Companion = (data) => {
    return request.post('/companion', data)
}

// 陪护师列表
export const CompanionList = (params) => {
    return request.get('/companion/list', { params })
}

// 陪护师删除
export const DeleteCompanion = (data) => {
    return request.post('/delete/companion', data)
}
// 订单列表
export const AdminOrder = (params) => {
    return request.get('/admin/order', { params })
}

// 服务状态完成
export const UpdateOrder = (data) => {
    return request.post('/update/order', data)
}