import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(81.0);
  // const API_BASE_URL = 'http://localhost:8000'; (Moved to utils)

  // Load currency from backend on mount
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const token = localStorage.getItem('det-token');
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/settings/?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.currency) {
            setCurrency(data.currency);
          }
          if (data && data.usd_to_inr_rate) {
            setExchangeRate(data.usd_to_inr_rate);
          }
        }
      } catch (err) {
        console.warn('Failed to load currency setting', err);
      }
    };

    loadCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, setExchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
