import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      disabled={disabled}
      className={`relative w-[44px] h-[24px] rounded-full transition-all duration-300 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${
        checked
          ? "bg-[#4cd964] hover:bg-[#45c45a]"
          : "bg-[#d1d1d6] hover:bg-[#b8b8bd]"
      } ${className}`}
    >
      {/* Toggle circle */}
      <div
        className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full transition-all duration-300 shadow-md ${
          checked
            ? "translate-x-[22px] shadow-[0_2px_4px_rgba(76,217,100,0.4)]"
            : "translate-x-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        }`}
      >
        {/* Inner shine effect */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            checked ? "opacity-20" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent)",
          }}
        />
      </div>
    </button>
  );
};

export default ToggleSwitch;
