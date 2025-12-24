import React from "react";
import HeaderBox from "@/src/components/HeaderBox";
import { first } from "slate";
import TotalBalanceBox from "@/src/components/TotalBalanceBox";
import RightSideBar from "@/src/components/RightSideBar";

const Dashboard = () => {
  const loggedInUser = { firstName: "Hector", lastName: "Ha" };

  return (
    <div>
      <section className="home no-scrollbar">
        Home
        <div className="home-content no-scrollbar">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome, "
              user={loggedInUser.firstName || "Guest"}
              subtext="Access and manage your account and transactions efficiently"
            />

            <TotalBalanceBox
              account={[]}
              totalBanks={0}
              totalCurrentBalance={100000}
            />
          </header>
        </div>
      </section>
      <RightSideBar user={loggedInUser} transactions={[]} banks={[]} />
    </div>
  );
};

export default Dashboard;
