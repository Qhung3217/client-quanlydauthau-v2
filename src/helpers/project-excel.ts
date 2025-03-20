import type { ProjectDetails } from "src/types/project";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { htmlToText } from "html-to-text";

export const exportProjectToExcel = async (project: ProjectDetails) => {
  if (!project) return;

  // Lọc estimates đã approved
  const approvedEstimates = project.estimates.filter(
    (e) => e.status === "APPROVED"
  );

  if (!approvedEstimates.length) {
    alert("Không có dự toán nào được phê duyệt!");
    return;
  }

  // Tạo workbook & worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Dự án");

  // === Tiêu đề lớn ===
  const titleRow = worksheet.addRow(["THÔNG TIN DỰ ÁN VÀ DỰ TOÁN"]);
  titleRow.font = { bold: true, size: 16 };
  titleRow.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.mergeCells("A1:C1");
  worksheet.addRow([]);

  // === Thông tin dự án (không border) ===
  const projectInfo = [
    ["Tên Dự Án", project.name],
    ["Mã Dự Án", project.code],
    ["Địa Chỉ", project.address],
  ];

  projectInfo.forEach(([label, value]) => {
    const row = worksheet.addRow([label, value]);
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: "top", wrapText: true };
      if (colNumber === 1) cell.font = { bold: true };
    });
  });
  worksheet.addRow([]);

  // === Tiêu đề bảng ===
  const headerRow = worksheet.addRow(["STT", "Tên Sản Phẩm", "Thông số kỹ thuật"]);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } };
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  // === Dữ liệu sản phẩm ===
  let count = 1;
  approvedEstimates.forEach((estimate) => {
    estimate.productEstimates.forEach((product) => {
      // Chuyển HTML sang text giữ định dạng
      const description = htmlToText(product.desc || "", {
        preserveNewlines: true,
      });

      const row = worksheet.addRow([count, product.name, description]);

      // Tự động điều chỉnh độ cao hàng
      const lineBreaks = (description.match(/\n/g) || []).length;
      row.height = 20 * (lineBreaks + 1); // 20px per line

      row.eachCell((cell) => {
        cell.alignment = { vertical: "top", wrapText: true };
        cell.border = { left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
      });

      count++;
    });
  });

  // === Cài đặt cột ===
  worksheet.columns = [
    { width: 15, key: 'stt' },
    { width: 35, key: 'name' },
    { width: 70, key: 'desc' }
  ];

  // Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `DuAn_${project.code}_${project.name}.xlsx`);
};