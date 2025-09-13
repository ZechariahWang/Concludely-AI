export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateJournalEntry = (title, content) => {
  const errors = {};
  
  if (!validateRequired(title)) {
    errors.title = 'Title is required';
  }
  
  if (!validateRequired(content)) {
    errors.content = 'Content is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};