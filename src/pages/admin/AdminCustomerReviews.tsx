import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "approved" | "pending" | "rejected";
  date: string;
}

const AdminCustomerReviews = () => {
  document.title = "Đánh giá sản phẩm | Wanderoo";

  const [reviews] = useState<Review[]>([
    {
      id: "1",
      productName: "Áo thun nam",
      customerName: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, chất lượng cao",
      status: "approved",
      date: "2025-10-21",
    },
    // Add more sample reviews here
  ]);

  const getStatusBadge = (status: Review["status"]) => {
    const variants = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      approved: "Đã duyệt",
      pending: "Chờ duyệt",
      rejected: "Từ chối",
    };

    return <Badge className={variants[status]}>{labels[status]}</Badge>;
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Đánh giá sản phẩm</h1>
        <div className="space-x-2">
          <Button variant="outline">Xuất Excel</Button>
          <Button variant="outline">Lọc</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đánh giá</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">
                  {review.productName}
                </TableCell>
                <TableCell>{review.customerName}</TableCell>
                <TableCell>{renderStars(review.rating)}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {review.comment}
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>{review.date}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {review.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          Duyệt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomerReviews;
