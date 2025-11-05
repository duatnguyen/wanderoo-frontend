import React from "react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

interface DateRangeFilterProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Lịch sử mua hàng:
      </label>
      <div className="flex items-center gap-2">
        <DatePicker
          value={startDate}
          onChange={(date) => {
            onStartDateChange(date);
            console.log("Start date selected:", date?.format("DD/MM/YYYY"));
          }}
          format="DD/MM/YYYY"
          placeholder="Từ ngày"
          className="w-[140px]"
          size="middle"
        />
        <span className="text-gray-500">-</span>
        <DatePicker
          value={endDate}
          onChange={(date) => {
            onEndDateChange(date);
            console.log("End date selected:", date?.format("DD/MM/YYYY"));
          }}
          format="DD/MM/YYYY"
          placeholder="Đến ngày"
          className="w-[140px]"
          size="middle"
          disabledDate={(current) => {
            // Disable dates before startDate
            if (startDate && current) {
              return current.isBefore(startDate, "day");
            }
            return false;
          }}
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;
