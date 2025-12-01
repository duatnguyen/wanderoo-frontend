import React, { useState } from "react";
import { Input, Popover } from "antd";
import { type Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Convert Dayjs to Date for Calendar
  const dateRange: DateRange | undefined = startDate || endDate
    ? {
      from: startDate ? startDate.toDate() : undefined,
      to: endDate ? endDate.toDate() : undefined,
    }
    : undefined;

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      onStartDateChange(dayjs(range.from));
    } else {
      onStartDateChange(null);
    }

    if (range?.to) {
      onEndDateChange(dayjs(range.to));
    } else {
      onEndDateChange(null);
    }
  };

  const handleClearDates = () => {
    onStartDateChange(null);
    onEndDateChange(null);
    setOpen(false);
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate.format("DD/MM/YYYY")} - ${endDate.format("DD/MM/YYYY")}`;
    }
    if (startDate) {
      return `Từ ${startDate.format("DD/MM/YYYY")}`;
    }
    return "Chọn khoảng thời gian";
  };

  const calendarContent = (
    <div className="p-3">
      <Calendar
        mode="range"
        numberOfMonths={2}
        selected={dateRange}
        onSelect={handleDateSelect}
        className="rounded-md border"
      />
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearDates}
          className="text-xs"
        >
          Xóa
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setOpen(false)}
          className="text-xs"
        >
          Áp dụng
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search Input */}
      <div className="flex-1 min-w-0">
        <Input.Search
          placeholder="Tìm kiếm đơn hàng theo ID đơn hàng hoặc tên sản phẩm"
          allowClear
          enterButton
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full"
          onSearch={(value) => {
            // hook tích hợp backend sau; hiện tại chỉ log để demo
            console.log("Search orders by id or product name:", value);
          }}
        />
      </div>

      {/* Date Range Picker */}
      <Popover
        content={calendarContent}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottomRight"
        overlayClassName="date-range-popover"
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">{formatDateRange()}</span>
        </Button>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
