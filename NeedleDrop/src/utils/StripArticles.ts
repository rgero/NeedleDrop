export const stripArticles = (str: string) => {
  if (!str) return '';
  // This regex removes "The ", "A ", and "An " from the start (case-insensitive)
  //return str.replace(/^(the\s+|a\s+|an\s+)/i, '').trim();
  return str.replace(/^(the\s+)/i, '').trim();
};