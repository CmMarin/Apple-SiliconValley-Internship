#!/usr/bin/env python3
"""
Simple script to test the enhanced task extraction capabilities.
This version doesn't require the transformers library.
"""

import sys
import os
from datetime import datetime
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def test_extractor():
    """Test the extractor module with various inputs."""
    from app.nlp.extractor import extract_tasks, is_greeting, normalize_date
    
    print("\n=== TESTING ENHANCED EXTRACTOR ===")
    print(f"Current date: {datetime.now().strftime('%Y-%m-%d')}")
    
    # Test greeting detection first
    test_texts = [
        "Hello there",
        "Hi, how are you doing?",
        "Good morning!",
        "Salut, ce mai faci?",
        "Hello! I need to buy milk tomorrow",
        "Salut! Trebuie sa merg la magazin maine"
    ]
    
    print("\n--- Testing Greeting Detection ---")
    for text in test_texts:
        result = is_greeting(text)
        print(f"'{text}' -> {'Is greeting only' if result else 'Contains tasks'}")
    
    # Test date normalization
    print("\n--- Testing Date Normalization ---")
    date_texts = [
        "tomorrow",
        "maine", 
        "mâine",
        "today", 
        "azi",
        "next friday",
        "vineri",
        "monday",
        "luni"
    ]
    
    for text in date_texts:
        norm_date = normalize_date(text)
        print(f"'{text}' -> '{norm_date}'")
    
    # Test task extraction directly
    print("\n--- Testing Task Extraction ---")
    test_inputs = [
        "Hello there",
        "I need to buy milk tomorrow",
        "Meeting with John on Friday at 3pm",
        "trebuie sa merg la doctor maine dimineata",
        "Hello! Can you remind me to call mom tomorrow and submit the report by Friday?"
    ]
    
    for text in test_inputs:
        print(f"\nInput: '{text}'")
        tasks = extract_tasks(text)
        print(f"Tasks found: {len(tasks)}")
        
        if tasks:
            for i, task in enumerate(tasks):
                print(f"  Task {i+1}:")
                print(f"    Content: {task['task']}")
                print(f"    Category: {task['category'] or 'None'}")
                print(f"    Time: {task['time'] or 'None'}")
                print(f"    Deadline: {task['deadline'] or 'None'}")
        else:
            print("No tasks found.")
        
        print("-" * 40)

if __name__ == "__main__":
    # Make sure we're in the backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    if not os.path.basename(backend_dir) == "backend":
        os.chdir(os.path.join(backend_dir, "backend"))
    
    try:
        test_extractor()
    except Exception as e:
        logging.error(f"Error during testing: {e}", exc_info=True)