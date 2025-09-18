# This file contains the prompt templates for task extraction.

## Extraction Prompt Template

### Input:
"Trebuie să duc copiii la școală la 8 dimineața și după asta să cumpăr fructe și să plătesc factura la lumină."

### Expected Output:
```json
[
  {"task": "Drop kids at school", "time": "08:00 AM", "category": "Family"},
  {"task": "Buy fruits", "category": "Shopping"},
  {"task": "Pay electricity bill", "category": "Utilities"}
]
```

### Instructions:
1. Identify tasks from the input text.
2. Extract relevant time, category, and deadlines if mentioned.
3. Format the output as a structured JSON array of task objects.