"""Currency conversion utilities"""

def convert_amount(amount: float, from_currency: str, to_currency: str, rate: float = 83.0) -> float:
    """
    Convert amount between USD and INR.
    
    Args:
        amount: The amount to convert
        from_currency: Source currency ("USD" or "INR")
        to_currency: Target currency ("USD" or "INR")
        rate: USD to INR conversion rate (default 83.0)
    
    Returns:
        Converted amount
    """
    if from_currency == to_currency:
        return amount
    
    if from_currency == "USD" and to_currency == "INR":
        return amount * rate
    elif from_currency == "INR" and to_currency == "USD":
        return amount / rate
    
    # If neither USD nor INR, return original
    return amount

def get_currency_symbol(currency: str) -> str:
    """Get currency symbol for display"""
    if currency == "INR":
        return "₹"
    return "$"
