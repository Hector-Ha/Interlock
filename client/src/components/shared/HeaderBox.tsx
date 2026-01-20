import React from "react";
import { HeaderBoxProps } from "@/types";

const HeaderBox = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
        {title}{" "}
        {type === "greeting" && (
          <span className="bg-gradient-to-r from-brand-main to-brand-hover bg-clip-text text-transparent">
            {user}
          </span>
        )}
      </h1>
      {subtext && (
        <p className="text-sm lg:text-base text-muted-foreground font-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};

export default HeaderBox;
