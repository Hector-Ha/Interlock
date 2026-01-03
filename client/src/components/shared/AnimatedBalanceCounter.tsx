"use client";
import React from "react";
import CountUp from "react-countup";
// import { easeOutQuart } from "../lib/utils";

const AnimatedBalanceCounter = ({ amount }: { amount: number }) => {
  /* TODO: Format currency based on locale || User choice */
  return (
    <div className="w-full">
      <CountUp
        start={0}
        end={amount}
        duration={2.75}
        prefix="$"
        /* useEasing={true}
        easingFn={easeOutQuart} */
        decimals={2}
        separator=","
        decimal="."
      />
    </div>
  );
};

export default AnimatedBalanceCounter;
