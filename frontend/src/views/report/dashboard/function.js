const data = [
 {"order_date":"2023-01-02","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":9,"order_quantity":67,"total_sale":375200},
  {"order_date":"2023-01-03","product_name":"Chảo không chống dính","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":630000},
  {"order_date":"2023-01-04","product_name":"SữA Chua NếP CẩM 100G","product_category":"Thực phẩm đông lạnh","product_subcategory":"Kem, sữa chua, phô mai","order_count":5,"order_quantity":17,"total_sale":612000},
  {"order_date":"2023-01-05","product_name":"Kẹo mềm","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":3,"order_quantity":7,"total_sale":140000},
  {"order_date":"2023-01-06","product_name":"Capuchino hòa tan","product_category":"Thức uống","product_subcategory":"Café","order_count":1,"order_quantity":4,"total_sale":160000},
  {"order_date":"2023-01-07","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":1,"order_quantity":3,"total_sale":108000},
  {"order_date":"2023-01-08","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":2,"order_quantity":16,"total_sale":304000},
  {"order_date":"2023-01-09","product_name":"Bột Mì Làm Bánh Ngọt ”La Farina” Tipo 00","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":3,"order_quantity":28,"total_sale":893200},
  {"order_date":"2023-01-10","product_name":"Bánh trứng","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":5,"order_quantity":22,"total_sale":902000},
  {"order_date":"2023-01-11","product_name":"Tương chao","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":1,"order_quantity":49,"total_sale":661500},
  {"order_date":"2023-01-12","product_name":"Kẹo mềm","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":6,"order_quantity":40,"total_sale":800000},
  {"order_date":"2023-01-13","product_name":"Khoai Tây Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":1,"order_quantity":4,"total_sale":152000},
  {"order_date":"2023-01-14","product_name":"Máy đánh trứng","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":1,"order_quantity":1,"total_sale":711000},
  {"order_date":"2023-01-15","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":11,"order_quantity":115,"total_sale":644000},
  {"order_date":"2023-01-16","product_name":"Bột nổi","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":2,"order_quantity":7,"total_sale":259000},
  {"order_date":"2023-01-17","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":11,"order_quantity":63,"total_sale":352800},
  {"order_date":"2023-01-18","product_name":"Mắm ruốc Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":3,"order_quantity":21,"total_sale":651000},
  {"order_date":"2023-01-19","product_name":"Tương cà Ketchup","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":5,"order_quantity":19,"total_sale":389500},
  {"order_date":"2023-01-20","product_name":"Lạp xưởng heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":1,"order_quantity":2,"total_sale":234000},
  {"order_date":"2023-01-21","product_name":"Bột rau câu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":2,"order_quantity":15,"total_sale":277500},
  {"order_date":"2023-01-22","product_name":"Bánh Xếp Kiểu Nhật","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm đông lạnh khác","order_count":2,"order_quantity":6,"total_sale":273000},
  {"order_date":"2023-01-23","product_name":"Bánh que &","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":3,"order_quantity":9,"total_sale":171000},
  {"order_date":"2023-01-24","product_name":"Cháo Yến Mạch, Chà Là Và Hồ Đào","product_category":"Thực phẩm khô","product_subcategory":"Ngũ cốc","order_count":1,"order_quantity":1,"total_sale":158000},
  {"order_date":"2023-01-25","product_name":"Bột nếp","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":4,"order_quantity":31,"total_sale":598300},
  {"order_date":"2023-01-26","product_name":"Bánh đa cua","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":1,"total_sale":303000},
  {"order_date":"2023-01-27","product_name":"Tương cà Ketchup","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":3,"order_quantity":9,"total_sale":184500},
  {"order_date":"2023-01-28","product_name":"Xúc xích heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":5,"order_quantity":41,"total_sale":861000},
  {"order_date":"2023-01-29","product_name":"Nhấc nồi","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":3,"order_quantity":12,"total_sale":552000},
  {"order_date":"2023-01-30","product_name":"Bánh Xếp Kiểu Nhật","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm đông lạnh khác","order_count":1,"order_quantity":3,"total_sale":136500},
  {"order_date":"2023-02-01","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":3,"order_quantity":20,"total_sale":420000},
  {"order_date":"2023-02-02","product_name":"Bột Mì Làm Bánh Mì \"La Farina” Tipo 0 (5Kg Bao)","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":1,"order_quantity":3,"total_sale":488400},
  {"order_date":"2023-02-03","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":12,"order_quantity":121,"total_sale":677600},
  {"order_date":"2023-02-04","product_name":"Rau củ đóng hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":3,"total_sale":112500},
  {"order_date":"2023-02-05","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":11,"order_quantity":69,"total_sale":814200},
  {"order_date":"2023-02-06","product_name":"Bình đựng nước nhựa","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":1,"order_quantity":3,"total_sale":480000},
  {"order_date":"2023-02-07","product_name":"Nước trái cây","product_category":"Thức uống","product_subcategory":"Nước giải khát","order_count":1,"order_quantity":2,"total_sale":500000},
  {"order_date":"2023-02-08","product_name":"Mì cay","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":4,"order_quantity":59,"total_sale":324500},
  {"order_date":"2023-02-09","product_name":"Cháo Yến Mạch, Chà Là Và Hồ Đào","product_category":"Thực phẩm khô","product_subcategory":"Ngũ cốc","order_count":1,"order_quantity":1,"total_sale":158000},
  {"order_date":"2023-02-10","product_name":"Bột rau câu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":5,"order_quantity":17,"total_sale":314500},
  {"order_date":"2023-02-11","product_name":"Rau củ đóng hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":5,"total_sale":187500},
  {"order_date":"2023-02-12","product_name":"Gia vị nấu phở, bún, hủ tiếu Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":2,"order_quantity":4,"total_sale":160000},
  {"order_date":"2023-02-13","product_name":"Dao chặt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":210000},
  {"order_date":"2023-02-14","product_name":"Giò Bê (Me)","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":1,"order_quantity":2,"total_sale":590000},
  {"order_date":"2023-02-15","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":4,"order_quantity":11,"total_sale":396000},
  {"order_date":"2023-02-16","product_name":"Chảo không chống dính","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":630000},
  {"order_date":"2023-02-17","product_name":"Há Cảo Mini Nhân Tôm Thịt","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":3,"order_quantity":10,"total_sale":715000},
  {"order_date":"2023-02-18","product_name":"Bánh que &","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":6,"order_quantity":18,"total_sale":342000},
  {"order_date":"2023-02-19","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":9,"order_quantity":96,"total_sale":576000},
  {"order_date":"2023-02-20","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":3,"order_quantity":22,"total_sale":418000},
  {"order_date":"2023-02-21","product_name":"Bột Mì Làm Bánh Mì \"La Farina” Tipo 0 (5Kg Bao)","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":1,"order_quantity":2,"total_sale":325600},
  {"order_date":"2023-02-22","product_name":"Nhấc nồi","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":12,"total_sale":552000},
  {"order_date":"2023-02-23","product_name":"Lạp xưởng heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":1,"order_quantity":4,"total_sale":468000},
  {"order_date":"2023-02-24","product_name":"Cá Viên Cao Cấp Gói 500G","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":2,"order_quantity":3,"total_sale":117000},
  {"order_date":"2023-02-25","product_name":"Tương cà Ketchup","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":3,"order_quantity":9,"total_sale":184500},
  {"order_date":"2023-02-26","product_name":"Ly thủy tinh","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":5,"order_quantity":26,"total_sale":104000},
  {"order_date":"2023-02-27","product_name":"Cá thu hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":39,"total_sale":741000},
  {"order_date":"2023-02-28","product_name":"Giò Bê (Me)","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":1,"order_quantity":1,"total_sale":295000},
  {"order_date":"2023-03-01","product_name":"Khăn lau tạp dề","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":6,"total_sale":276000},
  {"order_date":"2023-03-02","product_name":"Bình đựng nước nhựa","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":1,"order_quantity":4,"total_sale":640000},
  {"order_date":"2023-03-03","product_name":"Gia vị nấu lẩu, canh","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":4,"order_quantity":5,"total_sale":190000},
  {"order_date":"2023-03-04","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":3,"order_quantity":8,"total_sale":168000},
  {"order_date":"2023-03-05","product_name":"Hủ tiếu bò kho","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":2,"total_sale":412000},
  {"order_date":"2023-03-06","product_name":"Hủ tiếu bò kho","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":4,"total_sale":824000},
  {"order_date":"2023-03-07","product_name":"Capuchino hòa tan","product_category":"Thức uống","product_subcategory":"Café","order_count":1,"order_quantity":3,"total_sale":120000},
  {"order_date":"2023-03-08","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":12,"order_quantity":136,"total_sale":816000},
  {"order_date":"2023-03-09","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":7,"order_quantity":48,"total_sale":268800},
  {"order_date":"2023-03-10","product_name":"Nắp chắn dầu","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":2,"order_quantity":5,"total_sale":375000},
  {"order_date":"2023-03-11","product_name":"Hạt hạnh nhân","product_category":"Thực phẩm đóng gói","product_subcategory":"Mứt, hạt, trái cây sấy","order_count":1,"order_quantity":3,"total_sale":426000},
  {"order_date":"2023-03-12","product_name":"Túi đựng thực phẩm","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":3,"order_quantity":5,"total_sale":420000},
  {"order_date":"2023-03-13","product_name":"Khăn lau tạp dề","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":6,"total_sale":276000},
  {"order_date":"2023-03-14","product_name":"Bột chiên đa dụng","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":6,"order_quantity":13,"total_sale":247000},
  {"order_date":"2023-03-15","product_name":"Cá nục hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":3,"order_quantity":12,"total_sale":252000},
  {"order_date":"2023-03-16","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":3,"order_quantity":10,"total_sale":200000},
  {"order_date":"2023-03-17","product_name":"Chả Quế Ngon","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":1,"order_quantity":1,"total_sale":225000},
  {"order_date":"2023-03-18","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":5,"order_quantity":46,"total_sale":920000},
  {"order_date":"2023-03-19","product_name":"Mì khoai tây","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":6,"order_quantity":56,"total_sale":235200},
  {"order_date":"2023-03-20","product_name":"Túi đựng thực phẩm","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":2,"order_quantity":2,"total_sale":168000},
  {"order_date":"2023-03-21","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":4,"order_quantity":45,"total_sale":855000},
  {"order_date":"2023-03-22","product_name":"Nước yến","product_category":"Thức uống","product_subcategory":"Thức uống khác","order_count":1,"order_quantity":3,"total_sale":495000},
  {"order_date":"2023-03-23","product_name":"Hủ tiếu sườn heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":4,"total_sale":824000},
  {"order_date":"2023-03-24","product_name":"Ngũ vị hương","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":10,"order_quantity":39,"total_sale":518700},
  {"order_date":"2023-03-25","product_name":"Sữa tươi","product_category":"Thức uống","product_subcategory":"Sữa","order_count":1,"order_quantity":1,"total_sale":320000},
  {"order_date":"2023-03-26","product_name":"Máy đánh trứng","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":1,"order_quantity":1,"total_sale":711000},
  {"order_date":"2023-03-27","product_name":"Túi đựng thực phẩm","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":3,"order_quantity":5,"total_sale":420000},
  {"order_date":"2023-03-28","product_name":"Phở khác","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":7,"total_sale":322000},
  {"order_date":"2023-03-29","product_name":"Dao bào","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":22,"total_sale":990000},
  {"order_date":"2023-03-30","product_name":"Chảo không chống dính","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":210000},
  {"order_date":"2023-03-31","product_name":"Xúc Xích Đức","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":1,"order_quantity":4,"total_sale":147200},
  {"order_date":"2023-04-01","product_name":"Hủ tiếu sườn heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":3,"total_sale":618000},
  {"order_date":"2023-04-02","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":3,"order_quantity":6,"total_sale":216000},
  {"order_date":"2023-04-03","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":4,"order_quantity":15,"total_sale":540000},
  {"order_date":"2023-04-04","product_name":"Nồi inox","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":720000},
  {"order_date":"2023-04-05","product_name":"Bắp Hạt Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":2,"order_quantity":50,"total_sale":600000},
  {"order_date":"2023-04-06","product_name":"Trứng Gà Omega3","product_category":"Thực phẩm tươi sống","product_subcategory":"Trứng","order_count":1,"order_quantity":5,"total_sale":154500},
  {"order_date":"2023-04-07","product_name":"Nước đường","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":3,"order_quantity":17,"total_sale":680000},
  {"order_date":"2023-04-08","product_name":"Tương hột","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":4,"order_quantity":9,"total_sale":427500},
  {"order_date":"2023-04-09","product_name":"Cá thu hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":8,"total_sale":152000},
  {"order_date":"2023-04-10","product_name":"Cá thu hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":5,"order_quantity":29,"total_sale":551000},
  {"order_date":"2023-04-11","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":6,"order_quantity":42,"total_sale":882000},
  {"order_date":"2023-04-12","product_name":"Tương cà","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":6,"order_quantity":21,"total_sale":567000},
  {"order_date":"2023-04-13","product_name":"Khô chà bông","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":1,"order_quantity":11,"total_sale":485100},
  {"order_date":"2023-04-14","product_name":"Cá nục hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":4,"order_quantity":37,"total_sale":777000},
  {"order_date":"2023-04-15","product_name":"Gia vị nấu phở, bún, hủ tiếu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":3,"total_sale":120000},
  {"order_date":"2023-04-16","product_name":"Tương hột","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":3,"total_sale":142500},
  {"order_date":"2023-04-17","product_name":"Gia vị nấu phở, bún, hủ tiếu Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":2,"order_quantity":6,"total_sale":240000},
  {"order_date":"2023-04-18","product_name":"Khô chà bông","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":2,"order_quantity":4,"total_sale":176400},
  {"order_date":"2023-04-19","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":4,"order_quantity":37,"total_sale":703000},
  {"order_date":"2023-04-20","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":9,"order_quantity":96,"total_sale":576000},
  {"order_date":"2023-04-21","product_name":"Khoai Tây Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":1,"order_quantity":4,"total_sale":152000},
  {"order_date":"2023-04-22","product_name":"Nước trái cây","product_category":"Thức uống","product_subcategory":"Nước giải khát","order_count":1,"order_quantity":4,"total_sale":1000000},
  {"order_date":"2023-04-23","product_name":"Miến thịt bằm","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":3,"total_sale":870000},
  {"order_date":"2023-04-24","product_name":"Rau củ đóng hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":18,"total_sale":675000},
  {"order_date":"2023-04-25","product_name":"Gia vị nấu phở, bún, hủ tiếu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":2,"order_quantity":19,"total_sale":760000},
  {"order_date":"2023-04-26","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":11,"order_quantity":64,"total_sale":755200},
  {"order_date":"2023-04-27","product_name":"Heo hộp khác Pork Luncheon Meat","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":3,"order_quantity":13,"total_sale":994500},
  {"order_date":"2023-04-28","product_name":"Ly thủy tinh","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":5,"order_quantity":71,"total_sale":284000},
  {"order_date":"2023-04-29","product_name":"Rau củ đóng hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":5,"total_sale":187500},
  {"order_date":"2023-04-30","product_name":"Khoai Tây Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":3,"order_quantity":10,"total_sale":380000},
  {"order_date":"2023-05-01","product_name":"Máy đánh trứng","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":1,"order_quantity":1,"total_sale":711000},
  {"order_date":"2023-05-02","product_name":"Bếp gas đôi","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":2,"order_quantity":2,"total_sale":940000},
  {"order_date":"2023-05-03","product_name":"Kẹo mềm","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":3,"order_quantity":8,"total_sale":160000},
  {"order_date":"2023-05-04","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":3,"order_quantity":38,"total_sale":722000},
  {"order_date":"2023-05-05","product_name":"Heo hộp khác Picnic Shoulder Categoria Extra","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":1,"total_sale":162000},
  {"order_date":"2023-05-06","product_name":"SữA Chua NếP CẩM 100G","product_category":"Thực phẩm đông lạnh","product_subcategory":"Kem, sữa chua, phô mai","order_count":5,"order_quantity":17,"total_sale":612000},
  {"order_date":"2023-05-07","product_name":"Bánh que &","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":2,"order_quantity":39,"total_sale":741000},
  {"order_date":"2023-05-08","product_name":"Bột rau câu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":3,"order_quantity":26,"total_sale":481000},
  {"order_date":"2023-05-09","product_name":"Ly thủy tinh","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":6,"order_quantity":98,"total_sale":392000},
  {"order_date":"2023-05-10","product_name":"Bột Mì Làm Bánh Mì \"La Farina” Tipo 0 (5Kg Bao)","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":1,"order_quantity":4,"total_sale":651200},
  {"order_date":"2023-05-11","product_name":"Túi đựng rác size lớn","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":2,"order_quantity":3,"total_sale":246000},
  {"order_date":"2023-05-12","product_name":"Heo hộp khác Pork Luncheon Meat","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":2,"total_sale":153000},
  {"order_date":"2023-05-13","product_name":"Dao bào","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":20,"total_sale":900000},
  {"order_date":"2023-05-14","product_name":"Capuchino hòa tan","product_category":"Thức uống","product_subcategory":"Café","order_count":1,"order_quantity":25,"total_sale":1000000},
  {"order_date":"2023-05-15","product_name":"Dao chặt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":210000},
  {"order_date":"2023-05-16","product_name":"Nhấc nồi","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":138000},
  {"order_date":"2023-05-17","product_name":"Vỉ nướng","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":4,"total_sale":620000},
  {"order_date":"2023-05-18","product_name":"Mì cay","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":3,"order_quantity":22,"total_sale":121000},
  {"order_date":"2023-05-19","product_name":"Mì cay","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":6,"order_quantity":25,"total_sale":137500},
  {"order_date":"2023-05-20","product_name":"Trứng Gà Omega3","product_category":"Thực phẩm tươi sống","product_subcategory":"Trứng","order_count":2,"order_quantity":6,"total_sale":185400},
  {"order_date":"2023-05-21","product_name":"Thớt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":3,"order_quantity":7,"total_sale":840000},
  {"order_date":"2023-05-22","product_name":"Bắp Hạt Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":9,"order_quantity":22,"total_sale":264000},
  {"order_date":"2023-05-23","product_name":"Vỉ nướng","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":4,"total_sale":620000},
  {"order_date":"2023-05-24","product_name":"Mắm ruốc Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":5,"total_sale":155000},
  {"order_date":"2023-05-25","product_name":"Bánh trứng","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":2,"order_quantity":14,"total_sale":574000},
  {"order_date":"2023-05-26","product_name":"Kẹo cứng","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":1,"order_quantity":20,"total_sale":930000},
  {"order_date":"2023-05-27","product_name":"Khô chà bông","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":2,"order_quantity":3,"total_sale":132300},
  {"order_date":"2023-05-28","product_name":"Heo hộp khác Pork Luncheon Meat","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":6,"total_sale":459000},
  {"order_date":"2023-05-29","product_name":"Đường ăn kiêng","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":3,"total_sale":237000},
  {"order_date":"2023-05-30","product_name":"Hủ tiếu sườn heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":1,"total_sale":206000},
  {"order_date":"2023-05-31","product_name":"Heo hộp khác Pork Luncheon Meat","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":5,"total_sale":382500},
  {"order_date":"2023-06-01","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":7,"order_quantity":17,"total_sale":323000},
  {"order_date":"2023-06-02","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":2,"order_quantity":6,"total_sale":216000},
  {"order_date":"2023-06-03","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":5,"order_quantity":18,"total_sale":360000},
  {"order_date":"2023-06-04","product_name":"Miến thịt bằm","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":2,"total_sale":580000},
  {"order_date":"2023-06-05","product_name":"Heo hộp khác Picnic Shoulder Categoria Extra","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":3,"total_sale":486000},
  {"order_date":"2023-06-06","product_name":"Phở khác","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":3,"total_sale":138000},
  {"order_date":"2023-06-07","product_name":"Cháo Yến Mạch, Chà Là Và Hồ Đào","product_category":"Thực phẩm khô","product_subcategory":"Ngũ cốc","order_count":1,"order_quantity":3,"total_sale":474000},
  {"order_date":"2023-06-08","product_name":"Tương chao","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":18,"total_sale":243000},
  {"order_date":"2023-06-09","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":9,"order_quantity":94,"total_sale":564000},
  {"order_date":"2023-06-10","product_name":"Bột Mì Làm Bánh Mì \"La Farina” Tipo 0 (5Kg Bao)","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":1,"order_quantity":2,"total_sale":325600},
  {"order_date":"2023-06-11","product_name":"Nước đường","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":3,"order_quantity":12,"total_sale":480000},
  {"order_date":"2023-06-12","product_name":"Bột nổi","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":3,"order_quantity":15,"total_sale":555000},
  {"order_date":"2023-06-13","product_name":"Bắp Hạt Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":7,"order_quantity":58,"total_sale":696000},
  {"order_date":"2023-06-14","product_name":"Nước trái cây","product_category":"Thức uống","product_subcategory":"Nước giải khát","order_count":2,"order_quantity":3,"total_sale":750000},
  {"order_date":"2023-06-15","product_name":"Gia vị nấu phở, bún, hủ tiếu Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":6,"total_sale":240000},
  {"order_date":"2023-06-16","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":3,"order_quantity":31,"total_sale":620000},
  {"order_date":"2023-06-17","product_name":"Kẹo mềm","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":6,"order_quantity":13,"total_sale":260000},
  {"order_date":"2023-06-18","product_name":"Há Cảo Mini Nhân Tôm Thịt","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":2,"order_quantity":6,"total_sale":429000},
  {"order_date":"2023-06-19","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":6,"order_quantity":21,"total_sale":441000},
  {"order_date":"2023-06-20","product_name":"Tương chao","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":1,"order_quantity":14,"total_sale":189000},
  {"order_date":"2023-06-21","product_name":"Nhấc nồi","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":14,"total_sale":644000},
  {"order_date":"2023-06-22","product_name":"Heo hộp khác Pork Luncheon Meat","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":3,"order_quantity":9,"total_sale":688500},
  {"order_date":"2023-06-23","product_name":"Máy đánh trứng","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":1,"order_quantity":1,"total_sale":711000},
  {"order_date":"2023-06-24","product_name":"Đậu Hũ","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":3,"order_quantity":19,"total_sale":855000},
  {"order_date":"2023-06-25","product_name":"Xúc xích heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":5,"order_quantity":17,"total_sale":357000},
  {"order_date":"2023-06-26","product_name":"Cá thu hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":8,"order_quantity":43,"total_sale":817000},
  {"order_date":"2023-06-27","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":4,"order_quantity":23,"total_sale":828000},
  {"order_date":"2023-06-28","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":7,"order_quantity":34,"total_sale":204000},
  {"order_date":"2023-06-29","product_name":"SữA Chua NếP CẩM 100G","product_category":"Thực phẩm đông lạnh","product_subcategory":"Kem, sữa chua, phô mai","order_count":4,"order_quantity":22,"total_sale":792000},
  {"order_date":"2023-06-30","product_name":"Kẹo cứng","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":1,"order_quantity":7,"total_sale":325500},
  {"order_date":"2023-07-01","product_name":"Nắp chắn dầu","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":4,"order_quantity":9,"total_sale":675000},
  {"order_date":"2023-07-02","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":20,"order_quantity":159,"total_sale":954000},
  {"order_date":"2023-07-03","product_name":"Bột nếp","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":9,"order_quantity":38,"total_sale":733400},
  {"order_date":"2023-07-04","product_name":"Túi đựng thực phẩm","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":2,"order_quantity":6,"total_sale":504000},
  {"order_date":"2023-07-05","product_name":"Ly thủy tinh","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":4,"order_quantity":62,"total_sale":248000},
  {"order_date":"2023-07-06","product_name":"Bánh quy Goodtime","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":3,"order_quantity":11,"total_sale":138600},
  {"order_date":"2023-07-07","product_name":"Vỉ nướng","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":155000},
  {"order_date":"2023-07-08","product_name":"Khô chà bông","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":2,"order_quantity":7,"total_sale":308700},
  {"order_date":"2023-07-09","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":7,"order_quantity":30,"total_sale":600000},
  {"order_date":"2023-07-10","product_name":"Bột Mì Làm Bánh Ngọt ”La Farina” Tipo 00","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":1,"order_quantity":4,"total_sale":127600},
  {"order_date":"2023-07-11","product_name":"Lạp xưởng heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":1,"order_quantity":1,"total_sale":117000},
  {"order_date":"2023-07-12","product_name":"Kéo","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":8,"total_sale":640000},
  {"order_date":"2023-07-13","product_name":"Thớt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":7,"total_sale":840000},
  {"order_date":"2023-07-14","product_name":"Mắm ruốc Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":4,"order_quantity":32,"total_sale":992000},
  {"order_date":"2023-07-15","product_name":"Lạp xưởng heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":2,"order_quantity":6,"total_sale":702000},
  {"order_date":"2023-07-16","product_name":"Khăn lau tạp dề","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":3,"total_sale":138000},
  {"order_date":"2023-07-17","product_name":"Tương hột","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":4,"total_sale":190000},
  {"order_date":"2023-07-18","product_name":"Bột nếp","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":7,"order_quantity":23,"total_sale":443900},
  {"order_date":"2023-07-19","product_name":"Mắm ruốc Huế","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":1,"order_quantity":4,"total_sale":124000},
  {"order_date":"2023-07-20","product_name":"Hạt hạnh nhân","product_category":"Thực phẩm đóng gói","product_subcategory":"Mứt, hạt, trái cây sấy","order_count":2,"order_quantity":3,"total_sale":426000},
  {"order_date":"2023-07-21","product_name":"Kéo","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":3,"order_quantity":4,"total_sale":320000},
  {"order_date":"2023-07-22","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":10,"order_quantity":78,"total_sale":436800},
  {"order_date":"2023-07-23","product_name":"Jambon Xông Khói","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":2,"order_quantity":5,"total_sale":235000},
  {"order_date":"2023-07-24","product_name":"Bột nổi","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":1,"order_quantity":4,"total_sale":148000},
  {"order_date":"2023-07-25","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":7,"order_quantity":45,"total_sale":945000},
  {"order_date":"2023-07-26","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":2,"order_quantity":8,"total_sale":160000},
  {"order_date":"2023-07-27","product_name":"Bột Mì Làm Bánh Ngọt ”La Farina” Tipo 00","product_category":"Thực phẩm khô","product_subcategory":"Bột các loại","order_count":3,"order_quantity":19,"total_sale":606100},
  {"order_date":"2023-07-28","product_name":"Cá nục hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":7,"order_quantity":16,"total_sale":336000},
  {"order_date":"2023-07-29","product_name":"Rau câu","product_category":"Thực phẩm đóng gói","product_subcategory":"Mứt, hạt, trái cây sấy","order_count":2,"order_quantity":4,"total_sale":147600},
  {"order_date":"2023-07-30","product_name":"Đậu Hũ","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":2,"order_quantity":3,"total_sale":135000},
  {"order_date":"2023-07-31","product_name":"Vỉ nướng","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":465000},
  {"order_date":"2023-08-01","product_name":"Cá nục hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":3,"order_quantity":39,"total_sale":819000},
  {"order_date":"2023-08-02","product_name":"Túi đựng rác size vừa","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":2,"order_quantity":9,"total_sale":738000},
  {"order_date":"2023-08-03","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":52,"total_sale":613600},
  {"order_date":"2023-08-04","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":39,"total_sale":218400},
  {"order_date":"2023-08-05","product_name":"Bình đun siêu tốc","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia đình","order_count":1,"order_quantity":1,"total_sale":215000},
  {"order_date":"2023-08-06","product_name":"Nắp chắn dầu","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":1,"order_quantity":2,"total_sale":150000},
  {"order_date":"2023-08-07","product_name":"Túi đựng rác size vừa","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":2,"order_quantity":8,"total_sale":656000},
  {"order_date":"2023-08-08","product_name":"Muối hồng Himalaya","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":4,"order_quantity":10,"total_sale":175000},
  {"order_date":"2023-08-09","product_name":"Muối hồng Himalaya","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":30,"total_sale":525000},
  {"order_date":"2023-08-10","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":2,"order_quantity":43,"total_sale":903000},
  {"order_date":"2023-08-11","product_name":"Chả Bò","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":1,"order_quantity":3,"total_sale":144000},
  {"order_date":"2023-08-12","product_name":"Khăn giấy hộp","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":7,"order_quantity":79,"total_sale":908500},
  {"order_date":"2023-08-13","product_name":"Rau Sắc Màu Hỗn Hợp","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":3,"order_quantity":23,"total_sale":897000},
  {"order_date":"2023-08-14","product_name":"Heo hộp khác Picnic Shoulder Categoria Extra","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":1,"order_quantity":2,"total_sale":324000},
  {"order_date":"2023-08-15","product_name":"Muối hồng Himalaya","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":3,"order_quantity":9,"total_sale":157500},
  {"order_date":"2023-08-16","product_name":"Muối hồng Himalaya","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":41,"total_sale":717500},
  {"order_date":"2023-08-17","product_name":"Khăn giấy bỏ túi","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":8,"order_quantity":80,"total_sale":1000000},
  {"order_date":"2023-08-18","product_name":"Cafe phin nguyên hạt","product_category":"Thức uống","product_subcategory":"Café","order_count":1,"order_quantity":2,"total_sale":552000},
  {"order_date":"2023-08-19","product_name":"Bắp Hạt Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":3,"order_quantity":20,"total_sale":240000},
  {"order_date":"2023-08-20","product_name":"Bánh canh","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":8,"total_sale":968000},
  {"order_date":"2023-08-21","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":3,"order_quantity":41,"total_sale":246000},
  {"order_date":"2023-08-22","product_name":"Hỗn Hợp Hạt Dạng Thanh Giàu Đạm Hạt Vị Caramel Muối Và Bơ","product_category":"Thực phẩm khô","product_subcategory":"Ngũ cốc","order_count":2,"order_quantity":4,"total_sale":836000},
  {"order_date":"2023-08-23","product_name":"Chả Bò","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":3,"order_quantity":6,"total_sale":288000},
  {"order_date":"2023-08-24","product_name":"Tương cà","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":3,"order_quantity":19,"total_sale":513000},
  {"order_date":"2023-08-25","product_name":"Tiêu xay","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":7,"order_quantity":21,"total_sale":289800},
  {"order_date":"2023-08-26","product_name":"Bắp Hạt Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":1,"order_quantity":48,"total_sale":576000},
  {"order_date":"2023-08-27","product_name":"Tương cà","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":19,"total_sale":513000},
  {"order_date":"2023-08-28","product_name":"Chả Bò","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":5,"order_quantity":18,"total_sale":864000},
  {"order_date":"2023-08-29","product_name":"Cafe đen hòa tan","product_category":"Thức uống","product_subcategory":"Café","order_count":1,"order_quantity":2,"total_sale":404000},
  {"order_date":"2023-08-30","product_name":"Ly thủy tinh","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":2,"order_quantity":28,"total_sale":112000},
  {"order_date":"2023-08-31","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":1,"order_quantity":52,"total_sale":988000},
  {"order_date":"2023-09-01","product_name":"Muối hồng Himalaya","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":3,"order_quantity":34,"total_sale":595000},
  {"order_date":"2023-09-02","product_name":"Xúc xích heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":5,"order_quantity":12,"total_sale":252000},
  {"order_date":"2023-09-03","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":2,"order_quantity":4,"total_sale":144000},
  {"order_date":"2023-09-04","product_name":"SữA Chua NếP CẩM 100G","product_category":"Thực phẩm đông lạnh","product_subcategory":"Kem, sữa chua, phô mai","order_count":2,"order_quantity":7,"total_sale":252000},
  {"order_date":"2023-09-05","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":1,"order_quantity":10,"total_sale":190000},
  {"order_date":"2023-09-06","product_name":"Kéo","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":2,"order_quantity":5,"total_sale":400000},
  {"order_date":"2023-09-07","product_name":"Khoai Tây Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":1,"order_quantity":4,"total_sale":152000},
  {"order_date":"2023-09-08","product_name":"Ngũ vị hương","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":3,"order_quantity":13,"total_sale":172900},
  {"order_date":"2023-09-09","product_name":"Capuchino hòa tan","product_category":"Thức uống","product_subcategory":"Café","order_count":1,"order_quantity":4,"total_sale":160000},
  {"order_date":"2023-09-10","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":2,"order_quantity":22,"total_sale":462000},
  {"order_date":"2023-09-11","product_name":"Đường phèn","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":4,"total_sale":144000},
  {"order_date":"2023-09-12","product_name":"Tương cà Ketchup","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":23,"total_sale":471500},
  {"order_date":"2023-09-13","product_name":"Giò Tai Ngon","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":1,"order_quantity":1,"total_sale":225000},
  {"order_date":"2023-09-14","product_name":"Cá thu hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":3,"order_quantity":34,"total_sale":646000},
  {"order_date":"2023-09-15","product_name":"Cháo đóng thùng","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":1,"total_sale":360000},
  {"order_date":"2023-09-16","product_name":"Thớt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":120000},
  {"order_date":"2023-09-17","product_name":"Túi đựng rác size vừa","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":3,"order_quantity":6,"total_sale":492000},
  {"order_date":"2023-09-18","product_name":"Bột rau câu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":2,"order_quantity":15,"total_sale":277500},
  {"order_date":"2023-09-19","product_name":"Giò Bò Ngon","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":2,"order_quantity":2,"total_sale":590000},
  {"order_date":"2023-09-20","product_name":"Muối hồng Himalaya","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":4,"order_quantity":46,"total_sale":805000},
  {"order_date":"2023-09-21","product_name":"Bột chiên đa dụng","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":1,"order_quantity":8,"total_sale":152000},
  {"order_date":"2023-09-22","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":21,"total_sale":117600},
  {"order_date":"2023-09-23","product_name":"Khăn lau tạp dề","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":6,"total_sale":276000},
  {"order_date":"2023-09-24","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":7,"order_quantity":73,"total_sale":438000},
  {"order_date":"2023-09-25","product_name":"Bột chiên đa dụng","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":4,"order_quantity":12,"total_sale":228000},
  {"order_date":"2023-09-26","product_name":"Cá trích hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":8,"order_quantity":60,"total_sale":720000},
  {"order_date":"2023-09-27","product_name":"Bánh trứng","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":2,"order_quantity":6,"total_sale":246000},
  {"order_date":"2023-09-28","product_name":"Bột chiên giòn","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":3,"order_quantity":10,"total_sale":300000},
  {"order_date":"2023-10-01","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":5,"order_quantity":20,"total_sale":236000},
  {"order_date":"2023-10-02","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":19,"total_sale":224200},
  {"order_date":"2023-10-03","product_name":"Kẹo mềm","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":2,"order_quantity":7,"total_sale":140000},
  {"order_date":"2023-10-04","product_name":"Thớt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":120000},  
  {"order_date":"2023-10-05","product_name":"Máy xay sinh tố","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":1,"order_quantity":1,"total_sale":360000},
  {"order_date":"2023-10-06","product_name":"Bột chiên đa dụng","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":3,"order_quantity":25,"total_sale":475000},
  {"order_date":"2023-10-07","product_name":"Chả Quế Ngon","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":1,"order_quantity":1,"total_sale":225000},
  {"order_date":"2023-10-08","product_name":"Cá nục hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":6,"total_sale":126000},
  {"order_date":"2023-10-09","product_name":"Cá nục hộp","product_category":"Thực phẩm đóng gói","product_subcategory":"Đồ hộp","order_count":2,"order_quantity":8,"total_sale":168000},
  {"order_date":"2023-10-10","product_name":"Trà hòa tan","product_category":"Thức uống","product_subcategory":"Trà","order_count":3,"order_quantity":7,"total_sale":504000},
  {"order_date":"2023-10-11","product_name":"Há Cảo Mini Nhân Tôm Thịt","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":1,"order_quantity":8,"total_sale":572000},
  {"order_date":"2023-10-12","product_name":"Dao chặt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":1,"total_sale":210000},
  {"order_date":"2023-10-13","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":5,"order_quantity":40,"total_sale":240000},
  {"order_date":"2023-10-14","product_name":"Bắp Hạt Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":1,"order_quantity":48,"total_sale":576000},
  {"order_date":"2023-10-15","product_name":"Tương cà Ketchup","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":1,"order_quantity":33,"total_sale":676500},
  {"order_date":"2023-10-16","product_name":"Dao bào","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":5,"total_sale":225000},
  {"order_date":"2023-10-17","product_name":"Thớt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":360000},
  {"order_date":"2023-10-18","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":3,"order_quantity":15,"total_sale":315000},
  {"order_date":"2023-10-19","product_name":"Bột nếp","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":2,"order_quantity":23,"total_sale":443900},
  {"order_date":"2023-10-20","product_name":"Gia vị nấu lẩu, canh","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":3,"total_sale":114000},
  {"order_date":"2023-10-21","product_name":"Bột chiên đa dụng","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":2,"order_quantity":7,"total_sale":133000},
  {"order_date":"2023-10-22","product_name":"Máy xay sinh tố","product_category":"Đồ gia dụng","product_subcategory":"Đồ điện gia dụng nhà bếp","order_count":2,"order_quantity":2,"total_sale":720000},
  {"order_date":"2023-10-23","product_name":"Tương cà","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":4,"order_quantity":37,"total_sale":999000},
  {"order_date":"2023-10-24","product_name":"Chả Bò","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":4,"order_quantity":17,"total_sale":816000},
  {"order_date":"2023-10-25","product_name":"Giò Xào Ngon","product_category":"Thực phẩm tươi sống","product_subcategory":"Thực phẩm sơ chế","order_count":1,"order_quantity":1,"total_sale":215000},
  {"order_date":"2023-10-26","product_name":"Tương cà","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":6,"order_quantity":18,"total_sale":486000},
  {"order_date":"2023-10-27","product_name":"Miến sườn heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":1,"total_sale":210000},
  {"order_date":"2023-10-28","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":9,"order_quantity":93,"total_sale":558000},
  {"order_date":"2023-10-29","product_name":"Gia vị nấu lẩu, canh","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":2,"order_quantity":8,"total_sale":304000},
  {"order_date":"2023-10-30","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":3,"order_quantity":20,"total_sale":112000},
  {"order_date":"2023-10-31","product_name":"Bánh canh","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":4,"total_sale":484000},
  {"order_date":"2023-11-01","product_name":"Bột nếp","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Nguyên liệu làm bánh","order_count":2,"order_quantity":50,"total_sale":965000},
  {"order_date":"2023-11-02","product_name":"Phở khác","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":17,"total_sale":782000},
  {"order_date":"2023-11-03","product_name":"Cafe đen hòa tan","product_category":"Thức uống","product_subcategory":"Café","order_count":2,"order_quantity":4,"total_sale":808000},
  {"order_date":"2023-11-04","product_name":"Kẹo cứng","product_category":"Thực phẩm đóng gói","product_subcategory":"Kẹo","order_count":1,"order_quantity":13,"total_sale":604500},
  {"order_date":"2023-11-05","product_name":"Nhấc nồi","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":138000},
  {"order_date":"2023-11-06","product_name":"Thau, rổ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng nhà bếp","order_count":1,"order_quantity":3,"total_sale":825000},
  {"order_date":"2023-11-07","product_name":"Sữa tươi","product_category":"Thức uống","product_subcategory":"Sữa","order_count":1,"order_quantity":2,"total_sale":640000},
  {"order_date":"2023-11-08","product_name":"Gia vị nấu phở, bún, hủ tiếu","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":1,"order_quantity":7,"total_sale":280000},
  {"order_date":"2023-11-09","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":4,"order_quantity":24,"total_sale":480000},
  {"order_date":"2023-11-10","product_name":"Ly giữ nhiệt","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":1,"order_quantity":3,"total_sale":660000},
  {"order_date":"2023-11-11","product_name":"Tương cà","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng nước","order_count":2,"order_quantity":7,"total_sale":189000},
  {"order_date":"2023-11-12","product_name":"Xúc xích heo","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":2,"order_quantity":16,"total_sale":336000},
  {"order_date":"2023-11-13","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":1,"order_quantity":31,"total_sale":365800},
  {"order_date":"2023-11-14","product_name":"Mì khoai tây","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":3,"order_quantity":48,"total_sale":201600},
  {"order_date":"2023-11-15","product_name":"Cá Viên Cao Cấp Gói 500G","product_category":"Thực phẩm đông lạnh","product_subcategory":"Thực phẩm chế biến sẵn","order_count":1,"order_quantity":4,"total_sale":156000},
  {"order_date":"2023-11-16","product_name":"Khoai Tây Đông Lạnh","product_category":"Thực phẩm đông lạnh","product_subcategory":"Rau củ quả đông lạnh","order_count":1,"order_quantity":3,"total_sale":114000},
  {"order_date":"2023-11-17","product_name":"Mì cay","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":2,"order_quantity":66,"total_sale":363000},
  {"order_date":"2023-11-18","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":3,"order_quantity":14,"total_sale":504000},
  {"order_date":"2023-11-19","product_name":"Ly sứ","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":1,"order_quantity":36,"total_sale":720000},
  {"order_date":"2023-11-20","product_name":"Xúc xích bò Gold","product_category":"Thực phẩm đóng gói","product_subcategory":"Xúc xích, lạp xưởng","order_count":3,"order_quantity":6,"total_sale":126000},
  {"order_date":"2023-11-21","product_name":"Bánh que &","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":4,"order_quantity":50,"total_sale":950000},
  {"order_date":"2023-11-22","product_name":"Ngũ vị hương","product_category":"Gia vị - nguyên liệu nấu ăn","product_subcategory":"Gia vị dạng bột","order_count":3,"order_quantity":11,"total_sale":146300},
  {"order_date":"2023-11-23","product_name":"Bánh que &","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":1,"order_quantity":39,"total_sale":741000},
  {"order_date":"2023-11-24","product_name":"Cháo ăn liền","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":4,"order_quantity":58,"total_sale":684400},
  {"order_date":"2023-11-25","product_name":"Bánh bông lan","product_category":"Thực phẩm đóng gói","product_subcategory":"Bánh","order_count":2,"order_quantity":41,"total_sale":779000},
  {"order_date":"2023-11-26","product_name":"Ly thủy tinh","product_category":"Đồ gia dụng","product_subcategory":"Đồ dùng phòng ăn","order_count":4,"order_quantity":31,"total_sale":124000},
  {"order_date":"2023-11-27","product_name":"Cơm cháy bánh tráng trộn","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":1,"order_quantity":4,"total_sale":144000},
  {"order_date":"2023-11-28","product_name":"Nắp chắn dầu","product_category":"Đồ gia dụng","product_subcategory":"Đồ sử dụng một lần","order_count":1,"order_quantity":2,"total_sale":150000},
  {"order_date":"2023-11-29","product_name":"Snack khoai tây Big Sheet","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn vặt","order_count":8,"order_quantity":77,"total_sale":462000},
  {"order_date":"2023-11-30","product_name":"Mì Lẩu","product_category":"Thực phẩm đóng gói","product_subcategory":"Thực phẩm ăn liền","order_count":5,"order_quantity":54,"total_sale":302400}
  ];


function get_column() {
    const columnTypes = {};
    const sampleItem = data[0]; // Lấy một mục nhập mẫu từ dữ liệu

    // Duyệt qua mỗi trường trong mục nhập mẫu để xác định kiểu dữ liệu
    for (const key in sampleItem) {
        const value = sampleItem[key];
        if (typeof value === 'number') {
            columnTypes[key] = 'number';
        } else if (typeof value === 'string' && isNaN(Date.parse(value))) {
            columnTypes[key] = 'text';
        } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            columnTypes[key] = 'date';
        }
    }

    return columnTypes;
}


// Biến toàn cục để lưu trữ dữ liệu đã lọc
let current_data = [];


function filter_field_data(filters) {
  current_data =  data.filter(item => {
    for (const field in filters) {
      const { type, values } = filters[field];
      if (type === "includes" && !values.includes(item[field])) {
        return false;
      } else if (type === "range" && (item[field] < values.start || item[field] > values.end)) {
        return false;
      }
    }
    return true;
  });
}

//INPUT:
// const filters = {
//   "product_name": { type: "includes", values: ["Mì Lẩu", "Nắp chắn dầu"] },
//   "total_sale": { type: "range", values: { start: 200, end: 500000 } }
// };



function get_info_filter(field) {
  if (typeof data[0][field] === 'number') {
    let min = data[0][field], max = data[0][field];
    data.forEach(item => {
      if (item[field] < min) min = item[field];
      if (item[field] > max) max = item[field];
    });
    return [min, max];
  } else {
    const uniqueValues = new Set();
    data.forEach(item => {
      uniqueValues.add(item[field]);
    });
    return Array.from(uniqueValues);
  }
}

function get_data_table(list_field) {
  if (!Array.isArray(list_field)) {
      console.error('Invalid input: list_field must be an array.');
      return []; // Return an empty array to avoid further errors
  }

  let filter_data = current_data.map(item => {
      let filteredItem = {};
      list_field.forEach(field => {
          if (item[field] !== undefined) {
              filteredItem[field] = item[field];
          }
      });
      return filteredItem;
  });
  return filter_data;
}


// Ví dụ sử dụng:
// Giả sử `data` là mảng đối tượng bạn đã có sẵn
// let fields = ['product_name', 'total_sale'];
// result = get_data_table(fields)

function get_data_card(field, agg) {
  let total = 0;
  let count = 0;
  const distinctValues = new Set();
  let isNumber = true; // Giả sử ban đầu trường là kiểu số

  current_data.forEach(item => {
    const value = item[field];
    if (typeof value === 'string') {
      isNumber = false; // Nếu phát hiện trường là kiểu chuỗi, cập nhật biến kiểm tra
    } else {
      total += value; // Cộng dồn chỉ khi giá trị là số
    }
    count += 1;
    distinctValues.add(value);
  });

  if (!isNumber && (agg === 'SUM' || agg === 'AVERAGE')) {
    return 0; // Trả về 0 cho SUM và AVERAGE nếu trường là kiểu chuỗi
  }

  switch (agg) {
    case 'SUM':
      return total;
    case 'AVERAGE':
      return count > 0 ? total / count : 0; // Tránh chia cho 0
    case 'COUNT':
      return count;
    case 'DISTINCT':
      return distinctValues.size;
    default:
      return 0;  // Trả về 0 cho các loại tổng hợp không xác định
  }
}

function get_data_bcp(categoryfield, valuefield, agg, sort = "", top = "") {
    const result = {};
    // Duyệt qua dữ liệu để tính toán dựa trên agg
    current_data.forEach(item => {
      const category = item[categoryfield];
      const value = item[valuefield];
      if (!result[category]) {
        result[category] = { count: 0, sum: 0, distinct: new Set() };
      }
      result[category].sum += value;
      result[category].count += 1;
      result[category].distinct.add(value);
    });

  
    // Chuyển đổi kết quả dựa trên agg và chuẩn bị mảng cho việc sắp xếp
    let output = Object.keys(result).map(category => {
      let aggValue;
      switch (agg) {
        case 'SUM':
          aggValue = result[category].sum;
          break;
        case 'AVERAGE':
          aggValue = result[category].sum / result[category].count;
          break;
        case 'COUNT':
          aggValue = result[category].count;
          break;
        case 'DISTINCT':
          aggValue = result[category].distinct.size;
          break;
        default:
          aggValue = 0; // Mặc định là 0 nếu không khớp với bất kỳ trường hợp nào
      }
      return { "categoryfield": category, "valuefield": aggValue };
    });

      // Xử lý sắp xếp dựa trên tham số 'sort'
      if (sort === "asc") {
          output.sort((a, b) => a.valuefield - b.valuefield);
      } else if (sort === "desc") {
          output.sort((a, b) => b.valuefield - a.valuefield);
      }

    // Kiểm tra và áp dụng giới hạn 'top' nếu có giá trị hợp lệ
    if (top) {
      const topNumber = parseInt(top, 10); // Chuyển đổi 'top' từ chuỗi sang số nguyên
      if (!isNaN(topNumber)) {
        output = output.slice(0, topNumber);
      }
    }
      
      return output;
  }


module.exports = {
  get_column,
  get_data_bcp,
  get_data_card,
  get_data_table,
  get_info_filter,
  filter_field_data
};


 