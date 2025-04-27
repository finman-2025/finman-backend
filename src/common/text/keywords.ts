import { ref } from "process";

export const collectionKey = {
  user: 'Người dùng',
  category: 'Danh mục',
  expense: 'Chi tiêu',
  tips: 'Gợi ý',
  token: 'Token',
};

export const fieldKey = {
  username: 'Tên đăng nhập',
  password: 'Mật khẩu',
  refreshToken: 'Refresh token',
  id: 'Id',
  name: 'Tên',
  email: 'Email',
  categoryName: 'Tên danh mục',
  limit: 'Hạn mức',
  value: 'Giá trị',
  description: 'Mô tả',
  userId: 'Id người dùng',
  categoryId: 'Id danh mục',
  date: 'Ngày'
};

export const TokenType = {
  access: 'accessToken',
  refresh: 'refreshToken',
};
