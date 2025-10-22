// src/pages/admin/AdminStaff.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusButton from "@/components/ui/status-button";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/ui/pagination";

type Staff = {
  id: string;
  name: string;
  username: string;
  role: string;
  status: "active" | "disabled";
  avatar?: string;
};

const mockStaff: Staff[] = [
  {
    id: "S001",
    name: "Nguyễn Thị Thanh",
    username: "nguyenthanh",
    role: "Quản lý",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
  {
    id: "S002",
    name: "Hoàng Văn Thụ",
    username: "hoangthu",
    role: "Nhân viên",
    status: "active",
    avatar: "/api/placeholder/70/70",
  },
  {
    id: "S003",
    name: "Lã Thị Duyên",
    username: "laduen",
    role: "Nhân viên",
    status: "disabled",
    avatar: "/api/placeholder/70/70",
  },
];

const AdminStaff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "disabled"
  >("all");
  const [staff] = useState<Staff[]>(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.username.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [staff, statusFilter, searchTerm]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStaff(new Set(filtered.map((s) => s.id)));
    } else {
      setSelectedStaff(new Set());
    }
  };

  const handleSelectItem = (staffId: string, checked: boolean) => {
    const newSelected = new Set(selectedStaff);
    if (checked) {
      newSelected.add(staffId);
    } else {
      newSelected.delete(staffId);
    }
    setSelectedStaff(newSelected);
  };

  const handleActivateSelected = () => {
    // TODO: Implement activation logic
    console.log("Activating selected staff:", Array.from(selectedStaff));
  };

  const handleDeactivateSelected = () => {
    // TODO: Implement deactivation logic
    console.log("Deactivating selected staff:", Array.from(selectedStaff));
  };

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">
            Tài khoản nhân viên
          </h1>
          <p className="text-sm text-gray-500 ">
            Danh sách tài khoản nhân viên
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/admin/staff/new")}
            className="bg-[#e04d30] text-white hover:bg-[#d04327]"
            size="sm"
          >
            Thêm tài khoản nhân viên
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="mb-4 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 flex items-center gap-3">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm"
                />
                <StatusButton
                  status={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow
                className={
                  selectedStaff.size > 0 ? "bg-neutral-50" : "bg-gray-50"
                }
              >
                <TableHead className="w-[240px]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedStaff.size === filtered.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                    {selectedStaff.size > 0 && (
                      <span className="font-semibold text-[#272424] text-[14px]">
                        Đã chọn {selectedStaff.size} tài khoản
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[240px]">
                  {!selectedStaff.size && "Tài khoản"}
                </TableHead>
                <TableHead className="w-[200px]">
                  {!selectedStaff.size && "Vai trò"}
                </TableHead>
                <TableHead>
                  <div className={selectedStaff.size > 0 ? "flex" : ""}>
                    {selectedStaff.size > 0 ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-2 border-[#E04D30] text-[#E04D30] bg-white hover:bg-white/90 font-bold"
                          size="sm"
                          onClick={handleDeactivateSelected}
                        >
                          Ngừng kích hoạt
                        </Button>
                        <Button
                          className="bg-[#E04D30] text-white hover:bg-[#d04327] font-bold"
                          size="sm"
                          onClick={handleActivateSelected}
                        >
                          Kích hoạt
                        </Button>
                      </div>
                    ) : (
                      "Trạng thái"
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-gray-50">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedStaff.has(s.id)}
                      onChange={(e) => handleSelectItem(s.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {s.avatar ? (
                          <AvatarImage src={s.avatar} alt={s.name} />
                        ) : (
                          <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{s.role}</p>
                  </TableCell>
                  <TableCell>
                    {s.status === "active" ? (
                      <Badge className="text-xs bg-green-100 text-green-800">
                        Đang kích hoạt
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-red-100 text-red-800">
                        Đã khóa
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            current={1}
            total={staff.length}
            pageSize={10}
            onChange={(p) => console.log("page", p)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStaff;
