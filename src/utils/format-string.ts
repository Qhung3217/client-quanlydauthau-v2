export function shortenText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + ellipsis;
}

export function shortenTextInMiddle(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (text.length <= maxLength) {
    return text; // Trả về nguyên văn bản nếu không cần rút gọn
  }

  // Tính toán số ký tự cần giữ lại ở đầu và cuối
  const charsToKeep = Math.floor((maxLength - ellipsis.length) / 2);
  const start = text.slice(0, charsToKeep); // Phần đầu của văn bản
  const end = text.slice(-charsToKeep); // Phần cuối của văn bản

  return `${start}${ellipsis}${end}`; // Kết hợp và trả về kết quả
}
