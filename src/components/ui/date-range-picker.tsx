import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/ui/form-input";
import type { DateRange } from "react-day-picker";

export interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  minDate?: Date;
  containerClassName?: string;
  error?: string;
  disabled?: boolean;
  showTime?: boolean; // Whether to show time picker
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  containerClassName,
  error,
  disabled = false,
  showTime = true,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTimeInputs, setShowTimeInputs] = useState(false);

  // Convert string dates to Date objects
  const startDateObj = startDate ? new Date(startDate) : undefined;
  const endDateObj = endDate ? new Date(endDate) : undefined;

  const dateRange: DateRange | undefined =
    startDateObj && endDateObj
      ? { from: startDateObj, to: endDateObj }
      : startDateObj
        ? { from: startDateObj, to: undefined }
        : undefined;

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range) {
      onStartDateChange("");
      onEndDateChange("");
      return;
    }

    if (range.from) {
      // If startDate already exists, preserve the time part
      let fromDate = new Date(range.from);
      if (startDate) {
        const existingStart = new Date(startDate);
        fromDate.setHours(existingStart.getHours(), existingStart.getMinutes(), 0, 0);
      } else {
        fromDate.setHours(0, 0, 0, 0);
      }
      const formattedStart = format(fromDate, "yyyy-MM-dd'T'HH:mm");
      onStartDateChange(formattedStart);
    }

    if (range.to) {
      // If endDate already exists, preserve the time part
      let toDate = new Date(range.to);
      if (endDate) {
        const existingEnd = new Date(endDate);
        toDate.setHours(existingEnd.getHours(), existingEnd.getMinutes(), 0, 0);
      } else {
        toDate.setHours(23, 59, 0, 0);
      }
      const formattedEnd = format(toDate, "yyyy-MM-dd'T'HH:mm");
      onEndDateChange(formattedEnd);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartDateChange("");
    onEndDateChange("");
  };

  // Show time inputs when both dates are selected
  useEffect(() => {
    if (startDateObj && endDateObj) {
      setShowTimeInputs(true);
    }
  }, [startDateObj, endDateObj]);

  const displayText = () => {
    if (startDateObj && endDateObj) {
      if (showTime) {
        return `${format(startDateObj, "dd/MM/yyyy HH:mm", { locale: vi })} - ${format(endDateObj, "dd/MM/yyyy HH:mm", { locale: vi })}`;
      }
      return `${format(startDateObj, "dd/MM/yyyy", { locale: vi })} - ${format(endDateObj, "dd/MM/yyyy", { locale: vi })}`;
    }
    if (startDateObj) {
      if (showTime) {
        return `${format(startDateObj, "dd/MM/yyyy HH:mm", { locale: vi })} - ...`;
      }
      return `${format(startDateObj, "dd/MM/yyyy", { locale: vi })} - ...`;
    }
    return "Chọn khoảng thời gian";
  };

  const handleTimeChange = (type: "start" | "end", time: string) => {
    const dateStr = type === "start" ? startDate : endDate;
    if (!dateStr) return;

    const date = new Date(dateStr);
    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours || 0, minutes || 0, 0, 0);

    const formatted = format(date, "yyyy-MM-dd'T'HH:mm");
    if (type === "start") {
      onStartDateChange(formatted);
    } else {
      onEndDateChange(formatted);
    }
  };

  const getTimeValue = (dateStr: string) => {
    if (!dateStr) return "00:00";
    const date = new Date(dateStr);
    return format(date, "HH:mm");
  };

  return (
    <div className={cn("flex flex-col gap-[8px]", containerClassName)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-[36px] w-full justify-start text-left font-normal border-2 rounded-[8px] px-[12px]",
              !startDateObj && !endDateObj && "text-[#888888]",
              error && "border-red-500",
              !error && "border-[#272424] hover:border-[#272424]"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-[14px] truncate text-left">
              {displayText()}
            </span>
            {(startDateObj || endDateObj) && !disabled && (
              <X
                className="ml-2 h-4 w-4 flex-shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={startDateObj || minDate || new Date()}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              disabled={(date) => {
                if (minDate) {
                  return date < minDate;
                }
                return false;
              }}
              className="rounded-md border-0"
            />
            {showTime && showTimeInputs && startDateObj && endDateObj && (
              <div className="border-t border-gray-200 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span>Thiết lập giờ</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Thời gian bắt đầu</label>
                    <FormInput
                      type="time"
                      value={getTimeValue(startDate)}
                      onChange={(e) => handleTimeChange("start", e.target.value)}
                      containerClassName="h-[36px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Thời gian kết thúc</label>
                    <FormInput
                      type="time"
                      value={getTimeValue(endDate)}
                      onChange={(e) => handleTimeChange("end", e.target.value)}
                      containerClassName="h-[36px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <span className="text-red-500 text-[12px] font-medium">{error}</span>
      )}
    </div>
  );
}

export default DateRangePicker;

