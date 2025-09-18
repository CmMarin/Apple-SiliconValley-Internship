import React from 'react';
import { Search, Bell, User, Globe, Lightning } from './icons';

export default function Header() {
  return (
    <header className="w-full border-b border-[#2b2d31] bg-[#1e1f22]">
      <div className="mx-auto max-w-7xl px-3 md:px-4 h-14 flex items-center gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 pr-3 border-r border-[#2b2d31]">
          <div className="h-8 w-8 rounded-md bg-indigo-500/20 border border-[#3a3d42] flex items-center justify-center text-indigo-300 font-bold">TF</div>
          <div className="hidden sm:block">
            <div className="text-gray-100 font-semibold leading-4">TaskFlow</div>
            <div className="text-gray-400 text-[11px] leading-3">AI Workspace</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 hidden md:flex items-center">
          <div className="w-full max-w-xl flex items-center gap-2 bg-[#2b2d31] border border-[#3a3d42] rounded-md px-2 py-1.5 text-gray-300">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search tasks, commands..."
              className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            />
            <span className="text-[10px] text-gray-500 border border-[#3a3d42] rounded px-1">Ctrl K</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-300 bg-[#2b2d31] border border-[#3a3d42] rounded-full px-2.5 py-1">
            <Globe className="h-3.5 w-3.5" /> Multilingual
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-300 bg-[#2b2d31] border border-[#3a3d42] rounded-full px-2.5 py-1">
            <Lightning className="h-3.5 w-3.5" /> AI
          </span>
          <button className="h-8 w-8 grid place-items-center rounded-md border border-[#3a3d42] bg-[#2b2d31] text-gray-300 hover:bg-[#34363b]"><Bell className="h-4 w-4" /></button>
          <button className="h-8 w-8 grid place-items-center rounded-md border border-[#3a3d42] bg-[#2b2d31] text-gray-300 hover:bg-[#34363b]"><User className="h-4 w-4" /></button>
        </div>
      </div>
    </header>
  );
}
