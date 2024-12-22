exports.validateTransaction = (data) => {
    console.log('Validating transaction data:', data); // Debug log

    const { type, category, amount, date, description } = data;

    if (!type || !['expense', 'income'].includes(type)) {
        return 'Invalid transaction type';
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        return 'Category is required';
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return 'Invalid amount';
    }

    // More lenient date validation
    if (date && isNaN(new Date(date).getTime())) {
        return 'Invalid date format';
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        return 'Description is required';
    }

    console.log('Validation passed'); // Debug log
    return null;
};
