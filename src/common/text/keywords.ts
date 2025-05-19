import { ref } from "process";

export const collectionKey = {
  user: 'Người dùng',
  category: 'Danh mục',
  expense: 'Chi tiêu',
  tips: 'Gợi ý',
  token: 'Token',
};

export const fieldKey = {
  id: 'Id',
  userId: 'Id người dùng',

  refreshToken: 'Refresh token',

  username: 'Tên đăng nhập',
  password: 'Mật khẩu',
  name: 'Tên',
  email: 'Email',
  sex: 'Giới tính',
  phoneNumber: 'Số điện thoại',
  dateOfBirth: 'Ngày sinh',
  address: 'Địa chỉ',
  avatar: 'Avatar',

  categoryName: 'Tên danh mục',
  limit: 'Hạn mức',
  value: 'Giá trị',
  description: 'Mô tả',
  categoryId: 'Id danh mục',
  date: 'Ngày',

  file: 'File',
  fileType: 'Kiểu File',
  fileSize: 'Kích thước File'
};

export const TokenType = {
  access: 'accessToken',
  refresh: 'refreshToken',
};
