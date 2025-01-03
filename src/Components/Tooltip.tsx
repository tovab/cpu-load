import React from "react";
import "./Tooltip.css";

type TooltipProps = {
    text: string
}

const Tooltip = ({ text }: TooltipProps) => {
  return (
    <div className="tooltip-container">
        <span className="info-icon">i</span>
        <span className="tooltip-text">{text}</span>
    </div>
  );
};

export default Tooltip;
