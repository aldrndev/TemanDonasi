import React, { useState, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useClickAway } from 'react-use';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();

  const userData = {
    username: localStorage.getItem('username'),
    profilePicture: 'https://placekitten.com/200',
  };

  useClickAway(userMenuRef, () => {
    if (userMenuOpen) setUserMenuOpen(false);
  });

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center shadow-md">
      <div>{/* Konten sebelah kiri seperti logo atau judul aplikasi */}</div>

      <div className="flex items-center">
        <span className="text-gray-900 mr-4">Welcome, {userData.username}</span>

        <div ref={userMenuRef} className="relative">
          <button onClick={toggleUserMenu} className="focus:outline-none">
            {userData.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUserCircle className="text-white text-2xl" />
            )}
          </button>

          {userMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                {/* Item-menu berikut harus diperbarui dengan fungsi navigasi/link yang sesuai */}
                {/* <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Your Profile
                </a> */}
                <a
                  onClick={() => logoutHandler()}
                  href=""
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
