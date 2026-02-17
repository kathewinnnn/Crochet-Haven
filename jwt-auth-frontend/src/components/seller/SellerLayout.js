import React, { useState } from "react";
import SellerSidebar from "./SellerSidebar";
import CrudApp from "./CrudApp";
import Dashboard from "./Dashboard";
import Categories from "./Categories";
import Order from "./Order";
import Reports from "./Reports";
import Settings from "./Settings";
import Profile from "./Profile";

const SellerLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;

      case "add-product":
        return <CrudApp />;

      case "categories":
        return <Categories />;

      case "orders":
        return <Order />;
        
      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      case "profile":
        return <Profile />;

      default:
        return null;
    }
  };

  return (
    <div>
      <SellerSidebar setActivePage={setActivePage} activePage={activePage} />
      <main style={{ marginLeft: "250px", padding: "20px 20px 20px 70px" }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default SellerLayout;
