// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import BlankLayout from './layouts/BlankLayout';
import Home from './pages/Home';
import URegister from './pages/URegister';

import Admin from './pages/Admin';

import Accoms from './pages/Accoms';
import Detail from './pages/Detail';
import Placeorder from './pages/Placeorder';
import DetailEdit from './pages/DetailEdit';
import Orders from './pages/Orders';
import MyAds from './pages/MyAds';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import NotFound from './pages/NotFound';

const routerConfig = [
  {
    path: '/',
    layout: BlankLayout,
    component: Home,
  },
  {
    path: '/register',
    layout: BlankLayout,
    component: URegister,
  },
  {
    path: '/admin',
    layout: BlankLayout,
    component: Admin,
  },
  {
    path: '/Requests',
    layout: BlankLayout,
    component: Requests,
  },
  {
    path: '/accoms/:keyword?',
    layout: BlankLayout,
    component: Accoms,
  },
  {
    path: '/detail/:id',
    layout: BlankLayout,
    component: Detail,
  },
  {
    path: '/placeorder/:data',
    layout: BlankLayout,
    component: Placeorder,
  },
  {
    path: '/edit/:id?',
    layout: BlankLayout,
    component: DetailEdit,
  },
  {
    path: '/orders',
    layout: BlankLayout,
    component: Orders,
  },
  {
    path: '/MyAds',
    layout: BlankLayout,
    component: MyAds,
  },
  {
    path: '/profile',
    layout: BlankLayout,
    component: Profile,
  },
  {
    path: '*',
    layout: BlankLayout,
    component: NotFound,
  },
];

export default routerConfig;
