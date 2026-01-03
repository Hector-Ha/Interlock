import React from "react";
import HeaderBox from "@/components/shared/HeaderBox";
import { first } from "slate";
import TotalBalanceBox from "@/components/features/bank/TotalBalanceBox";
import RightSideBar from "@/components/layout/RightSideBar";

const Dashboard = () => {
  const loggedInUser = {
    id: "1",
    email: "hector@example.com",
    firstName: "Hector",
    lastName: "Ha",
  };

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
              accounts={[]}
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
