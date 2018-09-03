import Cookies from 'universal-cookie';

const DEBUG_IN_LOCAL = false;
const COOKIE_KEY_CURRENT_USER = 'COOKIE_KEY_CURRENT_USER';

export const BACKEND_URL = DEBUG_IN_LOCAL ? 'http://login.cse.unsw.edu.au:8000' : '';
export const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Libai_touxiang.jpg';


export var UserStatus = { 'GUEST': 0, 'HOST_PENDING': 1, 'HOST': 2, 'ADMIN': 3 };
Object.freeze(UserStatus);

export const THEME_COLOR = '#734912';

export function saveUserInfo2Cookie(userInfo) {
    let cookies = new Cookies();
    cookies.set(COOKIE_KEY_CURRENT_USER, userInfo);
}

export function getUserInfo2Cookie() {
    let cookies = new Cookies();
    return cookies.get(COOKIE_KEY_CURRENT_USER);
}

export function logout() {
    let cookies = new Cookies();
    return cookies.remove(COOKIE_KEY_CURRENT_USER);
}

export function callCustomMemberFunc(func, ...args) {
    if (typeof func == 'function') {
        func(args);
    } else {
        console.log(func + ' is not a function!');
    }
}