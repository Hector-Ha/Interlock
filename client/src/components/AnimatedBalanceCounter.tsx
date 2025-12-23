"use client";
import React from "react";
import CountUp from "react-countup";

// Easing function
const easeOutQuart = (t: number, b: number, c: number, d: number) => {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

const AnimatedBalanceCounter = ({ amount }: { amount: number }) => {
  /* TODO: Format currency based on locale || User choice */
  return (
    <div className="full-w">
      <CountUp
        start={0}
        end={amount}
        duration={4}
        prefix="$"
        useEasing={true}
        easingFn={easeOutQuart}
        decimals={2}
        separator=","
        decimal="."
      />
    </div>
  );
};

export default AnimatedBalanceCounter;
