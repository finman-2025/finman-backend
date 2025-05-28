import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  // await prisma.user.deleteMany();
  // await prisma.user.create({
  //   data: {
  //     username: 'cuong',
  //     password: '123456',
  //     name: 'Phan Thế Cương',
  //     email: 'cuong@gmail.com',
  //     phoneNumber: '0123456789',
  //   },
  // });

  await prisma.financialTip.deleteMany();
  await prisma.financialTip.createMany({
    data: [
      {
        title: 'Bí kíp tiết kiệm',
        author: 'Shark Cương',
        content: `Để có thể thực hiện được những mục tiêu lớn trong tương lai, bạn cần có các khoản dự phòng. Cách tốt nhất xây dựng quỹ này là tiết kiệm.
- Đặt mục tiêu tiết kiệm tiền.
- Lên kế hoạch chi tiêu rõ ràng.
- Tìm cách tăng thu nhập.
- Kiểm soát chi tiêu.
- Mua đồ giảm giá hoặc săn sale.
- Không giữ nhiều tiền mặt trong ví.
- Gửi tiết kiệm ngân hàng.`,
      },
      {
        title: '6 chiếc lọ tài chính',
        author: 'Shark Nhân',
        content: `Bất kể bạn bắt đầu có bao nhiêu tiền, hãy chia nó thành 6 chiếc lọ tài chính:
- Lọ 1 (55%): Chi cho các nhu cầu thiết yếu.
- Lọ 2 (10%): Dành cho quỹ tiết kiệm dài hạn.
- Lọ 3 (10%): Phục vụ mục tiêu giáo dục.
- Lọ 4 (10%): Dành riêng cho bản thân.
- Lọ 5 (5%): Đầu tư dài hạn.
- Lọ 6 (5%): Làm từ thiện.`,
      },
      {
        title: 'Đầu tư an toàn',
        author: 'Warren Buffett',
        content: `Khi nhắc đến đầu tư, nhiều người thường nghĩ chỉ khi có một khoản tiền lớn mới có thể tham gia. Tuy nhiên thực chất, đầu tư không có nghĩa là cần một số vốn quá lớn, chúng ta hoàn toàn có thể đầu tư với số tiền nhỏ nhưng vẫn sinh lời hiệu quả nếu biết cách chọn kênh đầu tư thích hợp.
- Gửi tiết kiệm ngân hàng.
- Thuê nhà và cho thuê lại.
- Đầu tư vào chứng chỉ quỹ
- Đầu tư cổ phiếu.
- Kinh doanh theo mô hình Dropshipping.`,
      },
      {
        title: 'Kiểm soát mua sắm',
        author: 'Jack Ma',
        content: `Bạn là một tín đồ “nghiện” mua sắm và đang có mong muốn thay đổi thói quen tiêu tiền của mình nhưng không biết cách? Đừng lo lắng, hãy cùng tôi tìm hiểu các tips kiểm soát mua sắm online quá mức ngay trong bài viết hôm nay.
- Không mua sắm khi không thật sự cần thiết.
- Tỉnh táo trước những cám dỗ.
- Tìm niềm vui mới cho bản thân.
- Tạo thói quen lập kế hoạch chi tiêu rõ ràng.
- Liệt kê danh sách sản phẩm cần thiết.`,
      },
    ],
  });
})();
