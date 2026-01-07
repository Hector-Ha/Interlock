"use client";
import React from "react";
import CountUp from "react-countup";

const AnimatedBalanceCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      <CountUp
        start={0}
        end={amount}
        duration={2.75}
        prefix="$"
        decimals={2}
        separator=","
        decimal="."
      />
    </div>
  );
};

export default AnimatedBalanceCounter;
