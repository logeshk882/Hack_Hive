from datetime import date
import sys
import os

# Add hack_scraper to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from hack_scraper.date_utils import parse_deadline_date, is_hackathon_closed

def run_tests():
    print("--- Running Python date_utils tests ---")
    ref_date = date(2026, 7, 20)  # July 20, 2026

    # Test 1: Future ISO date
    assert is_hackathon_closed("2026-12-31", ref_date) == False, "2026-12-31 should be active"

    # Test 2: Past ISO date
    assert is_hackathon_closed("2026-05-15", ref_date) == True, "2026-05-15 should be closed"

    # Test 3: Date range ending in future
    assert is_hackathon_closed("Jun 01 - Aug 15, 2026", ref_date) == False, "Range ending Aug 15, 2026 should be active"

    # Test 4: Date range ending in past
    assert is_hackathon_closed("May 01 - Jun 30, 2026", ref_date) == True, "Range ending Jun 30, 2026 should be closed"

    # Test 5: Explicitly ended / closed strings
    assert is_hackathon_closed("Registration Closed", ref_date) == True, "Closed string should be closed"
    assert is_hackathon_closed("Ended", ref_date) == True, "Ended string should be closed"

    # Test 6: Ordinals and text noise
    assert is_hackathon_closed("25th July 2026", ref_date) == False, "25th July 2026 should be active"
    assert is_hackathon_closed("Starts 10th May 2026", ref_date) == True, "Starts 10th May 2026 should be closed"

    print("[SUCCESS] All Python date_utils tests passed successfully!")

if __name__ == "__main__":
    run_tests()
