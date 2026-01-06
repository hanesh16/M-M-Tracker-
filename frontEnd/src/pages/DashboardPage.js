import React, { useState, useEffect, useCallback } from 'react';
import NavHeader from '../components/NavHeader';
import Footer2 from '../components/footer2';

const API_BASE_URL = 'http://localhost:8000';

const DashboardPage = () => {
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('det-token');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [expenseIdOrder, setExpenseIdOrder] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  
  // Modal states
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  
  // Expense form states
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [expenseSubmitted, setExpenseSubmitted] = useState(false);
  
  // Income form states
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeNotes, setIncomeNotes] = useState('');
  const [incomeSubmitted, setIncomeSubmitted] = useState(false);
  
  const expenseCategories = [
    'Groceries',
    'Transport',
    'Entertainment',
    'Coffee',
    'Dinner',
    'Utilities',
    'Shopping',
    'Health',
    'Education',
    'Other'
  ];
  
  const incomeSources = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Bonus',
    'Gift',
    'Refund',
    'Other'
  ];

  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/recent-activity?token=${token}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setRecentExpenses(data);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  }, [token]);

  // Filter expenses
  const filteredExpenses = recentExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.getMonth() + 1;
    const expenseYear = expenseDate.getFullYear();

    if (selectedDay && selectedMonth && selectedYear) {
      return (
        expenseDate.getDate() === parseInt(selectedDay) &&
        expenseMonth === parseInt(selectedMonth) &&
        expenseYear === parseInt(selectedYear)
      );
    } else if (selectedMonth && selectedYear) {
      return expenseMonth === parseInt(selectedMonth) && expenseYear === parseInt(selectedYear);
    }
    return true;
  });

  // Always show most recent dates first (newest to oldest)
  const sortedFilteredExpenses = [...filteredExpenses].sort((a, b) => {
    const diff = new Date(b.date) - new Date(a.date);
    if (diff !== 0) return diff;
    return b.id - a.id; // stable tie-breaker
  });

  // Handle expense form submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (expenseCategory && expenseAmount && expenseDate) {
      try {
        const response = await fetch(`${API_BASE_URL}/expenses/?token=${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            category: expenseCategory,
            amount: parseFloat(expenseAmount),
            expense_date: expenseDate,
            notes: expenseNotes,
            expense_type: 'additional'
          })
        });

        if (response.ok) {
          // Refresh expenses
          fetchRecentActivity();
          setExpenseSubmitted(true);
          setTimeout(() => {
            setExpenseCategory('');
            setExpenseAmount('');
            setExpenseDate('');
            setExpenseNotes('');
            setExpenseSubmitted(false);
            setShowExpenseModal(false);
          }, 2000);
        }
      } catch (err) {
        console.error('Error submitting expense:', err);
      }
    }
  };

  // Handle income form submission
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    if (incomeSource && incomeAmount && incomeDate) {
      try {
        const response = await fetch(`${API_BASE_URL}/incomes/?token=${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: incomeSource,
            amount: parseFloat(incomeAmount),
            income_date: incomeDate,
            notes: incomeNotes
          })
        });

        if (response.ok) {
          // Refresh incomes
          fetchRecentActivity();
          setIncomeSubmitted(true);
          setTimeout(() => {
            setIncomeAmount('');
            setIncomeDate('');
            setIncomeNotes('');
            setIncomeSubmitted(false);
            setShowIncomeModal(false);
          }, 2000);
        }
      } catch (err) {
        console.error('Error submitting income:', err);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me?token=${token}`);
        if (response.ok) {
          const user = await response.json();
          setUserName(user.name || 'User');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    if (token) {
      fetchUserData();
      fetchRecentActivity();
      setLoading(false);
    }
  }, [token, fetchRecentActivity]);

  // Reload recent activity when filters change
  useEffect(() => {
    if (token && !loading) {
      fetchRecentActivity();
    }
  }, [selectedMonth, selectedYear, token, loading, fetchRecentActivity]);

  // Initialize expense order
  useEffect(() => {
    if (sortedFilteredExpenses.length > 0) {
      setExpenseIdOrder(sortedFilteredExpenses.map(exp => exp.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentExpenses.length, selectedDay, selectedMonth, selectedYear]);

  // Shuffle animation loop - runs independently
  useEffect(() => {
    if (!isHovering && expenseIdOrder.length > 0) {
      // Generate shuffle sequences based on number of expenses
      const sequences = 
        expenseIdOrder.length === 3
          ? [
              [expenseIdOrder[0], expenseIdOrder[1], expenseIdOrder[2]],
              [expenseIdOrder[2], expenseIdOrder[1], expenseIdOrder[0]],
              [expenseIdOrder[1], expenseIdOrder[2], expenseIdOrder[0]],
              [expenseIdOrder[0], expenseIdOrder[2], expenseIdOrder[1]]
            ]
          : Array.from({ length: expenseIdOrder.length }, (_, i) => {
              const rotated = [...expenseIdOrder];
              for (let j = 0; j < i; j++) {
                rotated.unshift(rotated.pop());
              }
              return rotated;
            });

      let seqIdx = 0;
      const interval = setInterval(() => {
        seqIdx = (seqIdx + 1) % sequences.length;
        setExpenseIdOrder(sequences[seqIdx]);
      }, 1000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  // Return to original order on hover
  useEffect(() => {
    if (isHovering && filteredExpenses.length > 0) {
      const originalOrder = filteredExpenses.map(exp => exp.id);
      setExpenseIdOrder(originalOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  const filteredTotalExpenses = filteredExpenses.filter(e => e.type === 'expense').reduce((sum, expense) => sum + expense.amount, 0);
  const filteredTotalIncome = 2400 + filteredExpenses.filter(e => e.type === 'income').reduce((sum, income) => sum + income.amount, 0);
  const filteredTotalSavings = filteredTotalIncome - filteredTotalExpenses;

  const summaryCards = [
    { title: 'Total Income', value: filteredTotalIncome, note: 'This month', color: '#DAA06D' },
    { title: 'Total Expenses', value: filteredTotalExpenses, note: 'This month', color: '#DAA06D' },
    { title: 'Total Savings', value: filteredTotalSavings, note: 'Leftover', color: '#f6b7a0' }
  ];

  return (
    <>
      <NavHeader />
      <div style={{
        background: 'linear-gradient(135deg, #d8e9f3 0%, #f0f5f8 50%, #fdf8f1 100%)',
        minHeight: 'calc(100vh - 220px)',
        padding: '40px 20px'
      }}>
        <div className="container" style={{ maxWidth: '1000px', position: 'relative' }}>
          
          {/* Welcome Text Section - Top Left */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '0px',
            zIndex: 1,
            width: '35%'
          }}>
            <h1 style={{
              color: '#2f2b28',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 0 5px 0'
            }}>
              Welcome!
            </h1>
            <h2 style={{
              color: '#2f2b28',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0',
              marginLeft: '5.5rem'
            }}>
              {userName}
            </h2>
          </div>

          {/* Image Section - Right Side Below LogOut */}
          <div style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '50%',
            height: '520px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5
          }}>
            <img 
              src={require('../images/pic16.png')} 
              alt="M&M Tracker" 
              style={{
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }} 
            />
          </div>

          {/* Spacer for absolute positioned elements */}
          <div style={{
            height: '520px'
          }}></div>

          {/* Summary Cards Section */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '50px'
            }}
          >
            {summaryCards.map((card, index) => (
                <div 
                  key={index}
                  style={{
                    background: '#fffbf0',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                  }}>
                  <h3 style={{
                    color: card.color,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    margin: '0 0 15px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    color: '#2f2b28',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    margin: '0',
                    marginBottom: '5px'
                  }}>
                    ${card.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p style={{
                    color: '#9b8f84',
                    fontSize: '0.85rem',
                    margin: '0'
                  }}>
                    {card.note}
                  </p>
                </div>
              ))}
          </div>

          {/* Recent Activity Section */}
          <div style={{ marginBottom: '50px' }}>
            {/* Header with Date Filters on Right */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '25px',
              gap: '20px'
            }}>
              <h2 style={{
                color: '#2f2b28',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0'
              }}>
                Recent Activity
              </h2>

              {/* Compact Date Filter Controls */}
              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end'
              }}>
                {/* Day Input */}
                <div>
                  <label style={{
                    color: '#6b6359',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px'
                  }}>
                    Day
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="31" 
                    placeholder="1-31"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    style={{
                      width: '60px',
                      padding: '6px 8px',
                      border: '1.5px solid #f6b7a0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#2f2b28',
                      background: '#fffbf0',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#DAA06D';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#f6b7a0';
                    }}
                  />
                </div>

                {/* Month Input */}
                <div>
                  <label style={{
                    color: '#6b6359',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px'
                  }}>
                    Month
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="12" 
                    placeholder="1-12"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value) || '')}
                    style={{
                      width: '60px',
                      padding: '6px 8px',
                      border: '1.5px solid #f6b7a0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#2f2b28',
                      background: '#fffbf0',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#DAA06D';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#f6b7a0';
                    }}
                  />
                </div>

                {/* Year Input */}
                <div>
                  <label style={{
                    color: '#6b6359',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px'
                  }}>
                    Year
                  </label>
                  <input 
                    type="number" 
                    min="2020" 
                    placeholder="2026"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value) || '')}
                    style={{
                      width: '70px',
                      padding: '6px 8px',
                      border: '1.5px solid #f6b7a0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      color: '#2f2b28',
                      background: '#fffbf0',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#DAA06D';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#f6b7a0';
                    }}
                  />
                </div>

                {/* Reset Button */}
                <button 
                  onClick={() => {
                    setSelectedDay('');
                    setSelectedMonth('');
                    setSelectedYear('');
                  }}
                  style={{
                    background: '#f6b7a0',
                    color: '#fff1e0',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(246, 183, 160, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#DAA06D';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f6b7a0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                  ↻
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              position: 'relative',
              minHeight: expenseIdOrder.length * 80 + (expenseIdOrder.length - 1) * 12
            }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {filteredExpenses.length > 0 ? (
                expenseIdOrder.map((expenseId, displayIndex) => {
                  const expense = sortedFilteredExpenses.find(e => e.id === expenseId);
                  if (!expense) return null;
                  
                  // Get color based on original index in filtered list
                  const originalIndex = sortedFilteredExpenses.findIndex(e => e.id === expenseId);
                  const softColors = ['#ffeaa7', '#b3e5fc', '#c8e6c9', '#ffccbc', '#d1c4e9', '#fff8dc'];
                  const boxColor = softColors[originalIndex % softColors.length];
                  
                  // Calculate position
                  const cardHeight = 80;
                  const gapSize = 12;
                  const yPos = displayIndex * (cardHeight + gapSize);
                  
                  return (
                    <div 
                      key={expense.id}
                      style={{
                        background: boxColor,
                        borderRadius: '15px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        willChange: 'transform',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${yPos}px)`,
                        height: '80px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            color: '#2f2b28',
                            fontSize: '1rem',
                            fontWeight: '600',
                            margin: '0 0 5px 0'
                          }}>
                            {expense.category}
                          </p>
                          <p style={{
                            color: '#9b8f84',
                            fontSize: '0.85rem',
                            margin: '0'
                          }}>
                            {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <p style={{
                            color: expense.type === 'income' ? '#2e7d32' : '#DAA06D',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            margin: '0'
                          }}>
                            {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                          </p>
                          {expense.type === 'income' && (
                            <img 
                              src={require('../images/pic17.png')} 
                              alt="income" 
                              style={{
                                height: '45px',
                                width: 'auto',
                                objectFit: 'contain'
                              }} 
                            />
                          )}
                          {expense.type === 'expense' && expense.amount < 25 && (
                            <img 
                              src={require('../images/pic18.png')} 
                              alt="low expense" 
                              style={{
                                height: '45px',
                                width: 'auto',
                                objectFit: 'contain'
                              }} 
                            />
                          )}
                          {expense.type === 'expense' && expense.amount >= 25 && expense.amount < 35 && (
                            <img 
                              src={require('../images/pic19.png')} 
                              alt="high expense" 
                              style={{
                                height: '45px',
                                width: 'auto',
                                objectFit: 'contain'
                              }} 
                            />
                          )}
                          {expense.type === 'expense' && expense.amount >= 35 && (
                            <img 
                              src={require('../images/pic20.png')} 
                              alt="very high expense" 
                              style={{
                                height: '60px',
                                width: 'auto',
                                objectFit: 'contain'
                              }} 
                            />
                          )}
                        </div>
                      </div>
                    );
                })
              ) : (
                <div style={{
                  background: '#fbf4f3',
                  borderRadius: '15px',
                  padding: '40px 20px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: '#9b8f84',
                    fontSize: '1rem',
                    margin: '0'
                  }}>
                    No expenses found for the selected date range
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Knowledge Section */}
          <div 
            style={{
              background: '#fbf4f3',
              borderRadius: '20px',
              padding: '35px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}>
            <h2 style={{
              color: '#2f2b28',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: '0 0 15px 0',
              textAlign: 'center'
            }}>
              Quick Knowledge
            </h2>
            <p style={{
              color: '#9b8f84',
              fontSize: '0.95rem',
              margin: '0 0 25px 0',
              textAlign: 'center'
            }}>
              Learn how Mocha and Milky manage money their own way
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div 
                style={{
                  background: '#f0d9c4',
                  color: '#2f2b28',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 6px 20px rgba(218, 160, 109, 0.5)',
                  flex: 1,
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(218, 160, 109, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(218, 160, 109, 0.5)';
                }}>
                <p style={{ margin: '0', fontSize: '1.3rem', fontWeight: 'bold', alignSelf: 'center' }}>Mocha Tracks Expenses</p>
                <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: '400', color: '#6b6359', textAlign: 'center', width: '100%' }}>
                  Mocha carefully notes every expense so nothing goes unnoticed. Tracking spending helps him stay disciplined and prepared for future bills.
                </p>
              </div>
              <div 
                style={{
                  background: '#fbe2d9',
                  color: '#2f2b28',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'default',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 6px 20px rgba(246, 183, 160, 0.5)',
                  flex: 1,
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(246, 183, 160, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(246, 183, 160, 0.5)';
                }}>
                <p style={{ margin: '0', fontSize: '1.3rem', fontWeight: 'bold', alignSelf: 'center' }}>Milky Adds Income</p>
                <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: '400', color: '#6b6359', textAlign: 'center', width: '100%' }}>
                  Milky happily records income because it means more freedom to enjoy life, plan trips, and treat herself without worry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer2 />
      
      {/* Expense Modal */}
      {showExpenseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowExpenseModal(false)}>
          <div style={{
            background: '#f0d9c4',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{
                color: '#2f2b28',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: '0'
              }}>
                Add Expense
              </h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#2f2b28'
                }}>
                ×
              </button>
            </div>
            
            {expenseSubmitted && (
              <div style={{
                background: '#c8e6c9',
                color: '#2e7d32',
                padding: '12px 15px',
                borderRadius: '10px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                ✓ Expense added successfully!
              </div>
            )}
            
            <form onSubmit={handleExpenseSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Category */}
              <div>
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
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #DAA06D',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#2f2b28',
                    background: '#fff',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}>
                  <option value="">Select a category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2f2b28',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Amount (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #DAA06D',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#2f2b28',
                    background: '#fff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Date */}
              <div>
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
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #DAA06D',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#2f2b28',
                    background: '#fff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Notes */}
              <div>
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
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Add notes..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #DAA06D',
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
        </div>
      )}

      {/* Income Modal */}
      {showIncomeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowIncomeModal(false)}>
          <div style={{
            background: '#fbe2d9',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{
                color: '#2f2b28',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: '0'
              }}>
                Add Income
              </h2>
              <button
                onClick={() => setShowIncomeModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#2f2b28'
                }}>
                ×
              </button>
            </div>
            
            {incomeSubmitted && (
              <div style={{
                background: '#c8e6c9',
                color: '#2e7d32',
                padding: '12px 15px',
                borderRadius: '10px',
                marginBottom: '20px',
                textAlign: 'center',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}>
                ✓ Income added successfully!
              </div>
            )}
            
            <form onSubmit={handleIncomeSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Source */}
              <div>
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
                  value={incomeSource}
                  onChange={(e) => setIncomeSource(e.target.value)}
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
                  {incomeSources.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#2f2b28',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  Amount (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="Enter amount"
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
              <div>
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
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
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
              <div>
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
                  value={incomeNotes}
                  onChange={(e) => setIncomeNotes(e.target.value)}
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

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#f6b7a0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f09876';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f6b7a0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                Add Income
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .container {
            max-width: 100% !important;
            padding: 0 15px !important;
          }
          
          /* Hide absolute positioned hero section on mobile */
          .container > div:nth-child(1),
          .container > div:nth-child(2),
          .container > div:nth-child(3) {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
          }
          
          /* Welcome text center on mobile */
          .container > div:nth-child(1) {
            text-align: center;
            margin-bottom: 20px;
          }
          
          .container > div:nth-child(1) h1 {
            font-size: 2rem !important;
          }
          
          .container > div:nth-child(1) h2 {
            font-size: 1.5rem !important;
            margin-left: 0 !important;
          }
          
          /* Image section smaller on mobile */
          .container > div:nth-child(2) {
            height: 250px !important;
            margin-bottom: 30px;
          }
          
          .container > div:nth-child(2) img {
            max-height: 200px !important;
          }
          
          /* Hide spacer on mobile */
          .container > div:nth-child(3) {
            display: none !important;
          }
          
          /* Stack summary cards */
          .container > div:nth-child(4) {
            grid-template-columns: 1fr !important;
          }
          
          /* Stack date filters vertically */
          .container > div:nth-child(5) > div:first-child {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          
          .container > div:nth-child(5) > div:first-child > div:last-child {
            width: 100%;
            margin-top: 15px;
          }
          
          /* Quick Knowledge boxes full width */
          .container > div:nth-child(6) > div:last-child > div {
            flex-direction: column !important;
          }
          
          .container > div:nth-child(6) > div:last-child > div > div {
            width: 100% !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .container {
            max-width: 90% !important;
          }
          
          .container > div:nth-child(1) {
            width: 40% !important;
          }
          
          .container > div:nth-child(1) h1 {
            font-size: 2.2rem !important;
          }
          
          .container > div:nth-child(1) h2 {
            font-size: 1.8rem !important;
          }
          
          .container > div:nth-child(2) {
            height: 400px !important;
          }
          
          .container > div:nth-child(3) {
            height: 400px !important;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardPage;
