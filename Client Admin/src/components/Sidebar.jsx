import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaRegListAlt,
  FaGift,
  FaHistory,
  FaAddressCard,
  FaAddressBook,
} from 'react-icons/fa';

import { BsFillBox2HeartFill } from 'react-icons/bs';

import { RxDashboard } from 'react-icons/rx';

const Sidebar = () => {
  const location = useLocation();
  const NavItem = ({ name, route, icon, currentPath }) => {
    const isActive = route === currentPath;

    return (
      <li className="mb-1 last:mb-0">
        <NavLink
          to={route}
          className={`block px-4 py-2 rounded transition-colors duration-200 ${
            isActive
              ? 'bg-cyan-600 text-white'
              : 'hover:bg-cyan-600 hover:text-white'
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">{icon}</span>
            {name}
          </div>
        </NavLink>
      </li>
    );
  };

  return (
    <div className="h-screen sticky top-0 flex-none w-64 bg-white shadow-md">
      <div className="flex flex-col justify-between h-full">
        <div className="p-4">
          <div className="flex items-center justify-center h-30 w-48 mb-5 mx-auto">
            <img
              src="https://cdn.discordapp.com/attachments/1157240510902186075/1164866945892487229/logothing2a.png"
              alt="logo"
            />
          </div>
          <nav>
            <p className="text-xl font-semibold pb-1 text-gray-700 flex justify-center items-center">
              User Management
            </p>
            <hr className="my-3 mb-3" />
            <ul>
              <NavItem
                name="Dashboard"
                route="/dashboard"
                icon={<RxDashboard />}
                currentPath={location.pathname}
              />
              <NavItem
                name="Campaign"
                route="/campaign"
                icon={<FaRegListAlt />}
                currentPath={location.pathname}
              />
              <NavItem
                name="User Donation"
                route="/user-donation"
                icon={<BsFillBox2HeartFill />}
                currentPath={location.pathname}
              />
              <NavItem
                name="User List"
                route="/user-list"
                icon={<FaAddressBook />}
                currentPath={location.pathname}
              />
            </ul>

            <p className="text-xl font-semibold pb-1 mt-5 text-gray-700 flex justify-center items-center">
              Admin Management
            </p>
            <hr className="my-3 mb-3" />
            <ul>
              <NavItem
                name="Reward"
                route="/reward"
                icon={<FaGift />}
                currentPath={location.pathname}
              />
              <NavItem
                name="Redeem History"
                route="/redeem-history"
                icon={<FaHistory />}
                currentPath={location.pathname}
              />
              <NavItem
                name="Register Admin"
                route="/register"
                icon={<FaAddressCard />}
                currentPath={location.pathname}
              />
              <NavItem
                name="Admin List"
                route="/admin-list"
                icon={<FaAddressBook />}
                currentPath={location.pathname}
              />
            </ul>
          </nav>
        </div>
        <div className="p-4"></div>
      </div>
    </div>
  );
};

export default Sidebar;
