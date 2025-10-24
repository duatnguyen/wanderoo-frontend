// src/pages/admin/AdminCreateProductVoucher.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Receipt, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VoucherFormData {
    programName: string;
    voucherCode: string;
    startDate: string;
    endDate: string;
    discountType: 'amount' | 'percentage';
    discountValue: number;
    maxDiscountLimit: 'limited' | 'unlimited';
    maxDiscountValue: number;
    minOrderValue: number;
    maxUsage: number;
    usagePerPerson: number;
    displayChannel: 'pos' | 'website' | 'both';
    selectedProducts: Array<{ id: string; name: string; price: number; }>;
}

const AdminCreateProductVoucher: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<VoucherFormData>({
        programName: '',
        voucherCode: '',
        startDate: '',
        endDate: '',
        discountType: 'amount',
        discountValue: 0,
        maxDiscountLimit: 'unlimited',
        maxDiscountValue: 0,
        minOrderValue: 0,
        maxUsage: 1,
        usagePerPerson: 1,
        displayChannel: 'website',
        selectedProducts: [],
    });

    // Mock product data
    const mockProducts = [
        { id: '1', name: 'Áo thun nam', price: 150000 },
        { id: '2', name: 'Quần jean nữ', price: 350000 },
        { id: '3', name: 'Giày sneaker', price: 450000 },
        { id: '4', name: 'Túi xách', price: 250000 },
        { id: '5', name: 'Nón baseball', price: 80000 },
    ];

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (field: keyof VoucherFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddProduct = (product: { id: string; name: string; price: number; }) => {
        if (!formData.selectedProducts.find(p => p.id === product.id)) {
            setFormData(prev => ({
                ...prev,
                selectedProducts: [...prev.selectedProducts, product],
            }));
        }
    };

    const handleRemoveProduct = (productId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedProducts: prev.selectedProducts.filter(p => p.id !== productId),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Call API to create voucher
            console.log('Creating product voucher:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate back to discounts page
            navigate('/admin/discounts');
        } catch (error) {
            console.error('Failed to create voucher:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-4">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin/discounts')}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Tạo mã giảm giá mới
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Thông tin cơ bản */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                            Thông tin cơ bản
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Voucher Type Badge */}
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2">
                                <Receipt className="h-4 w-4" />
                                <span className="font-semibold text-sm">Voucher sản phẩm</span>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Tên chương trình giảm giá */}
                            <div className="space-y-2">
                                <Label htmlFor="programName" className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Tên chương trình giảm giá
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="programName"
                                        value={formData.programName}
                                        onChange={(e) => handleInputChange('programName', e.target.value)}
                                        placeholder="Nhập tên chương trình giảm giá"
                                        maxLength={100}
                                        className="border-red-500 border-2 pr-16"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                        {formData.programName.length}/100
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">Tên voucher sẽ không được hiển thị cho người mua</p>
                            </div>

                            {/* Mã voucher */}
                            <div className="space-y-2">
                                <Label htmlFor="voucherCode" className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Mã voucher
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="voucherCode"
                                        value={formData.voucherCode}
                                        onChange={(e) => handleInputChange('voucherCode', e.target.value.toUpperCase())}
                                        placeholder="Nhập mã voucher"
                                        maxLength={5}
                                        className="border-red-500 border-2 pr-16 uppercase"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                        {formData.voucherCode.length}/5
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">Vui lòng nhập các kí tự chữ cái A - Z, số 0 - 9, tối đa 5 kí tự</p>
                            </div>

                            {/* Thời gian sử dụng mã */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Thời gian sử dụng mã
                                </Label>
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1">
                                        <Input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            className="border-red-500 border-2 pr-10"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 text-sm">-</span>
                                    <div className="relative flex-1">
                                        <Input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            className="border-red-500 border-2 pr-10"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Thiết lập mã giảm giá */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                            Thiết lập mã giảm giá
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Loại mã */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <Label className="text-sm font-semibold text-gray-900 dark:text-white min-w-[120px]">
                                    Loại mã
                                </Label>
                                <span className="text-red-500 font-semibold text-sm">Khuyến mãi</span>
                            </div>
                        </div>

                        {/* Loại giảm giá và Mức giảm */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Loại giảm giá | Mức giảm
                                </Label>
                                <Select
                                    value={formData.discountType}
                                    onValueChange={(value: 'amount' | 'percentage') => handleInputChange('discountType', value)}
                                >
                                    <SelectTrigger className="border-red-500 border-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="amount">Theo số tiền</SelectItem>
                                        <SelectItem value="percentage">Theo phần trăm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-900 dark:text-white opacity-0">
                                    Giá trị
                                </Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={formData.discountValue}
                                    onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                                    placeholder={formData.discountType === 'amount' ? 'VNĐ' : '%'}
                                    className="border-red-500 border-2"
                                />
                            </div>
                        </div>

                        {/* Mức giảm tối đa */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                Mức giảm tối đa
                            </Label>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            id="limited"
                                            name="maxDiscountLimit"
                                            value="limited"
                                            checked={formData.maxDiscountLimit === 'limited'}
                                            onChange={(e) => handleInputChange('maxDiscountLimit', e.target.value as 'limited' | 'unlimited')}
                                            className="w-4 h-4 text-red-500"
                                        />
                                        <Label htmlFor="limited" className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Giới hạn
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            id="unlimited"
                                            name="maxDiscountLimit"
                                            value="unlimited"
                                            checked={formData.maxDiscountLimit === 'unlimited'}
                                            onChange={(e) => handleInputChange('maxDiscountLimit', e.target.value as 'limited' | 'unlimited')}
                                            className="w-4 h-4 text-red-500"
                                        />
                                        <Label htmlFor="unlimited" className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Không giới hạn
                                        </Label>
                                    </div>
                                </div>
                                {formData.maxDiscountLimit === 'limited' && (
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={formData.maxDiscountValue}
                                        onChange={(e) => handleInputChange('maxDiscountValue', parseFloat(e.target.value) || 0)}
                                        placeholder="Nhập mức giảm tối đa"
                                        className="border-red-500 border-2"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Giá trị đơn hàng tối thiểu */}
                        <div className="space-y-2">
                            <Label htmlFor="minOrderValue" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Giá trị đơn hàng tối thiểu
                            </Label>
                            <Input
                                id="minOrderValue"
                                type="number"
                                min="0"
                                step="1000"
                                value={formData.minOrderValue}
                                onChange={(e) => handleInputChange('minOrderValue', parseFloat(e.target.value) || 0)}
                                placeholder="VNĐ"
                                className="border-red-500 border-2"
                            />
                        </div>

                        {/* Tổng lượt sử dụng tối đa */}
                        <div className="space-y-2">
                            <Label htmlFor="maxUsage" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Tổng lượt sử dụng tối đa
                            </Label>
                            <Input
                                id="maxUsage"
                                type="number"
                                min="1"
                                value={formData.maxUsage}
                                onChange={(e) => handleInputChange('maxUsage', parseInt(e.target.value) || 1)}
                                className="border-red-500 border-2"
                            />
                            <p className="text-xs text-gray-500">Tổng số mã giảm giá tối đa có thể sử dụng</p>
                        </div>

                        {/* Lượt sử dụng tối đa/người */}
                        <div className="space-y-2">
                            <Label htmlFor="usagePerPerson" className="text-sm font-semibold text-gray-900 dark:text-white">
                                Lượt sử dụng tối đa/người
                            </Label>
                            <Input
                                id="usagePerPerson"
                                type="number"
                                min="1"
                                value={formData.usagePerPerson}
                                onChange={(e) => handleInputChange('usagePerPerson', parseInt(e.target.value) || 1)}
                                className="border-red-500 border-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Chọn sản phẩm áp dụng */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                            Chọn sản phẩm áp dụng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Tìm kiếm sản phẩm */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                Tìm kiếm sản phẩm
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="border-red-500 border-2 pl-10"
                                />
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                Danh sách sản phẩm
                            </Label>
                            <div className="border border-red-500 border-2 rounded-lg p-4 max-h-60 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.price.toLocaleString()} VNĐ</p>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleAddProduct(product)}
                                            disabled={formData.selectedProducts.some(p => p.id === product.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1"
                                        >
                                            Thêm
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sản phẩm đã chọn */}
                        {formData.selectedProducts.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Sản phẩm đã chọn
                                </Label>
                                <div className="space-y-2">
                                    {formData.selectedProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.price.toLocaleString()} VNĐ</p>
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => handleRemoveProduct(product.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Hiển thị mã giảm giá và sản phẩm áp dụng */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-gray-700 dark:text-gray-300">
                            Hiển thị mã giảm giá và sản phẩm áp dụng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Thiết lập hiển thị */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                Thiết lập hiển thị
                            </Label>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id="pos"
                                        name="displayChannel"
                                        value="pos"
                                        checked={formData.displayChannel === 'pos'}
                                        onChange={(e) => handleInputChange('displayChannel', e.target.value as 'pos' | 'website' | 'both')}
                                        className="w-4 h-4 text-red-500"
                                    />
                                    <Label htmlFor="pos" className="text-sm font-semibold text-gray-900 dark:text-white">
                                        POS
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id="website"
                                        name="displayChannel"
                                        value="website"
                                        checked={formData.displayChannel === 'website'}
                                        onChange={(e) => handleInputChange('displayChannel', e.target.value as 'pos' | 'website' | 'both')}
                                        className="w-4 h-4 text-red-500"
                                    />
                                    <Label htmlFor="website" className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Website
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        id="both"
                                        name="displayChannel"
                                        value="both"
                                        checked={formData.displayChannel === 'both'}
                                        onChange={(e) => handleInputChange('displayChannel', e.target.value as 'pos' | 'website' | 'both')}
                                        className="w-4 h-4 text-red-500"
                                    />
                                    <Label htmlFor="both" className="text-sm font-semibold text-gray-900 dark:text-white">
                                        POS + Website
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Sản phẩm được áp dụng */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                                Sản phẩm được áp dụng
                            </Label>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {formData.selectedProducts.length > 0
                                        ? `${formData.selectedProducts.length} sản phẩm đã chọn`
                                        : 'Chưa chọn sản phẩm nào'
                                    }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/discounts')}
                        className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-6 py-2"
                    >
                        Huỷ
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading || formData.selectedProducts.length === 0}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
                    >
                        {isLoading ? 'Đang tạo...' : 'Xác nhận'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminCreateProductVoucher;