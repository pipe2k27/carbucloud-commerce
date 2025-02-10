import React from "react";

const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => {
  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: "currentColor",
        borderTopColor: "transparent",
      }}
    />
  );
};

export default Spinner;
