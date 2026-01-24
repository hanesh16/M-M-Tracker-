import React, { useState, useEffect } from 'react';
import NavHeader from '../components/NavHeader';
import Footer2 from '../components/footer2';
import { useCurrency } from '../context/CurrencyContext';
import { formatMoney } from '../utils/currencyUtils';

import { API_BASE_URL } from '../utils/api';

const AddExpense = () => {
  // const API_BASE_URL = 'http://localhost:8000'; (Moved to utils)
  const token = typeof window !== 'undefined' ? localStorage.getItem('det-token') : null;
  const { currency } = useCurrency();
  // Form states
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [expenseType, setExpenseType] = useState('regular'); // 'regular' or 'additional'
  const [submitted, setSubmitted] = useState(false);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Edit mode states
  const [editModeRegular, setEditModeRegular] = useState(false);
  const [editModeAdditional, setEditModeAdditional] = useState(false);
  const [selectedForDeleteRegular, setSelectedForDeleteRegular] = useState(new Set());
  const [selectedForDeleteAdditional, setSelectedForDeleteAdditional] = useState(new Set());

  // Expense data from backend
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/expenses/?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        // Normalize to match existing UI expectations
        const mapped = data.map(e => ({
          id: e.id,
          category: e.category,
          amount: e.amount,
          date: e.expense_date,
          type: e.expense_type || 'additional',
          notes: e.notes || ''
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
  };

  // Load from backend on mount and when window regains focus
  useEffect(() => {
    fetchExpenses();
    const handleFocus = () => fetchExpenses();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = [
    'Rent', 'Internet', 'Phone', 'Groceries', 'Transport', 'Entertainment',
    'Shopping', 'Health', 'Education', 'Utilities', 'Dining', 'Other'
  ];

  const handleDeleteExpenses = async (expenseIds) => {
    if (!token) return;
    try {
      // Delete each selected expense on backend
      await Promise.all(
        Array.from(expenseIds).map(id =>
          fetch(`${API_BASE_URL}/expenses/${id}?token=${token}`, { method: 'DELETE' })
        )
      );
      await fetchExpenses();
    } catch (err) {
      console.error('Failed to delete expenses', err);
    } finally {
      setSelectedForDeleteRegular(new Set());
      setSelectedForDeleteAdditional(new Set());
      setEditModeRegular(false);
      setEditModeAdditional(false);
    }
  };

  const toggleSelectRegular = (id) => {
    const newSelected = new Set(selectedForDeleteRegular);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForDeleteRegular(newSelected);
  };

  const toggleSelectAdditional = (id) => {
    const newSelected = new Set(selectedForDeleteAdditional);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForDeleteAdditional(newSelected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (category && amount && date) {
      try {
        const res = await fetch(`${API_BASE_URL}/expenses/?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category,
            amount: parseFloat(amount),
            expense_date: date,
            notes,
            expense_type: expenseType,
            currency: currency
          })
        });
        if (res.ok) {
          await fetchExpenses();
          setSubmitted(true);
          setTimeout(() => {
            setCategory('');
            setAmount('');
            setDate('');
            setNotes('');
            setSubmitted(false);
          }, 2000);
        }
      } catch (err) {
        console.error('Error submitting expense:', err);
      }
    }
  };

  // Filter expenses by month, year, and category
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const monthMatch = expenseDate.getMonth() + 1 === parseInt(selectedMonth);
    const yearMatch = expenseDate.getFullYear() === parseInt(selectedYear);
    const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter;
    return monthMatch && yearMatch && categoryMatch;
  });

  const regularExpenses = filteredExpenses.filter(e => e.type === 'regular');
  const additionalExpenses = filteredExpenses.filter(e => e.type === 'additional');

  // Calculate totals
  const regularTotal = regularExpenses.reduce((sum, e) => sum + e.amount, 0);
  const additionalTotal = additionalExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyTotal = regularTotal + additionalTotal;

  const yearlyExpenses = expenses.filter(e => new Date(e.date).getFullYear() === parseInt(selectedYear));
  const yearlyTotal = yearlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const allTimeTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <NavHeader />
      <div style={{
        background: 'linear-gradient(135deg, #d8e9f3 0%, #f0f5f8 50%, #fdf8f1 100%)',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px 60px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              color: '#2f2b28',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              Add Expense
            </h1>
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              margin: 0
            }}>
              Track your spending daily, monthly, and yearly
            </p>
          </div>

          {/* Totals Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: '#fffbf0',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '2px solid #fbe2d9'
            }}>
              <h3 style={{ color: '#6b6359', fontSize: '0.85rem', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                This Month
              </h3>
              <p style={{ color: '#2f2b28', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                {formatMoney(monthlyTotal, currency)}
              </p>
            </div>
            <div style={{
              background: '#fffbf0',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '2px solid #fbe2d9'
            }}>
              <h3 style={{ color: '#6b6359', fontSize: '0.85rem', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                This Year
              </h3>
              <p style={{ color: '#2f2b28', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                {formatMoney(yearlyTotal, currency)}
              </p>
            </div>
            <div style={{
              background: '#fffbf0',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '2px solid #fbe2d9'
            }}>
              <h3 style={{ color: '#6b6359', fontSize: '0.85rem', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                All Time
              </h3>
              <p style={{ color: '#2f2b28', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                {formatMoney(allTimeTotal, currency)}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>

            {/* Add Expense Form */}
            <div style={{
              background: '#fffbf0',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                color: '#2f2b28',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                Record New Expense
              </h2>

              {submitted && (
                <div style={{
                  background: '#c8e6c9',
                  color: '#2e7d32',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  ✓ Expense added successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Expense Type Toggle */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2f2b28',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}>
                    Expense Type *
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setExpenseType('regular')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: expenseType === 'regular' ? '#DAA06D' : '#fff',
                        color: expenseType === 'regular' ? '#fff' : '#2f2b28',
                        border: '2px solid #DAA06D',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                      Regular (Monthly)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpenseType('additional')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: expenseType === 'additional' ? '#f6b7a0' : '#fff',
                        color: expenseType === 'additional' ? '#fff' : '#2f2b28',
                        border: '2px solid #f6b7a0',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}>
                      Additional (One-time)
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2f2b28',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#2f2b28',
                      background: '#fff',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2f2b28',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Amount ({currency === 'INR' ? '₹' : '$'}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#2f2b28',
                      background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Date */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2f2b28',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#2f2b28',
                      background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2f2b28',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#2f2b28',
                      background: '#fff',
                      boxSizing: 'border-box',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#DAA06D',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(218, 160, 109, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#c89052';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#DAA06D';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                  Add Expense
                </button>
              </form>
            </div>

            {/* Monthly Expenses Overview */}
            <div>
              {/* Monthly Regular Expenses */}
              <div style={{
                background: '#fffbf0',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    color: '#2f2b28',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    Monthly Regular Expenses
                  </h3>
                  {regularExpenses.length > 0 && (
                    <button
                      onClick={() => {
                        setEditModeRegular(!editModeRegular);
                        setSelectedForDeleteRegular(new Set());
                      }}
                      style={{
                        padding: '6px 16px',
                        background: editModeRegular ? '#fbe2d9' : '#fff',
                        color: '#DAA06D',
                        border: '2px solid #DAA06D',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!editModeRegular) e.currentTarget.style.background = '#f0d9c4';
                      }}
                      onMouseLeave={(e) => {
                        if (!editModeRegular) e.currentTarget.style.background = '#fff';
                      }}>
                      {editModeRegular ? 'Cancel' : 'Edit'}
                    </button>
                  )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  {regularExpenses.length > 0 ? (
                    regularExpenses.map(expense => (
                      <div key={expense.id} style={{
                        background: '#fff',
                        padding: '12px 15px',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        border: selectedForDeleteRegular.has(expense.id) ? '2px solid #DAA06D' : 'none'
                      }}>
                        {editModeRegular && (
                          <input
                            type="checkbox"
                            checked={selectedForDeleteRegular.has(expense.id)}
                            onChange={() => toggleSelectRegular(expense.id)}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              marginRight: '12px'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#2f2b28', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 3px 0' }}>
                            {expense.category}
                          </p>
                          <p style={{ color: '#9b8f84', fontSize: '0.8rem', margin: 0 }}>
                            {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <p style={{ color: '#DAA06D', fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
                          {formatMoney(expense.amount, currency)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#9b8f84', fontSize: '0.9rem', textAlign: 'center', margin: '20px 0' }}>
                      No regular expenses this month
                    </p>
                  )}
                </div>
                {editModeRegular && selectedForDeleteRegular.size > 0 && (
                  <button
                    onClick={() => handleDeleteExpenses(selectedForDeleteRegular)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#c62828',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b71c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#c62828';
                    }}>
                    Delete Selected ({selectedForDeleteRegular.size})
                  </button>
                )}
                <div style={{
                  borderTop: '2px solid #f6b7a0',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <p style={{ color: '#2f2b28', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                    Regular Total:
                  </p>
                  <p style={{ color: '#DAA06D', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                    {formatMoney(regularTotal, currency)}
                  </p>
                </div>
              </div>

              {/* Additional Expenses */}
              <div style={{
                background: '#fffbf0',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    color: '#2f2b28',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    Additional Expenses
                  </h3>
                  {additionalExpenses.length > 0 && (
                    <button
                      onClick={() => {
                        setEditModeAdditional(!editModeAdditional);
                        setSelectedForDeleteAdditional(new Set());
                      }}
                      style={{
                        padding: '6px 16px',
                        background: editModeAdditional ? '#fbe2d9' : '#fff',
                        color: '#f6b7a0',
                        border: '2px solid #f6b7a0',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!editModeAdditional) e.currentTarget.style.background = '#fbe2d9';
                      }}
                      onMouseLeave={(e) => {
                        if (!editModeAdditional) e.currentTarget.style.background = '#fff';
                      }}>
                      {editModeAdditional ? 'Cancel' : 'Edit'}
                    </button>
                  )}
                </div>
                <div style={{ marginBottom: '15px' }}>
                  {additionalExpenses.length > 0 ? (
                    additionalExpenses.map(expense => (
                      <div key={expense.id} style={{
                        background: '#fff',
                        padding: '12px 15px',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        border: selectedForDeleteAdditional.has(expense.id) ? '2px solid #f6b7a0' : 'none'
                      }}>
                        {editModeAdditional && (
                          <input
                            type="checkbox"
                            checked={selectedForDeleteAdditional.has(expense.id)}
                            onChange={() => toggleSelectAdditional(expense.id)}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              marginRight: '12px'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#2f2b28', fontSize: '0.95rem', fontWeight: '600', margin: '0 0 3px 0' }}>
                            {expense.category}
                          </p>
                          <p style={{ color: '#9b8f84', fontSize: '0.8rem', margin: 0 }}>
                            {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <p style={{ color: '#f6b7a0', fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
                          {formatMoney(expense.amount, currency)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#9b8f84', fontSize: '0.9rem', textAlign: 'center', margin: '20px 0' }}>
                      No additional expenses this month
                    </p>
                  )}
                </div>
                {editModeAdditional && selectedForDeleteAdditional.size > 0 && (
                  <button
                    onClick={() => handleDeleteExpenses(selectedForDeleteAdditional)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#c62828',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b71c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#c62828';
                    }}>
                    Delete Selected ({selectedForDeleteAdditional.size})
                  </button>
                )}
                <div style={{
                  borderTop: '2px solid #f6b7a0',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <p style={{ color: '#2f2b28', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                    Additional Total:
                  </p>
                  <p style={{ color: '#f6b7a0', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                    {formatMoney(additionalTotal, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expense History Section */}
          <div style={{
            background: '#fffbf0',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              color: '#2f2b28',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Expense History
            </h2>

            {/* Filters */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '25px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{
                  display: 'block',
                  color: '#6b6359',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #f6b7a0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#2f2b28',
                    background: '#fff',
                    cursor: 'pointer'
                  }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2026, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{
                  display: 'block',
                  color: '#6b6359',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #f6b7a0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#2f2b28',
                    background: '#fff',
                    cursor: 'pointer'
                  }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={2026 - i} value={2026 - i}>
                      {2026 - i}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{
                  display: 'block',
                  color: '#6b6359',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #f6b7a0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#2f2b28',
                    background: '#fff',
                    cursor: 'pointer'
                  }}>
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expense List */}
            <div>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map(expense => (
                  <div key={expense.id} style={{
                    background: '#fff',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft: `4px solid ${expense.type === 'regular' ? '#DAA06D' : '#f6b7a0'}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <p style={{ color: '#2f2b28', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                          {expense.category}
                        </p>
                        <span style={{
                          background: expense.type === 'regular' ? '#f0d9c4' : '#fbe2d9',
                          color: '#2f2b28',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {expense.type === 'regular' ? 'Regular' : 'Additional'}
                        </span>
                      </div>
                      <p style={{ color: '#9b8f84', fontSize: '0.85rem', margin: '0 0 3px 0' }}>
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      {expense.notes && (
                        <p style={{ color: '#9b8f84', fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>
                          {expense.notes}
                        </p>
                      )}
                    </div>
                    <p style={{
                      color: expense.type === 'regular' ? '#DAA06D' : '#f6b7a0',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      {formatMoney(expense.amount, currency)}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{
                  background: '#fff',
                  padding: '40px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#9b8f84', fontSize: '1rem', margin: 0 }}>
                    No expenses found for the selected filters
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(500px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(250px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer2 />
    </>
  );
};

export default AddExpense;
