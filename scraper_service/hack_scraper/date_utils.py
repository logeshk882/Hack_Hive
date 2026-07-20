import re
from datetime import datetime, date

MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
MONTH_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

def parse_deadline_date(deadline_str):
    """
    Parses various deadline string formats into a datetime.date object.
    
    Supports:
    - "2026-12-31" (ISO)
    - "Jul 15, 2026" / "15 Aug 2026"
    - "Mar 10 - 11, 2026" (Range with implicit month on right side)
    - "Jun 01 - Jul 15, 2026" (Extracts end date)
    - "Aug 10, 2026 @ 5:00pm EDT"
    - "21st Jul 2026" / "Starts 20 Jul 2026"
    """
    if not deadline_str or not isinstance(deadline_str, str):
        return None

    s = deadline_str.strip()
    if not s:
        return None

    lower = s.lower()
    if any(k in lower for k in ["ended", "closed", "finished"]):
        return None

    # Handle range (e.g. "Mar 10 - 11, 2026" or "Jun 01 - Jul 15, 2026")
    if " - " in s or ("-" in s and not re.match(r"^\d{4}-\d{2}-\d{2}$", s)):
        parts = re.split(r" - |\bto\b", s, flags=re.IGNORECASE)
        left_part = parts[0].strip()
        right_part = parts[-1].strip()

        right_lower = right_part.lower()
        has_month = any(m in right_lower for m in MONTH_SHORT)

        if not has_month:
            match = re.search(r"([a-zA-Z]{3,9})", left_part)
            if match:
                right_part = f"{match.group(1)} {right_part}"
        s = right_part

    # Clean up noise
    s = re.sub(r"@.*$", "", s).strip()
    s = re.sub(r"^starts\s+", "", s, flags=re.IGNORECASE).strip()
    s = re.sub(r"(\d+)(st|nd|rd|th)", r"\1", s, flags=re.IGNORECASE).strip()

    # Try dateutil if installed
    try:
        from dateutil import parser
        parsed_dt = parser.parse(s, fuzzy=True)
        return parsed_dt.date()
    except Exception:
        pass

    # Standard strptime fallback formats
    formats = [
        "%Y-%m-%d",
        "%b %d, %Y",
        "%B %d, %Y",
        "%d %b %Y",
        "%d %B %Y",
        "%b %d %Y",
        "%B %d %Y",
        "%Y/%m/%d",
        "%m/%d/%Y",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue

    # Try appending current year if year missing (e.g., "Jul 15")
    current_year = date.today().year
    s_with_year = f"{s}, {current_year}"
    for fmt in ["%b %d, %Y", "%B %d, %Y", "%d %b, %Y", "%d %B, %Y"]:
        try:
            return datetime.strptime(s_with_year, fmt).date()
        except ValueError:
            continue

    return None

def is_title_or_text_from_past(text, reference_date=None):
    """
    Checks if text (e.g., title) contains a year or month/year before reference_date.
    """
    if not text or not isinstance(text, str):
        return False

    if reference_date is None:
        reference_date = date.today()

    current_year = reference_date.year

    # Check 4-digit years or 2K years e.g. 2012, 2013, 2K12
    year_match = re.search(r"\b(20[0-9]{2}|2K[0-9]{2})\b", text, flags=re.IGNORECASE)
    if year_match:
        y_str = year_match.group(1).replace("2K", "20").replace("2k", "20")
        try:
            y = int(y_str)
            if y < current_year:
                return True
        except ValueError:
            pass

    # Check month + year e.g. "March 2026", "Feb 2026"
    month_year_match = re.search(
        r"\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*(\d{1,2})?,?\s*(20[0-9]{2})\b",
        text,
        flags=re.IGNORECASE
    )
    if month_year_match:
        month_str = month_year_match.group(1).lower()
        day = int(month_year_match.group(2)) if month_year_match.group(2) else 28
        year = int(month_year_match.group(3))

        month_idx = -1
        for idx, m in enumerate(MONTHS):
            if m.startswith(month_str):
                month_idx = idx + 1
                break
        if month_idx == -1:
            for idx, m in enumerate(MONTH_SHORT):
                if m == month_str[:3]:
                    month_idx = idx + 1
                    break

        if month_idx != -1:
            try:
                dt = date(year, month_idx, day)
                if dt < reference_date:
                    return True
            except ValueError:
                pass

    return False

def is_hackathon_closed(deadline_str, title_str="", reference_date=None):
    """
    Checks if a hackathon's deadline or title indicates it is closed/expired compared to reference_date.
    """
    if reference_date is None:
        reference_date = date.today()

    if is_title_or_text_from_past(title_str, reference_date):
        return True

    if not deadline_str or not isinstance(deadline_str, str):
        return False

    lower = deadline_str.strip().lower()
    if any(k in lower for k in ["ended", "closed", "finished"]):
        return True

    if is_title_or_text_from_past(deadline_str, reference_date):
        return True

    deadline_dt = parse_deadline_date(deadline_str)
    if not deadline_dt:
        return False

    return deadline_dt < reference_date
