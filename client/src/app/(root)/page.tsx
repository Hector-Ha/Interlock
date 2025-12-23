import React from "react";
import HeaderBox from "@/src/components/HeaderBox";
import { first } from "slate";
import TotalBalanceBox from "@/src/components/TotalBalanceBox";

const Dashboard = () => {
  const { firstName } = { firstName: "Hector" };

  return (
    <div>
      <section className="home">Home</section>
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome, "
            user={firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />

          <TotalBalanceBox
            account={[]}
            totalBanks={0}
            totalCurrentBalance={1000000000}
          />
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
