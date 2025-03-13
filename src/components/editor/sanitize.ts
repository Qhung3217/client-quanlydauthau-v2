import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = ['p', 'strong', 'em', 'ul', 'li'];

export const sanitizeInput = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
  });
