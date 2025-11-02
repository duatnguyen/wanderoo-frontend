// Ví dụ refactor AdminCustomers sử dụng các component có thể tái sử dụng
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icons/Icon";
import {
  DataTable,
  TableFilters,
  PageHeader,
  PageContainer,
  ContentCard,
  TableActions,
  UserCell,
  StatusCell,
  CurrencyCell,
  TextCell,
  type TableColumn,
  type FilterOption,
} from "@/components/common";

type Customer = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  status: "active" | "disabled";
  avatar?: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
};

const mockCustomers: Customer[] = [
  // ... mock data giống như trước
];

const AdminCustomersRefactored = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Filter options cho dropdown
  const statusFilterOptions: FilterOption[] = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "active", label: "Đang kích hoạt" },
    { value: "disabled", label: "Ngừng kích hoạt" },
  ];

  // Filtered data
  const filtered = useMemo(() => {
    const result = customers.filter((c) => {
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    if (currentPage > 1) setCurrentPage(1);
    return result;
  }, [customers, statusFilter, searchTerm, currentPage]);

  // Paginated data
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  // Table columns definition
  const columns: TableColumn[] = [
    {
      key: "customer",
      title: "Khách hàng",
      width: "w-1/4",
      minWidth: "48",
      className: "ml-[7px]",
      render: (_, record: Customer) => (
        <UserCell
          name={record.name}
          username={record.username}
          avatar={record.avatar}
          onClick={() => navigate(`/admin/customers/${record.id}`)}
        />
      ),
    },
    {
      key: "email",
      title: "Email",
      width: "w-1/4",
      minWidth: "44",
      render: (value) => <TextCell text={value} truncate />,
    },
    {
      key: "phone",
      title: "Số điện thoại",
      width: "w-1/5",
      minWidth: "32",
      render: (value) => <TextCell text={value} />,
    },
    {
      key: "totalSpent",
      title: "Tổng chi tiêu",
      width: "w-1/5",
      minWidth: "32",
      render: (_, record: Customer) => (
        <CurrencyCell
          amount={record.totalSpent}
          subtitle={`${record.totalOrders} đơn hàng`}
        />
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      width: "w-1/6",
      minWidth: "24",
      render: (value) => <StatusCell status={value} />,
    },
  ];

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedCustomers);
      paginatedCustomers.forEach((c) => newSelected.add(c.id));
      setSelectedCustomers(newSelected);
    } else {
      const newSelected = new Set(selectedCustomers);
      paginatedCustomers.forEach((c) => newSelected.delete(c.id));
      setSelectedCustomers(newSelected);
    }
  };

  const handleSelectItem = (customerId: string | number, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId as string);
    } else {
      newSelected.delete(customerId as string);
    }
    setSelectedCustomers(newSelected);
  };

  const handleDeactivateSelected = () => {
    console.log("Deactivating selected customers:", Array.from(selectedCustomers));
    setSelectedCustomers(new Set());
  };

  // Actions khi có selection
  const tableActions = selectedCustomers.size > 0 ? (
    <TableActions
      selectedCount={selectedCustomers.size}
      itemName="khách hàng"
      actions={[
        {
          label: "Đang kích hoạt",
          onClick: () => console.log("Activate selected:", Array.from(selectedCustomers)),
          variant: "primary",
        },
        {
          label: "Ngừng kích hoạt",
          onClick: handleDeactivateSelected,
          variant: "secondary",
        },
      ]}
    />
  ) : null;

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Danh sách khách hàng"
        actions={
          <Button onClick={() => navigate("/admin/customers/new")} className="h-[36px] flex-shrink-0">
            <Icon name="plus" size={16} color="#ffffff" strokeWidth={3} />
            <span className="whitespace-nowrap">Thêm mới khách hàng</span>
          </Button>
        }
      />

      {/* Content Card */}
      <ContentCard>
        {/* Filters */}
        <TableFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Tìm kiếm"
          filterValue={statusFilter}
          onFilterChange={(value) => setStatusFilter(value as typeof statusFilter)}
          filterOptions={statusFilterOptions}
        />

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={paginatedCustomers}
          selectable={true}
          selectedRows={selectedCustomers}
          onSelectRow={handleSelectItem}
          onSelectAll={handleSelectAll}
          getRowId={(record) => record.id}
          actions={tableActions}
          selectedCount={selectedCustomers.size}
          pagination={{
            current: currentPage,
            total: Math.ceil(filtered.length / 10),
            onChange: setCurrentPage,
          }}
          onRowClick={(record) => console.log("Row clicked:", record)}
        />
      </ContentCard>
    </PageContainer>
  );
};

export default AdminCustomersRefactored;