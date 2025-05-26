export const responseMessage = {
  success: 'Thành công',
  internalServerError: 'Hệ thống đang bị gián đoạn, vui lòng thử lại sau',
  badRequest: (param?: string) => 
    `Tham số ${param ? param.toLocaleLowerCase() : 'đầu vào'} không hợp lệ`,
  notFound: (field?: string) => 
    `Không tìm thấy ${field ? field.toLocaleLowerCase() : 'dữ liệu'}`,
  alreadyExists: (field?: string) => 
    `${field ? field.toLocaleLowerCase() : 'Dữ liệu'} đã tồn tại`,
  wrongUsernameOrPassword: 'Sai tên đăng nhập hoặc mật khẩu',
  sectionExpired: 'Phiên đăng nhập hết hạn',
  startDateBeforeEndDate: 'Ngày bắt đầu phải trước ngày kết thúc',
};

export const messages = {
  notFound: (collection: string) =>
    `Không tìm thấy ${collection ? collection.toLocaleLowerCase() : 'dữ liệu'}`,
  invalid: (field?: string, collection?: string) =>
    `${field ? field.toLocaleLowerCase() : 'Tham số'} ${collection ? `cho ${collection.toLocaleLowerCase()}` : ''} không hợp lệ`,
  missing: (field?: string) => 
    `Thiếu ${field.toLocaleLowerCase()}`,
  nameExists: (collection?: string) =>
    `Tên ${collection ? collection.toLocaleLowerCase() : ''} đã tồn tại`,
  unavailableService: (service?: string) =>
    `Dịch vụ ${service? service.toLocaleLowerCase() : ''} không khả dụng`,
  overThreshold: (threshold?: string) => 
    `Giá trị ${threshold ? threshold.toLocaleLowerCase() : ''} vượt ngưỡng`,
};

export const summaries = {
  getOne: (collection: string) =>
    `Lấy thông tin một ${collection.toLocaleLowerCase()}`,
  getMany: (collection: string) =>
    `Lấy danh sách các ${collection.toLocaleLowerCase()}`,
  getTotal: (collection: string) =>
    `Lấy tổng ${collection.toLocaleLowerCase()}`,
  getList: (collection: string) =>
    `Lấy danh sách ${collection.toLocaleLowerCase()}`,
  create: (collection: string) =>
    `Tạo một ${collection.toLocaleLowerCase()} mới`,
  update: (collection: string) =>
    `Cập nhật một ${collection.toLocaleLowerCase()}`,
  delete: (collection: string) => 
    `Xóa một ${collection.toLocaleLowerCase()}`,
  deleteMany: (collection: string) =>
    `Xóa nhiều ${collection.toLocaleLowerCase()}`,
  getAnalytics: () => 'Lấy phân tích',
  login: () => 'Đăng nhập',
  register: () => 'Đăng ký',
  refresh: () => 'Làm mới token',
  logout: () => 'Đăng xuất',
  profile: () => 'Thông tin tài khoản',
  uploadReceipt: () => `Tải ảnh biên lai lên`,
};
