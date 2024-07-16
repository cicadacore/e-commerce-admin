import { webRoutes } from '../../routes/web';
import { BiHomeAlt2 } from 'react-icons/bi';
import { BiSolidCategory } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { CgProductHunt } from 'react-icons/cg';

export const sidebar = [
  {
    path: webRoutes.dashboard,
    key: webRoutes.dashboard,
    name: 'Dashboard',
    icon: <BiHomeAlt2 />,
  },
  // {
  //   path: webRoutes.customers,
  //   key: webRoutes.customers,
  //   name: 'Customers',
  //   icon: <AiOutlineUser />,
  // },
  {
    path: webRoutes.categories,
    key: webRoutes.categories,
    name: 'Categories',
    icon: <BiSolidCategory />,
  },
  {
    path: webRoutes.products,
    key: webRoutes.products,
    name: 'Products',
    icon: <CgProductHunt />,
  },
];
