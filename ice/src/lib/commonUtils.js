import Cookies from 'universal-cookie';

const DEBUG_IN_LOCAL = false;
const COOKIE_KEY_CURRENT_USER = 'COOKIE_KEY_CURRENT_USER';

export const BACKEND_URL = DEBUG_IN_LOCAL ? 'http://login.cse.unsw.edu.au:8000' : '';

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