import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface UserCellProps {
  name: string;
  username?: string;
  avatar?: string;
  onClick?: () => void;
  className?: string;
}

export const UserCell = ({
  name,
  username,
  avatar,
  onClick,
  className = "flex h-full items-center px-[4px] py-[12px]",
}: UserCellProps) => {
  return (
    <div className={className}>
      <div className="w-[50px] h-[50px] relative overflow-hidden rounded-lg border-2 border-[#d1d1d1] mr-[8px]">
        <Avatar className="w-full h-full">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : (
            <AvatarFallback className="text-xs">
              {name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      <div className="flex flex-col gap-[2px] h-full items-start justify-center">
        {onClick ? (
          <button
            className="font-semibold text-[14px] text-[#1a71f6] leading-[1.3] hover:underline text-left"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {name}
          </button>
        ) : (
          <span className="font-semibold text-[14px] text-[#272424] leading-[1.3]">
            {name}
          </span>
        )}
        {username && (
          <span className="font-medium text-[12px] text-[#737373] leading-[1.3]">
            @{username}
          </span>
        )}
      </div>
    </div>
  );
};

export interface StatusCellProps {
  status: "active" | "inactive" | "disabled" | string;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export const StatusCell = ({
  status,
  activeLabel = "Đang kích hoạt",
  inactiveLabel = "Ngừng kích hoạt",
  className = "flex gap-[4px] h-full items-center px-[4px] py-[12px]",
}: StatusCellProps) => {
  const isActive = status === "active";

  return (
    <div className={className}>
      <div
        className={`rounded-[10px] ${
          isActive ? "bg-[#b2ffb4]" : "bg-[#ffdcdc]"
        }`}
      >
        <div className="flex gap-[10px] items-center justify-center px-[8px] py-[6px]">
          <span
            className={`font-semibold text-[14px] leading-[1.4] ${
              isActive ? "text-[#04910c]" : "text-[#eb2b0b]"
            }`}
          >
            {isActive ? activeLabel : inactiveLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export interface CurrencyCellProps {
  amount: number;
  currency?: string;
  locale?: string;
  subtitle?: string;
  className?: string;
}

export const CurrencyCell = ({
  amount,
  currency = "đ",
  locale = "vi-VN",
  subtitle,
  className = "flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px]",
}: CurrencyCellProps) => {
  return (
    <div className={className}>
      <span className="font-medium text-[#272424] text-[14px] leading-[1.4]">
        {amount.toLocaleString(locale)}
        {currency}
      </span>
      {subtitle && (
        <span className="font-medium text-[#737373] text-[12px] leading-[1.3]">
          {subtitle}
        </span>
      )}
    </div>
  );
};

export interface TextCellProps {
  text: string;
  subtitle?: string;
  truncate?: boolean;
  className?: string;
}

export const TextCell = ({
  text,
  subtitle,
  truncate = false,
  className = "flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px]",
}: TextCellProps) => {
  return (
    <div className={className}>
      <span
        className={`font-medium text-[#272424] text-[14px] leading-[1.4] ${truncate ? "truncate" : ""}`}
      >
        {text}
      </span>
      {subtitle && (
        <span className="font-medium text-[#737373] text-[12px] leading-[1.3]">
          {subtitle}
        </span>
      )}
    </div>
  );
};
