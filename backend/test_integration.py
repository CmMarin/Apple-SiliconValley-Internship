#!/usr/bin/env python3
"""
Integration test for the enhanced AI service and extractor.
"""

import sys
import os
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def run_test():
    """
    Test the original and enhanced versions of the AI service and extractor.
    """
    try:
        logger.info("=== TESTING ENHANCED AI SERVICE AND EXTRACTOR ===")
        
        # Import the original modules
        from app.nlp.extractor import extract_tasks as original_extract_tasks
        logger.info("Successfully imported original extractor")
        
        # Import the enhanced modules
        sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
        from app.nlp.extractor_enhanced import extract_tasks, normalize_date, is_greeting
        logger.info("Successfully imported enhanced extractor")
        
        # Test greeting detection
        logger.info("\n=== Testing Greeting Detection ===")
        greeting_tests = [
            "Hello there",
            "Hi, how are you?",
            "Good morning!",
            "Salut, ce faci?",
            "Hello, I need to buy milk tomorrow",  # Not just a greeting
            "Salut! Trebuie sa merg la magazin maine"  # Not just a greeting
        ]
        
        for text in greeting_tests:
            result = is_greeting(text)
            logger.info(f"'{text}' -> {'Is greeting only' if result else 'Contains tasks'}")
        
        # Test date normalization
        logger.info("\n=== Testing Date Normalization ===")
        today = datetime.now()
        tomorrow = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        
        date_tests = [
            ("tomorrow", tomorrow),
            ("maine", tomorrow),
            ("mâine", tomorrow),
            ("next friday", "Next Friday"),
            ("vineri", "Friday")
        ]
        
        for date_text, expected in date_tests:
            normalized = normalize_date(date_text)
            logger.info(f"'{date_text}' -> '{normalized}'")
            
        # Test extraction functionality
        logger.info("\n=== Testing Task Extraction ===")
        
        extraction_tests = [
            "Hello there!",
            "I need to buy milk tomorrow",
            "Call John on Friday at 3pm",
            "Meeting with team next Monday",
            "trebuie sa merg la piata maine dimineata",
            "plata facturi vineri",
            "Hello! I need to finish my report by tomorrow and call John on Friday"
        ]
        
        for text in extraction_tests:
            logger.info(f"\nInput: '{text}'")
            
            # Extract using original extractor
            original_tasks = original_extract_tasks(text)
            logger.info(f"Original extractor found {len(original_tasks)} tasks")
            for i, task in enumerate(original_tasks):
                logger.info(f"  Task {i+1}: {task}")
            
            # Extract using enhanced extractor
            enhanced_tasks = extract_tasks(text)
            logger.info(f"Enhanced extractor found {len(enhanced_tasks)} tasks")
            for i, task in enumerate(enhanced_tasks):
                logger.info(f"  Task {i+1}: {task}")
        
        logger.info("\n=== TEST COMPLETE ===")
        logger.info("To integrate the enhanced versions, modify the imports in app/nlp/ai_service.py")
        
    except Exception as e:
        logger.error(f"Error during testing: {e}", exc_info=True)

if __name__ == "__main__":
    run_test()