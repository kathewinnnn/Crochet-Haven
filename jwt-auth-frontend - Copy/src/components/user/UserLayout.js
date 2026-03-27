import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import './App.css';

const UserLayout = () => {
  return (
    <div className="user-layout">
      <UserSidebar />
      <main className="user-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
