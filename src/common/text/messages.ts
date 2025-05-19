export const responseMessage = {
  success: 'Thành công',
  internalServerError: 'Hệ thống đang bị gián đoạn, vui lòng thử lại sau',
  badRequest: 'Tham số không hợp lệ',
  notFound: 'Không tìm thấy dữ liệu',
  wrongUsernameOrPassword: 'Sai tên đăng nhập hoặc mật khẩu',
};

export const messages = {
  notFound: (collection: string = '') =>
    `Không tìm thấy ${collection?.toLocaleLowerCase()}`,
  invalid: (field: string, collection?: string) =>
    `${field} ${collection ? collection.toLocaleLowerCase() + ' ' : ''}không hợp lệ`,
  missing: (field: string) => `Thiếu ${field.toLocaleLowerCase()}`,
  nameExists: (collection: string = '') =>
    `Tên ${collection ? collection.toLocaleLowerCase() + ' ' : ''}đã tồn tại`,
  unavailableService: (service: string = '') =>
    `Dịch vụ ${service.toLocaleLowerCase().trim()} không khả dụng` 
};

export const summaries = {
  getOne: (collection: string) =>
    `Lấy thông tin một ${collection.toLocaleLowerCase()}`,
  getMany: (collection: string) =>
    `Lấy danh sách các ${collection.toLocaleLowerCase()}`,
  getList: (collection: string) =>
    `Lấy danh sách ${collection.toLocaleLowerCase()}`,
  create: (collection: string) =>
    `Tạo một ${collection.toLocaleLowerCase()} mới`,
  update: (collection: string) =>
    `Cập nhật một ${collection.toLocaleLowerCase()}`,
  delete: (collection: string) => `Xóa một ${collection.toLocaleLowerCase()}`,
  deleteMany: (collection: string) =>
    `Xóa nhiều ${collection.toLocaleLowerCase()}`,
  login: () => `Đăng nhập`,
  register: () => `Đăng ký`,
  refresh: () => `Làm mới token`,
  logout: () => `Đăng xuất`,
  profile: () => `Thông tin tài khoản`,
};
