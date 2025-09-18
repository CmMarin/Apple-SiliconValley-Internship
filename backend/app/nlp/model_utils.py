from __future__ import annotations

import json
import re
from typing import Any, Dict, List

from transformers import pipeline

_gen = None


def _get_generator():
	global _gen
	if _gen is None:
		# Small, CPU-friendly model; adjust if you have GPU
		# flan-t5-small handles instruction-style prompts reasonably
		_gen = pipeline(
			"text2text-generation",
			model="google/flan-t5-small",
			tokenizer="google/flan-t5-small",
			device=-1,
		)
	return _gen


def _build_prompt(text: str) -> str:
	return (
		"You are an expert task extraction engine. Read the INPUT and produce a JSON array of tasks.\n"
		"Rules:\n"
		"- Language may be Romanian or English.\n"
		"- Output ONLY valid JSON (no markdown, no explanation).\n"
		"- Each item has keys exactly: task, time, category, deadline.\n"
		"- Use null for unknown fields.\n"
		"- Ignore greetings, filler, random characters, or single letters.\n"
		"- Do not split words into letters.\n"
		"- If there are no tasks, return [].\n\n"
		f"INPUT: {text}\n\n"
		"JSON:"
	)


def _extract_json(s: str) -> Any:
	# Try to find the first JSON array in the text
	match = re.search(r"(\[.*\])", s, re.DOTALL)
	if not match:
		raise ValueError("No JSON array found in model output")
	payload = match.group(1)
	return json.loads(payload)


def parse_with_transformer(text: str) -> List[Dict[str, Any]]:
	gen = _get_generator()
	prompt = _build_prompt(text)
	out = gen(prompt, max_new_tokens=256, temperature=0.1, do_sample=False)
	content = out[0]["generated_text"] if isinstance(out, list) else str(out)
	data = _extract_json(content)
	if not isinstance(data, list):
		raise ValueError("Model did not return a JSON list")
	# Normalize keys/fields
	norm: List[Dict[str, Any]] = []
	for item in data:
		if not isinstance(item, dict):
			continue
		task_val = str(item.get("task") or "").strip()
		# Filter out trivial outputs: very short, single letters, greetings
		if not task_val or len(task_val) < 3:
			continue
		if re.fullmatch(r"[A-Za-z]", task_val):
			continue
		if task_val.lower() in {"hi", "hello", "salut", "hey"}:
			continue
		norm.append(
			{
				"task": task_val,
				"time": (item.get("time") or None),
				"category": (item.get("category") or None),
				"deadline": (item.get("deadline") or None),
			}
		)

	# Deduplicate by normalized task text
	seen = set()
	unique: List[Dict[str, Any]] = []
	for t in norm:
		key = t["task"].lower()
		if key in seen:
			continue
		seen.add(key)
		unique.append(t)
	return unique

# This file is intentionally left blank.