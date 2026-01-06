import React, { useState, useEffect } from 'react';
import NavHeader from '../components/NavHeader';
import Footer2 from '../components/footer2';
import { useCurrency } from '../context/CurrencyContext';
import { formatMoney } from '../utils/currencyUtils';

const AddIncome = () => {
  const API_BASE_URL = 'http://localhost:8000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('det-token') : null;
  const { currency } = useCurrency();
  // Form states
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [sourceFilter, setSourceFilter] = useState('all');

  // Saving Plan states
  const [savingPlanCategory, setSavingPlanCategory] = useState('');
  const [savingPlanAmount, setSavingPlanAmount] = useState('');
  const [planSubmitted, setPlanSubmitted] = useState(false);

  // Edit mode states
  const [editModeIncomeHistory, setEditModeIncomeHistory] = useState(false);
  const [editModeSavingPlans, setEditModeSavingPlans] = useState(false);
  const [selectedForDeleteIncomes, setSelectedForDeleteIncomes] = useState(new Set());
  const [selectedForDeletePlans, setSelectedForDeletePlans] = useState(new Set());

  // Income data from backend
  const [incomes, setIncomes] = useState([]);

  // Expenses from backend for monthly summary
  const [expenses, setExpenses] = useState([]);

  // Saving plans from backend
  const [savingPlans, setSavingPlans] = useState([]);
  const [plannedTotal, setPlannedTotal] = useState(0);
  const [plannedCount, setPlannedCount] = useState(0);

  // Fetch incomes/expenses from backend
  const fetchIncomes = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/incomes/?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(i => ({
          id: i.id,
          source: i.source,
          amount: i.amount,
          date: i.income_date,
          notes: i.notes || ''
        }));
        setIncomes(mapped);
      }
    } catch (err) {
      console.error('Failed to load incomes', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/expenses/?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(e => ({
          id: e.id,
          amount: e.amount,
          date: e.expense_date
        }));
        setExpenses(mapped);
      }
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
    const onFocus = () => { fetchIncomes(); fetchExpenses(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sources = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Bonus',
    'Gift',
    'Refund',
    'Other'
  ];

  const handleDeleteIncomes = async (incomeIds) => {
    if (!token) return;
    try {
      await Promise.all(
        Array.from(incomeIds).map(id =>
          fetch(`${API_BASE_URL}/incomes/${id}?token=${token}`, { method: 'DELETE' })
        )
      );
      await fetchIncomes();
    } catch (err) {
      console.error('Failed to delete incomes', err);
    } finally {
      setSelectedForDeleteIncomes(new Set());
      setEditModeIncomeHistory(false);
    }
  };

  const handleDeletePlans = async (planIds) => {
    if (!token) return;
    try {
      await Promise.all(
        Array.from(planIds).map(id => fetch(`${API_BASE_URL}/plans/${id}?token=${token}`, { method: 'DELETE' }))
      );
      await fetchSavingPlans(selectedMonth, selectedYear);
      await fetchSavingPlanSummary(selectedMonth, selectedYear);
    } catch (err) {
      console.error('Failed to delete saving plans', err);
    } finally {
      setSelectedForDeletePlans(new Set());
      setEditModeSavingPlans(false);
    }
  };

  const toggleSelectIncome = (id) => {
    const newSelected = new Set(selectedForDeleteIncomes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForDeleteIncomes(newSelected);
  };

  const toggleSelectPlan = (id) => {
    const newSelected = new Set(selectedForDeletePlans);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForDeletePlans(newSelected);
  };

  const savingCategories = [
    'Emergency Fund',
    'Travel Fund',
    'Home / Rent',
    'Phone Bill',
    'Investment',
    'Shopping Budget',
    'Education',
    'Healthcare',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (source && amount && date) {
      try {
        const res = await fetch(`${API_BASE_URL}/incomes/?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source,
            amount: parseFloat(amount),
            income_date: date,
            notes
          })
        });
        if (res.ok) {
          await fetchIncomes();
          await fetchExpenses();
          setSubmitted(true);
          setTimeout(() => {
            setSource('');
            setAmount('');
            setDate('');
            setNotes('');
            setSubmitted(false);
          }, 2000);
        }
      } catch (err) {
        console.error('Error submitting income:', err);
      }
    }
  };

  const handleSavingPlanSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (savingPlanCategory && savingPlanAmount) {
      try {
        const res = await fetch(`${API_BASE_URL}/plans/?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: savingPlanCategory,
            amount: parseFloat(savingPlanAmount),
            month: parseInt(selectedMonth),
            year: parseInt(selectedYear)
          })
        });
        if (res.ok) {
          await fetchSavingPlans(selectedMonth, selectedYear);
          await fetchSavingPlanSummary(selectedMonth, selectedYear);
          setPlanSubmitted(true);
          setTimeout(() => {
            setSavingPlanCategory('');
            setSavingPlanAmount('');
            setPlanSubmitted(false);
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to create saving plan', err);
      }
    }
  };

  // Filter incomes by month, year, and source
  const filteredIncomes = incomes.filter(income => {
    const incomeDate = new Date(income.date);
    const monthMatch = incomeDate.getMonth() + 1 === parseInt(selectedMonth);
    const yearMatch = incomeDate.getFullYear() === parseInt(selectedYear);
    const sourceMatch = sourceFilter === 'all' || income.source === sourceFilter;
    return monthMatch && yearMatch && sourceMatch;
  });

  // Filter expenses and plans by month/year
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() + 1 === parseInt(selectedMonth) && 
           expenseDate.getFullYear() === parseInt(selectedYear);
  });

  const filteredPlans = savingPlans.filter(plan => 
    plan.month === parseInt(selectedMonth) && plan.year === parseInt(selectedYear)
  );

  // Calculate totals
  const monthlyIncome = filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
  const monthlyExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlySavings = monthlyIncome - monthlyExpenses;

  const yearlyIncomes = incomes.filter(i => new Date(i.date).getFullYear() === parseInt(selectedYear));
  const yearlyIncome = yearlyIncomes.reduce((sum, i) => sum + i.amount, 0);

  const computedPlanned = filteredPlans.reduce((sum, p) => sum + p.amount, 0);
  const effectivePlanned = plannedTotal || computedPlanned;
  const remainingSavings = monthlySavings - effectivePlanned;

  // Fetch saving plans for current user (we can fetch all and filter client-side)
  const fetchSavingPlans = async (m = selectedMonth, y = selectedYear) => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/plans/?token=${token}&month=${m}&year=${y}`);
      if (res.ok) {
        const data = await res.json();
        setSavingPlans(data);
      }
    } catch (err) {
      console.error('Failed to load saving plans', err);
    }
  };

  const fetchSavingPlanSummary = async (m = selectedMonth, y = selectedYear) => {
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/plans/summary?token=${token}&month=${m}&year=${y}`);
      if (res.ok) {
        const data = await res.json();
        setPlannedTotal(data.total_planned);
        setPlannedCount(data.count);
      } else {
        // Reset if summary fails
        setPlannedTotal(0);
        setPlannedCount(0);
      }
    } catch (err) {
      console.error('Failed to load saving plan summary', err);
      setPlannedTotal(0);
      setPlannedCount(0);
    }
  };

  useEffect(() => {
    fetchSavingPlans(selectedMonth, selectedYear);
    fetchSavingPlanSummary(selectedMonth, selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <NavHeader />
      <div style={{
        background: 'linear-gradient(135deg, #d8e9f3 0%, #f0f5f8 50%, #fdf8f1 100%)',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px 60px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

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
                Income (This Month)
              </h3>
              <p style={{ color: '#2f2b28', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                {formatMoney(monthlyIncome, currency)}
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
                Income (This Year)
              </h3>
              <p style={{ color: '#2f2b28', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                {formatMoney(yearlyIncome, currency)}
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
            
            {/* Add Income Form */}
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
                Record New Income
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
                  ✓ Income added successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Income Source */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#2f2b28',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Income Source *
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
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
                    <option value="">Select income source</option>
                    {sources.map((src) => (
                      <option key={src} value={src}>{src}</option>
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
                    Amount ($) *
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
                  Add Income
                </button>
              </form>
            </div>

            {/* Monthly Summary Panel */}
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
                Monthly Summary
              </h2>

              {/* Month/Year Selector */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '25px'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    color: '#6b6359',
                    fontSize: '0.8rem',
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
                      padding: '8px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
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

                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    color: '#6b6359',
                    fontSize: '0.8rem',
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
                      padding: '8px',
                      border: '2px solid #f6b7a0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
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
              </div>

              {/* Summary Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{
                  background: '#e8f5e9',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '2px solid #c8e6c9'
                }}>
                  <p style={{ color: '#6b6359', fontSize: '0.85rem', margin: '0 0 5px 0', fontWeight: '600' }}>
                    Total Income
                  </p>
                  <p style={{ color: '#2e7d32', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
                    {formatMoney(monthlyIncome, currency)}
                  </p>
                </div>

                <div style={{
                  background: '#ffebee',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '2px solid #ffcdd2'
                }}>
                  <p style={{ color: '#6b6359', fontSize: '0.85rem', margin: '0 0 5px 0', fontWeight: '600' }}>
                    Total Expenses
                  </p>
                  <p style={{ color: '#c62828', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
                    {formatMoney(monthlyExpenses, currency)}
                  </p>
                </div>

                <div style={{
                  background: monthlySavings >= 0 ? '#fff3e0' : '#ffebee',
                  padding: '18px',
                  borderRadius: '12px',
                  border: `2px solid ${monthlySavings >= 0 ? '#ffe0b2' : '#ffcdd2'}`
                }}>
                  <p style={{ color: '#6b6359', fontSize: '0.85rem', margin: '0 0 5px 0', fontWeight: '600' }}>
                    Savings This Month
                  </p>
                  <p style={{ 
                    color: monthlySavings >= 0 ? '#f6b7a0' : '#c62828', 
                    fontSize: '1.8rem', 
                    fontWeight: 'bold', 
                    margin: 0 
                  }}>
                    {formatMoney(monthlySavings, currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Saving Plans Section */}
          <div style={{
            background: '#fffbf0',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
            marginBottom: '40px'
          }}>
            <h2 style={{
              color: '#2f2b28',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Saving Plans
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '30px'
            }}>
              {/* Add Saving Plan Form */}
              <div>
                {planSubmitted && (
                  <div style={{
                    background: '#c8e6c9',
                    color: '#2e7d32',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    ✓ Saving plan added!
                  </div>
                )}

                <form onSubmit={handleSavingPlanSubmit}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      color: '#2f2b28',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Saving Category *
                    </label>
                    <select
                      value={savingPlanCategory}
                      onChange={(e) => setSavingPlanCategory(e.target.value)}
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
                      <option value="">Select category</option>
                      {savingCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      color: '#2f2b28',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Planned Amount ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={savingPlanAmount}
                      onChange={(e) => setSavingPlanAmount(e.target.value)}
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

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#DAA06D',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#c89052';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#DAA06D';
                    }}>
                    Add Plan
                  </button>
                </form>
              </div>

              {/* Saving Plans List & Summary */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    color: '#2f2b28',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    Plans for {new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  {filteredPlans.length > 0 && (
                    <button
                      onClick={() => {
                        setEditModeSavingPlans(!editModeSavingPlans);
                        setSelectedForDeletePlans(new Set());
                      }}
                      style={{
                        padding: '6px 16px',
                        background: editModeSavingPlans ? '#fbe2d9' : '#fff',
                        color: '#f6b7a0',
                        border: '2px solid #f6b7a0',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!editModeSavingPlans) e.currentTarget.style.background = '#fbe2d9';
                      }}
                      onMouseLeave={(e) => {
                        if (!editModeSavingPlans) e.currentTarget.style.background = '#fff';
                      }}>
                      {editModeSavingPlans ? 'Cancel' : 'Edit'}
                    </button>
                  )}
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map(plan => (
                      <div key={plan.id} style={{
                        background: '#fff',
                        padding: '12px 15px',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        borderLeft: '4px solid #f6b7a0',
                        border: selectedForDeletePlans.has(plan.id) ? '2px solid #f6b7a0' : 'none'
                      }}>
                        {editModeSavingPlans && (
                          <input
                            type="checkbox"
                            checked={selectedForDeletePlans.has(plan.id)}
                            onChange={() => toggleSelectPlan(plan.id)}
                            style={{
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              marginRight: '12px'
                            }}
                          />
                        )}
                        <p style={{ color: '#2f2b28', fontSize: '0.9rem', fontWeight: '600', margin: 0, flex: 1 }}>
                          {plan.category}
                        </p>
                        <p style={{ color: '#f6b7a0', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>
                          {formatMoney(plan.amount, currency)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#9b8f84', fontSize: '0.9rem', textAlign: 'center', margin: '20px 0' }}>
                      No saving plans for this month
                    </p>
                  )}
                </div>

                {editModeSavingPlans && selectedForDeletePlans.size > 0 && (
                  <button
                    onClick={() => handleDeletePlans(selectedForDeletePlans)}
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
                    Delete Selected ({selectedForDeletePlans.size})
                  </button>
                )}

                {/* Totals */}
                <div style={{
                  background: '#fff',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '2px solid #f6b7a0'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <p style={{ color: '#6b6359', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                      Total Planned:
                    </p>
                    <p style={{ color: '#2f2b28', fontSize: '0.9rem', fontWeight: 'bold', margin: 0 }}>
                      {formatMoney(effectivePlanned, currency)}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '2px solid #fbe2d9'
                  }}>
                    <p style={{ color: '#6b6359', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                      Remaining Savings:
                    </p>
                    <p style={{ 
                      color: remainingSavings >= 0 ? '#2e7d32' : '#c62828', 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold', 
                      margin: 0 
                    }}>
                      {formatMoney(remainingSavings, currency)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Income History Section */}
          <div style={{
            background: '#fffbf0',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                color: '#2f2b28',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Income History
              </h2>
              {filteredIncomes.length > 0 && (
                <button
                  onClick={() => {
                    setEditModeIncomeHistory(!editModeIncomeHistory);
                    setSelectedForDeleteIncomes(new Set());
                  }}
                  style={{
                    padding: '8px 18px',
                    background: editModeIncomeHistory ? '#fbe2d9' : '#fff',
                    color: '#2e7d32',
                    border: '2px solid #2e7d32',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!editModeIncomeHistory) e.currentTarget.style.background = '#e8f5e9';
                  }}
                  onMouseLeave={(e) => {
                    if (!editModeIncomeHistory) e.currentTarget.style.background = '#fff';
                  }}>
                  {editModeIncomeHistory ? 'Cancel' : 'Edit'}
                </button>
              )}
            </div>

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
                  Source
                </label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
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
                  <option value="all">All Sources</option>
                  {sources.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Income List */}
            <div>
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map(income => (
                  <div key={income.id} style={{
                    background: '#fff',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderLeft: '4px solid #2e7d32',
                    border: selectedForDeleteIncomes.has(income.id) ? '2px solid #2e7d32' : 'none'
                  }}>
                    {editModeIncomeHistory && (
                      <input
                        type="checkbox"
                        checked={selectedForDeleteIncomes.has(income.id)}
                        onChange={() => toggleSelectIncome(income.id)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          marginRight: '12px'
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#2f2b28', fontSize: '1rem', fontWeight: '600', margin: '0 0 5px 0' }}>
                        {income.source}
                      </p>
                      <p style={{ color: '#9b8f84', fontSize: '0.85rem', margin: '0 0 3px 0' }}>
                        {new Date(income.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      {income.notes && (
                        <p style={{ color: '#9b8f84', fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>
                          {income.notes}
                        </p>
                      )}
                    </div>
                    <p style={{
                      color: '#2e7d32',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      margin: 0
                    }}>
                      +{formatMoney(income.amount, currency)}
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
                    No income records found for the selected filters
                  </p>
                </div>
              )}
            </div>

            {editModeIncomeHistory && selectedForDeleteIncomes.size > 0 && (
              <button
                onClick={() => handleDeleteIncomes(selectedForDeleteIncomes)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#c62828',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#b71c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#c62828';
                }}>
                Delete Selected ({selectedForDeleteIncomes.size})
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(500px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: repeat(auto-fit, minmax(400px, 1fr))"] {
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

export default AddIncome;
