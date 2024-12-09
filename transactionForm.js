import React from 'react';

const TransactionForm = () => (
  <div>
    <h2>Add Transaction</h2>
    <form>
      <label>
        Category:
        <input type="text" name="category" />
      </label>
      <br />
      <label>
        Amount:
        <input type="number" name="amount" />
      </label>
      <br />
      <label>
        Payment Method:
        <select name="paymentMethod">
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank transfer">Bank Transfer</option>
        </select>
      </label>
      <br />
      <label>
        Type:
        <select name="type">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <br />
      <button type="submit">Add Transaction</button>
    </form>
  </div>
);

export default TransactionForm;
