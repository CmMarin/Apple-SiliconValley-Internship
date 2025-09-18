import React from 'react';

export default function RightPanel() {
  return (
    <aside className="h-full w-[320px] border-l border-[#e6e7ea] bg-[#fafbfc] text-slate-800 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Task Summary</div>
      <div className="bg-white border border-[#e6e7ea] rounded-md p-3 shadow-sm mb-3">
        <div className="text-sm text-slate-700">Entities, times, priorities</div>
      </div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Confidence & Warnings</div>
      <div className="bg-white border border-[#e6e7ea] rounded-md p-3 shadow-sm mb-3">
        <div className="text-sm text-slate-700">No warnings</div>
      </div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Schema Validator</div>
      <div className="bg-white border border-[#e6e7ea] rounded-md p-3 shadow-sm mb-3">
        <button className="px-3 py-1 rounded bg-slate-800 text-white">Validate</button>
      </div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Clarification History</div>
      <div className="bg-white border border-[#e6e7ea] rounded-md p-3 shadow-sm">
        <div className="text-sm text-slate-700">No clarifications</div>
      </div>
    </aside>
  );
}
