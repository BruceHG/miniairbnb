import Cookies from 'universal-cookie';

const DEBUG_IN_LOCAL = false;
const COOKIE_KEY_CURRENT_USER = 'COOKIE_KEY_CURRENT_USER';

export const BACKEND_URL = DEBUG_IN_LOCAL ? 'http://login.cse.unsw.edu.au:8007' : '';
export const DEFAULT_AVATAR = 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Libai_touxiang.jpg';


export var UserStatus = { 'GUEST': 0, 'HOST_PENDING': 1, 'HOST': 2, 'ADMIN': 3 };
export var AccomType = { 0: 'House', 1: 'Flat', 2: 'Apartment', 3: 'Townhouse', 4: 'Others' };
export var CancelRule = { 0: 'Free cancel', 1: 'Free cancel before 24h', 2: 'Charging 10% for cancellation' };
export var BuildinFeaturesName = { 0: 'Wi-Fi', 1: 'Parking', 2: 'Air conditioning' };
export var BuildinFeaturesIcon = {
    0: "m12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm5.92-5.78a.5.5 0 1 1 -.84.55c-1.19-1.81-3.07-2.77-5.08-2.77s-3.89.96-5.08 2.78a.5.5 0 0 1 -.84-.55c1.38-2.1 3.58-3.23 5.92-3.23s4.54 1.13 5.92 3.23zm2.98-3.03a.5.5 0 1 1 -.79.61c-1.66-2.14-5.22-3.8-8.11-3.8-2.83 0-6.26 1.62-8.12 3.82a.5.5 0 0 1 -.76-.65c2.05-2.42 5.75-4.17 8.88-4.17 3.19 0 7.05 1.8 8.9 4.19zm2.95-2.33a.5.5 0 0 1 -.71-.02c-2.94-3.07-6.71-4.84-11.14-4.84s-8.2 1.77-11.14 4.85a.5.5 0 0 1 -.72-.69c3.12-3.27 7.14-5.16 11.86-5.16s8.74 1.89 11.86 5.16a.5.5 0 0 1 -.02.71z",
    1: "m12 0c-6.63 0-12 5.37-12 12s5.37 12 12 12 12-5.37 12-12-5.37-12-12-12zm0 23c-6.07 0-11-4.92-11-11s4.93-11 11-11 11 4.93 11 11-4.93 11-11 11zm .5-17h-4.5v11.5a.5.5 0 0 0 1 0v-4.5h3.5c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5zm0 6h-3.5v-5h3.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z",
    2: "m21.89 18a .5.5 0 0 1 -.68.18l-3.29-1.9.79 2.93a.5.5 0 0 1 -.97.26l-1.04-3.89-4.7-2.71v5.43l2.85 2.85a.5.5 0 1 1 -.71.71l-2.14-2.15v3.79a.5.5 0 1 1 -1 0v-3.79l-2.15 2.15a.5.5 0 1 1 -.71-.71l2.86-2.86v-5.43l-4.7 2.72-1.04 3.9a.5.5 0 1 1 -.97-.26l.79-2.93-3.28 1.9a.5.5 0 0 1 -.5-.87l3.28-1.9-2.93-.79a.5.5 0 0 1 -.35-.61.51.51 0 0 1 .61-.35l3.89 1.04 4.7-2.71-4.7-2.71-3.9 1.04a.5.5 0 0 1 -.61-.35.5.5 0 0 1 .35-.61l2.93-.79-3.28-1.9a.5.5 0 1 1 .5-.87l3.28 1.9-.78-2.93a.5.5 0 0 1 .97-.26l1.04 3.9 4.7 2.71v-5.42l-2.85-2.86a.5.5 0 1 1 .71-.71l2.14 2.15v-3.79a.5.5 0 1 1 1 0v3.79l2.15-2.15a.5.5 0 1 1 .71.71l-2.86 2.86v5.43l4.7-2.71 1.04-3.9a.5.5 0 1 1 .97.26l-.79 2.93 3.29-1.9a.5.5 0 1 1 .5.87l-3.29 1.89 2.93.79a.5.5 0 1 1 -.26.97l-3.89-1.05-4.7 2.71 4.7 2.71 3.9-1.05a.5.5 0 0 1 .26.97l-2.93.79 3.29 1.9a.5.5 0 0 1 .18.68z"
};
export var OrderStatus = { 'Pending': 0, 'Accepted': 1, 'Completed': 2, 'Declined': 3, 'Rated': 4 };
Object.freeze(UserStatus);
Object.freeze(AccomType);
Object.freeze(CancelRule);
Object.freeze(BuildinFeaturesName);
Object.freeze(BuildinFeaturesIcon);
Object.freeze(OrderStatus);

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

export function getOrderDisplayStatus(id) {
    if (id == OrderStatus.Rated) {
        id = OrderStatus.Completed;
    }
    return Object.keys(OrderStatus).find(key => OrderStatus[key] === id);
}