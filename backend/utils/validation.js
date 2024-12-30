exports.validateTravelExpense = (data) => {
  const requiredFields = ['name', 'amount', 'date', 'type', 'category', 'subCategory', 'budget'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  if (isNaN(data.amount) || data.amount < 0) {
    return 'Amount must be a valid positive number';
  }

  if (isNaN(data.budget) || data.budget < 0) {
    return 'Budget must be a valid positive number';
  }

  const validTypes = ['Personal', 'Business'];
  if (!validTypes.includes(data.type)) {
    return 'Invalid expense type. Must be either Personal or Business';
  }

  const validCategories = ['Transportation', 'Accommodation', 'Meals', 'Miscellaneous'];
  if (!validCategories.includes(data.category)) {
    return 'Invalid category';
  }

  try {
    new Date(data.date);
  } catch (error) {
    return 'Invalid date format';
  }

  return null;
};
