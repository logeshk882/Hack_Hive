/**
 * Utility functions for parsing hackathon deadlines and checking if registration/hackathon is closed or finished.
 */

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MONTH_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Parses various deadline string formats into a JavaScript Date object.
 * Handles formats like:
 * - "2026-12-31" (ISO)
 * - "Jul 15, 2026" / "15 Aug 2026"
 * - "Mar 10 - 11, 2026" (Range with implicit month on right side)
 * - "Jun 01 - Jul 15, 2026" (Range with explicit month on right side)
 * - "Aug 10, 2026 @ 5:00pm EDT"
 * - "21st Jul 2026" / "Starts 20 Jul 2026"
 * 
 * @param {string} deadlineStr - Raw deadline string
 * @returns {Date|null} - Valid Date object or null
 */
function parseDeadlineDate(deadlineStr) {
  if (!deadlineStr || typeof deadlineStr !== 'string') return null;

  let str = deadlineStr.trim();
  if (!str) return null;

  const lower = str.toLowerCase();
  if (lower.includes('ended') || lower.includes('closed') || lower.includes('finished')) {
    return null;
  }

  // Handle date ranges e.g. "Mar 10 - 11, 2026" or "Jun 01 - Jul 15, 2026"
  if (str.includes(' - ') || (str.includes('-') && !/^\d{4}-\d{2}-\d{2}$/.test(str))) {
    const parts = str.split(/-|\bto\b/i);
    const leftPart = parts[0].trim();
    let rightPart = parts[parts.length - 1].trim();

    // Check if rightPart has a month
    const rightLower = rightPart.toLowerCase();
    const hasMonth = MONTH_SHORT.some(m => rightLower.includes(m));

    if (!hasMonth) {
      // Find month from leftPart
      const match = leftPart.match(/([a-zA-Z]{3,9})/);
      if (match) {
        rightPart = match[1] + ' ' + rightPart;
      }
    }
    str = rightPart;
  }

  // Clean up noise
  str = str.replace(/@.*$/, '').trim();
  str = str.replace(/^starts\s+/i, '').trim();
  str = str.replace(/(\d+)(st|nd|rd|th)/gi, '$1');

  // Direct Date parse attempt
  let parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  // Try appending current year if year missing (e.g. "Jul 15" -> "Jul 15, 2026")
  const currentYear = new Date().getFullYear();
  parsedDate = new Date(`${str}, ${currentYear}`);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return null;
}

/**
 * Checks if a title or text explicitly specifies a past date/year (e.g. "Tangelo Town 2013", "March 2026" when reference is July 2026).
 * 
 * @param {string} text - Title or raw text
 * @param {Date} referenceDate - Current reference date
 * @returns {boolean} - true if text refers to a past date/year
 */
function isTitleOrTextFromPast(text, referenceDate) {
  if (!text || typeof text !== 'string') return false;

  const currentYear = referenceDate.getFullYear();

  // Match 4-digit years e.g. 2012, 2013, 2024, 2025
  const yearMatch = text.match(/\b(20[0-9]{2}|2K[0-9]{2})\b/i);
  if (yearMatch) {
    const year = parseInt(yearMatch[1].replace(/2K/i, '20'));
    if (year < currentYear) {
      return true;
    }
  }

  // Match month + year in text e.g. "March 2026", "Feb 2026"
  const monthYearMatch = text.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s*(\d{1,2})?,?\s*(20[0-9]{2})\b/i);
  if (monthYearMatch) {
    const monthStr = monthYearMatch[1].toLowerCase();
    const day = monthYearMatch[2] ? parseInt(monthYearMatch[2]) : 28;
    const year = parseInt(monthYearMatch[3]);

    let monthIdx = MONTHS.findIndex(m => m.startsWith(monthStr));
    if (monthIdx === -1) monthIdx = MONTH_SHORT.findIndex(m => m === monthStr.slice(0, 3));

    if (monthIdx !== -1) {
      const dt = new Date(year, monthIdx, day, 23, 59, 59);
      if (dt.getTime() < referenceDate.getTime()) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Determines whether a hackathon is closed or finished based on its deadline string, title, and reference date.
 * 
 * @param {string} deadlineStr - The deadline string
 * @param {string} [titleStr] - Optional title of the hackathon
 * @param {Date} [referenceDate] - Optional date to compare against (defaults to now)
 * @returns {boolean} - true if the deadline or title indicates it is closed/expired
 */
function isHackathonClosed(deadlineStr, titleStr = '', referenceDate = new Date()) {
  const refStartOfDay = new Date(referenceDate);
  refStartOfDay.setHours(0, 0, 0, 0);

  // Check title for past years/months
  if (isTitleOrTextFromPast(titleStr, refStartOfDay)) {
    return true;
  }

  if (!deadlineStr || typeof deadlineStr !== 'string') return false;

  const lower = deadlineStr.trim().toLowerCase();
  if (lower.includes('ended') || lower.includes('closed') || lower.includes('finished')) {
    return true;
  }

  // Check deadlineStr for past years/months
  if (isTitleOrTextFromPast(deadlineStr, refStartOfDay)) {
    return true;
  }

  const deadlineDate = parseDeadlineDate(deadlineStr);
  if (!deadlineDate) return false;

  // Set deadline date to end of day if no time component was provided (23:59:59)
  const deadlineEndOfDay = new Date(deadlineDate);
  if (deadlineEndOfDay.getHours() === 0 && deadlineEndOfDay.getMinutes() === 0) {
    deadlineEndOfDay.setHours(23, 59, 59, 999);
  }

  return deadlineEndOfDay.getTime() < refStartOfDay.getTime();
}

module.exports = {
  parseDeadlineDate,
  isTitleOrTextFromPast,
  isHackathonClosed,
};
