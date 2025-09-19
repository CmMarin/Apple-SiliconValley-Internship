#!/usr/bin/env python3
"""
Test script for the enhanced AI task extraction service.
This script allows testing the improved features without running the full server.
"""

import sys
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Import the enhanced modules
# Use these imports when running the actual test
from app.nlp.extractor import extract_tasks, normalize_date, is_greeting
from app.nlp.ai_service import model_service

# Alternative imports for standalone testing
# sys.path.append('app/nlp')
# from extractor import extract_tasks, normalize_date, is_greeting
# from ai_service import model_service

# Test inputs with expected behavior
TEST_CASES = [
    {
        "input": "Hello there!",
        "description": "Simple greeting (should detect as greeting and return no tasks)"
    },
    {
        "input": "Hi, how are you today?",
        "description": "Greeting question (should detect as greeting and return no tasks)"
    },
    {
        "input": "I need to buy milk tomorrow",
        "description": "Simple English task with 'tomorrow' date (should normalize tomorrow's date)"
    },
    {
        "input": "Call John on Friday at 3pm",
        "description": "Task with day of week and time (should normalize Friday to actual date)"
    },
    {
        "input": "Meeting with team next Monday",
        "description": "Task with 'next' day of week (should normalize to next Monday's date)"
    },
    {
        "input": "trebuie sa merg la piata maine dimineata",
        "description": "Romanian task with 'tomorrow morning' (should detect Romanian and normalize date)"
    },
    {
        "input": "plata facturi vineri",
        "description": "Romanian task with day of week (should normalize to Friday's date)"
    },
    {
        "input": "Hello! I need to finish my report by tomorrow and call John on Friday",
        "description": "Greeting with multiple tasks (should ignore greeting and extract tasks)"
    },
    {
        "input": "bună ziua, am întâlnire luni la ora 14:00",
        "description": "Romanian greeting with meeting task (should ignore greeting and extract task)"
    }
]

def display_date_normalization():
    """
    Test and display date normalization examples
    """
    print("\n=== DATE NORMALIZATION EXAMPLES ===")
    today = datetime.now().strftime("%Y-%m-%d")
    print(f"Today's date: {today}")
    
    date_examples = [
        "tomorrow", "mâine", "maine", "next monday", "next tuesday", 
        "vineri", "friday", "azi", "today", "next week"
    ]
    
    for example in date_examples:
        normalized = normalize_date(example)
        print(f"'{example}' -> '{normalized}'")

def test_greeting_detection():
    """
    Test the greeting detection function
    """
    print("\n=== GREETING DETECTION TEST ===")
    
    greeting_examples = [
        "Hello",
        "Hi there",
        "Good morning",
        "Hey, how are you?",
        "Salut",
        "Bună ziua",
        "Salutare",
        "Hey, can you help me with something?",
        "Hello, I need to buy milk tomorrow",
        "Buy milk tomorrow"  # Not a greeting
    ]
    
    for example in greeting_examples:
        is_greet = is_greeting(example)
        print(f"'{example}' -> {'Greeting' if is_greet else 'Not just a greeting'}")

def test_ai_service():
    """
    Test the AI model service with extraction and processing
    """
    print("\n=== AI SERVICE TEST ===")
    print("Model status:", model_service.get_status())
    
    if model_service._state != "ready":
        print("Starting model loading...")
        model_service.start_loading()
        print("Note: Full AI service might not be ready immediately. Testing fallback mechanism.")
    
    print("\nProcessing test cases with AI service:")
    for i, case in enumerate(TEST_CASES, 1):
        print(f"\n--- Test Case {i}: {case['description']} ---")
        print(f"Input: \"{case['input']}\"")
        
        # Use the AI service to process
        result = model_service.process_text(case['input'])
        
        # Display results
        print(f"Method used: {result['method']}")
        print(f"Tasks found: {len(result['tasks'])}")
        
        if result['tasks']:
            print("\nExtracted tasks:")
            for j, task in enumerate(result['tasks'], 1):
                print(f"Task {j}:")
                print(f"  Content: {task['task']}")
                print(f"  Category: {task['category'] or 'None'}")
                print(f"  Time: {task['time'] or 'None'}")
                print(f"  Deadline: {task['deadline'] or 'None'}")
        else:
            print("\nNo tasks extracted.")
        
        print("-" * 40)

def test_regex_fallback():
    """
    Test the regex fallback extraction directly
    """
    print("\n=== REGEX FALLBACK EXTRACTION TEST ===")
    
    for i, case in enumerate(TEST_CASES, 1):
        print(f"\n--- Test Case {i}: {case['description']} ---")
        print(f"Input: \"{case['input']}\"")
        
        # Use the direct regex extraction
        tasks = extract_tasks(case['input'])
        
        # Display results
        print(f"Tasks found: {len(tasks)}")
        
        if tasks:
            print("\nExtracted tasks:")
            for j, task in enumerate(tasks, 1):
                print(f"Task {j}:")
                print(f"  Content: {task['task']}")
                print(f"  Category: {task['category'] or 'None'}")
                print(f"  Time: {task['time'] or 'None'}")
                print(f"  Deadline: {task['deadline'] or 'None'}")
        else:
            print("\nNo tasks extracted.")
        
        print("-" * 40)

def main():
    """
    Run all tests
    """
    print("\n===== ENHANCED AI TASK EXTRACTION TESTER =====")
    print(f"Current date and time: {datetime.now()}")
    
    # Display normalized dates
    display_date_normalization()
    
    # Test greeting detection
    test_greeting_detection()
    
    # Test regex fallback extraction
    test_regex_fallback()
    
    # Test AI service if available
    test_ai_service()
    
    print("\n===== TEST COMPLETE =====")

if __name__ == "__main__":
    main()