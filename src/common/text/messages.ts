export const responseMessage = {
  success: 'Thành công',
  internalServerError: 'Hệ thống đang bị gián đoạn, vui lòng thử lại sau',
  badRequest: (param?: string) =>
    `Tham số ${param ? param.toLocaleLowerCase() : 'đầu vào'} không hợp lệ`,
  notFound: (field?: string) =>
    `Không tìm thấy ${field ? field.toLocaleLowerCase() : 'dữ liệu'}`,
  alreadyExists: (field?: string) => `${field ? field : 'Dữ liệu'} đã tồn tại`,
  overSpent: (field?: string) =>
    `Bạn đã chi tiêu${field ? ` cho ${field.toLocaleLowerCase()}` : ''} quá hạn mức tháng này, hãy điều chỉnh chi tiêu hợp lý`,
  wrongUsernameOrPassword: 'Sai tên đăng nhập hoặc mật khẩu',
  passwordDoesNotMatch: 'Mật khẩu không khớp',
  sectionExpired: 'Phiên đăng nhập hết hạn',
  startDateBeforeEndDate: 'Ngày bắt đầu phải trước ngày kết thúc',
  notImplemented: 'Chức năng này chưa được triển khai',
  serviceUnavailable: 'Dịch vụ không khả dụng',
};

export const messages = {
  notFound: (collection: string) =>
    `Không tìm thấy ${collection ? collection.toLocaleLowerCase() : 'dữ liệu'}`,
  invalid: (field?: string, collection?: string) =>
    `${field ?? 'Tham số'}${collection ? ` cho ${collection.toLocaleLowerCase()}` : ''} không hợp lệ`,
  missing: (field?: string) => `Thiếu ${field.toLocaleLowerCase()}`,
  nameExists: (collection?: string) =>
    `Tên ${collection ? collection.toLocaleLowerCase() : ''} đã tồn tại`,
  unavailableService: (service?: string) =>
    `Dịch vụ ${service ? service.toLocaleLowerCase() : ''} không khả dụng`,
  overThreshold: (threshold?: string) =>
    `Giá trị ${threshold ? threshold.toLocaleLowerCase() : ''} vượt ngưỡng`,
  cannotUpdate: (field: string, collection?: string) =>
    `Không thể cập nhật ${field.toLocaleLowerCase()}${collection ? ` cho ${collection.toLocaleLowerCase()}` : ''} này`,
};

export const summaries = {
  getOne: (collection: string) =>
    `Lấy thông tin một ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  getMany: (collection: string) =>
    `Lấy danh sách các ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  getTotal: (collection: string) =>
    `Lấy tổng ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  getList: (collection: string) =>
    `Lấy danh sách ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  create: (collection: string) =>
    `Tạo một ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'} mới`,
  update: (collection: string, field?: string) =>
    `Cập nhật ${field ? field.toLocaleLowerCase() + ' của ' : ''} ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  delete: (collection: string) =>
    `Xóa một ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  deleteMany: (collection: string) =>
    `Xóa nhiều ${collection ? collection.toLocaleLowerCase() : 'hàng dữ liệu'}`,
  getAnalytics: () => 'Lấy phân tích',
  login: () => 'Đăng nhập',
  register: () => 'Đăng ký',
  refresh: () => 'Làm mới token',
  logout: () => 'Đăng xuất',
  profile: () => 'Thông tin tài khoản',
  uploadReceipt: () => `Tải ảnh biên lai lên`,
  exportExpenses: () => 'Xuất dữ liệu chi tiêu',
  uploadFile: () => 'Tải tệp lên',
};
