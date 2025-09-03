import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCommon } from '../../context/CommonContext';
import { useAuth } from '../../context/AuthContext';
import CreatePostModal from '../common/CreatePostModal';
import GlowModeModal from '../common/GlowModeModal';
import logo from '../../assets/images/logo.jpg';
// icons 
import { GoHome } from "react-icons/go";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaLandMineOn, FaRegUser } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";



const navItems = [
  { to: '/', label: 'Home', icon: <GoHome /> },
  { to: '/notifications', label: 'Alerts', icon: <IoNotificationsOutline /> },
  { to: null, label: 'Add', icon: <IoMdAddCircleOutline />, action: 'create-post' },
  { to: '/chat', label: 'Chat', icon: <IoChatboxEllipsesOutline /> },
  { to: '/profile', label: 'Me', icon: <FaRegUser /> },
];

export default function Header() {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isGlowModeModalOpen, setIsGlowModeModalOpen] = useState(false);
  const { 
    showSearch, 
    toggleSearch, 
    closeSearch,
    glowEnabled,
    glowBtnVisible,
    toggleGlowMode,
    setGlowMode,
    setGlowButtonVisibility
  } = useCommon();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('glowMode');
    if (saved !== null) {
      const glowMode = JSON.parse(saved);
      document.documentElement.classList.toggle('glow-mode', glowMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('glow-mode', glowEnabled);
  }, [glowEnabled]);

  // Make glow button always visible
  useEffect(() => {
    setGlowButtonVisibility(true);
  }, []);

  const handleNavItemClick = (item) => {
    if (item.action === 'create-post') {
      setIsCreatePostModalOpen(true);
    } else if (item.to) {
      navigate(item.to);
    }
  };

  const handleGlowModeSave = (glowData) => {
    console.log('GlowMode settings saved:', glowData);
    // Enable glow mode after successful submission
    setGlowMode(true);
    setIsGlowModeModalOpen(false);
  };

  const isActiveRoute = (itemTo) => {
    if (!itemTo) return false;
    if (itemTo === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(itemTo);
  };

  return (
    <>
      {/* Top header (visible on all sizes) */}
      <header className="sticky top-0 bg-[#f9f9f9]/95 backdrop-blur z-40 border-b border-[#ff5500]/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto object-contain rounded-md"
            />
          </NavLink>

          {/* Center nav (desktop only) */}
          <nav className="hidden md:flex items-center gap-6 text-black">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => handleNavItemClick(item)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${isActiveRoute(item.to)
                  ? 'bg-[#FFE1CC] text-[#FF5500] shadow-md font-bold'
                  : 'hover:text-black hover:bg-[#ff5500]/10'
                  }`}
              >
                <div className='text-2xl'>{item.icon}</div>
                <span>{item.label}</span>

              </button>
            ))}
          </nav>
          {/* Right icons + auth + glow toggle */}
          <div className="flex items-center gap-4">

            {/* Authentication status */}
            {/* {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#ff5500]">Welcome, {user?.name || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-[#ff5500] text-white rounded-lg hover:bg-[#e64d00] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-3 py-1 text-sm bg-[#ff5500] text-white rounded-lg hover:bg-[#e64d00] transition-colors"
              >
                Login
              </NavLink>
            )}  */}

            {/* Glow switch for home screen*/}
            <button 
              className='text-2xl cursor-pointer text-gray-600 hover:text-[#FF5500] transition-colors'
              onClick={toggleSearch}
              aria-label="Search"
            >
              <IoSearch />
            </button>
            {
              glowBtnVisible ?
                <div
                  role="switch"
                  aria-checked={glowEnabled}
                  aria-label="Enable glow mode"
                  tabIndex={0}
                  onClick={() => {
                    if (!glowEnabled) {
                      setIsGlowModeModalOpen(true);
                    } else {
                      toggleGlowMode();
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!glowEnabled) {
                        setIsGlowModeModalOpen(true);
                      } else {
                        toggleGlowMode();
                      }
                    }
                  }}
                  className={[
                    'relative h-6 w-14 rounded-full transition-colors cursor-pointer shrink-0 flex items-center px-1',
                    glowEnabled ? 'bg-[#ff5500]' : 'bg-gray-200'
                  ].join(' ')}
                >
                  <span
                    className={[
                      'h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                      glowEnabled ? 'translate-x-8' : 'translate-x-0'
                    ].join(' ')}
                  />
                </div>
                :
                <div
                  className={
                    'relative h-6 w-14 rounded-full transition-colors cursor-pointer shrink-0 flex items-center px-1 bg-transparent'} />
            }
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="w-[100vw] md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="w-full px-3 bg-white border border-[#ff5500]/20 shadow-sm flex items-center justify-between py-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => handleNavItemClick(item)}
              className={`flex flex-col items-center text-black justify-center gap-1 px-4 py-2 text-lg rounded-3xl transition-all duration-200 ${isActiveRoute(item.to)
                ? 'bg-[#FFE1CC] text-[#FF5500] shadow-md'
                : 'hover:text-black hover:bg-[#ff5500]/10'
                }`}
            >
              {item.icon}
              {/* <span className="text-xs">{item.label}</span> */}
            </button>
          ))}
        </div>
      </nav>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />

      {/* Glow Mode Modal */}
      <GlowModeModal
        isOpen={isGlowModeModalOpen}
        onClose={() => setIsGlowModeModalOpen(false)}
        onSave={handleGlowModeSave}
        setGlowEnabled={setGlowMode}
      />
    </>
  );
}
