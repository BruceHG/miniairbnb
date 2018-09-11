import Cookies from 'universal-cookie';

const DEBUG_IN_LOCAL = true;
const COOKIE_KEY_CURRENT_USER = 'COOKIE_KEY_CURRENT_USER';

export const BACKEND_URL = DEBUG_IN_LOCAL ? 'http://127.0.0.1:8888' : '';
export const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Libai_touxiang.jpg';


export var UserStatus = { 'GUEST': 0, 'HOST_PENDING': 1, 'HOST': 2, 'ADMIN': 3 };
export var AccomType = { 'House': 0, 'Flat': 1, 'Apartment': 2, 'Townhouse': 3, 'Others': 4 };
export var CancelRule = { 'Free cancel': 0, 'Free cancel before 24h': 1, 'Charging 10% for cancellation': 2 };
export var BuildinFeatures = { 'Wi-Fi': 0, 'Parking': 1, 'Non-smoking': 2 };
Object.freeze(UserStatus);
Object.freeze(AccomType);
Object.freeze(CancelRule);
Object.freeze(BuildinFeatures);

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

export function getAccomType(id) {
    return Object.keys(AccomType).find(key => AccomType[key] === id);
}

export function getCancelRule(id) {
    return Object.keys(CancelRule).find(key => CancelRule[key] === id);
}

export function getBuildinFeatures(id) {
    return Object.keys(BuildinFeatures).find(key => BuildinFeatures[key] === id);
}