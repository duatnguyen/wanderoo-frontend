# Wanderoo Frontend - Cấu trúc Website Admin/User

## Tổng quan

Đây là một ứng dụng React + TypeScript với cấu trúc phân quyền rõ ràng giữa Admin và User. Ứng dụng sử dụng React Router để quản lý routing và Context API cho quản lý authentication.

## Cấu trúc thư mục

```
wanderoo-frontend/
├── public/                     # Static assets
├── src/
│   ├── App.tsx                # Main App component
│   ├── main.tsx               # Entry point
│   ├── vite-env.d.ts          # Vite type definitions
│   ├── app/                   # App configuration
│   │   ├── providers/         # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   └── router/            # Routing configuration
│   │       ├── index.tsx      # Main router
│   │       ├── routes.admin.tsx
│   │       ├── routes.user.tsx
│   │       └── guards/        # Route guards
│   │           ├── AuthGuard.tsx
│   │           └── RoleGuard.tsx
│   ├── assets/                # Static assets
│   │   └── images/
│   │       ├── banner/
│   │       └── logo/
│   ├── components/            # Reusable components
│   │   ├── admin/            # Admin-specific components
│   │   │   └── AdminSidebar.tsx
│   │   └── common/           # Shared components
│   │       ├── index.ts
│   │       ├── Loading.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── PublicRoute.tsx
│   ├── context/              # Legacy context (deprecated)
│   │   └── AuthContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useTitle.ts
│   ├── layouts/              # Layout components
│   │   ├── AdminLayout.tsx
│   │   └── UserLayout.tsx
│   ├── pages/                # Page components
│   │   ├── admin/           # Admin pages
│   │   │   └── AdminDashboard.tsx
│   │   ├── auth/            # Authentication pages
│   │   │   ├── AuthPage.css
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── user/            # User pages
│   │       ├── Profile.tsx
│   │       └── UserHome.tsx
│   ├── services/             # API services
│   │   ├── api.ts           # Base API configuration
│   │   ├── auth.api.ts      # Authentication APIs
│   │   ├── admin.api.ts     # Admin APIs
│   │   └── user.api.ts      # User APIs
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── types/               # TypeScript definitions
│   │   ├── index.ts         # Type exports
│   │   ├── auth.ts          # Auth types
│   │   ├── admin.ts         # Admin types
│   │   └── user.ts          # User types
│   └── utils/               # Utility functions
│       ├── constants.ts     # App constants
│       └── storage.ts       # Local storage utilities
├── Dockerfile               # Docker configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TS config
├── tsconfig.node.json       # Node-specific TS config
├── vite.config.ts           # Vite configuration
└── PROJECT_STRUCTURE.md     # This file
```

## Tính năng chính

### Authentication System
- **Login/Register**: Hệ thống đăng nhập và đăng ký
- **Role-based Access Control**: Phân quyền Admin/User
- **Protected Routes**: Bảo vệ routes theo role
- **Persistent Session**: Lưu session trong localStorage

### Admin Panel
- **Dashboard**: Tổng quan thống kê hệ thống
- **User Management**: Quản lý người dùng (Coming soon)
- **Settings**: Cài đặt hệ thống (Coming soon)
- **Sidebar Navigation**: Menu điều hướng dễ sử dụng

### User Interface
- **Home Dashboard**: Trang chính cho user
- **Profile Management**: Quản lý thông tin cá nhân
- **Settings**: Cài đặt cá nhân (Coming soon)
- **Responsive Design**: Giao diện responsive trên mọi thiết bị

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng (Development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173/

### Build cho Production
```bash
npm run build
```

## Hướng dẫn sử dụng

### 1. Đăng nhập
- Truy cập http://localhost:5173/
- Sử dụng các tài khoản demo:
  - **Admin**: admin@example.com / password
  - **User**: user@example.com / password

### 2. Tính năng Admin
- Dashboard với thống kê tổng quan
- Sidebar menu để điều hướng
- Giao diện quản trị chuyên nghiệp

### 3. Tính năng User
- Trang chủ với thông tin cá nhân
- Quản lý profile
- Giao diện thân thiện với người dùng

## Công nghệ sử dụng

- **React 19.1.1**: Frontend framework
- **TypeScript 5.8.3**: Type safety
- **React Router DOM 7.9.1**: Routing
- **Tailwind CSS 4.1.14**: Utility-first CSS framework
- **Ant Design 5.27.3**: UI component library
- **Vite 7.1.2**: Fast build tool
- **React Query (@tanstack/react-query)**: Server state management
- **Context API**: Local state management

## Cấu trúc Routing

```
/                     → Redirect to /login
/login               → Login page
/register            → Register page
/admin/dashboard     → Admin dashboard (Protected)
/admin/users         → User management (Protected)
/admin/settings      → Admin settings (Protected)
/user/home          → User home (Protected)
/user/profile       → User profile (Protected)
/user/settings      → User settings (Protected)
```

## Authentication Flow

1. **Unauthenticated**: Redirect to login
2. **Login Success**: Redirect based on role
   - Admin → `/admin/dashboard`
   - User → `/user/home`
3. **Role Mismatch**: Redirect to appropriate dashboard
4. **Logout**: Clear session và redirect to login

## Mở rộng ứng dụng

### Thêm trang mới

1. Tạo component trong `src/pages/admin/` hoặc `src/pages/user/`
2. Import và thêm route trong `src/app/router/index.tsx`
3. Cập nhật navigation trong layout tương ứng (`AdminLayout.tsx` hoặc `UserLayout.tsx`)

### Thêm API calls

1. Tạo service trong `src/services/`
2. Sử dụng trong components hoặc custom hooks
3. Cập nhật types trong `src/types/`

### Thêm components

1. Tạo trong `src/components/admin/` hoặc `src/components/common/`
2. Export từ `src/components/common/index.ts` nếu là component chung
3. Import và sử dụng trong pages

## Best Practices

1. **Type Safety**: Luôn định nghĩa types cho props và state
2. **Component Reusability**: Tách các logic chung thành components
3. **Error Handling**: Xử lý lỗi một cách graceful
4. **Loading States**: Hiển thị loading states cho UX tốt hơn
5. **Responsive Design**: Đảm bảo giao diện responsive

## Deployment

### Build
```bash
npm run build
```

### Deploy lên Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy lên Netlify
1. Build project: `npm run build`
2. Upload folder `dist` lên Netlify
3. Cấu hình redirects cho SPA

## Contributing

1. Fork project
2. Tạo feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Contact

- Developer: duatnguyen
- Project Link: https://github.com/duatnguyen/wanderoo-frontend