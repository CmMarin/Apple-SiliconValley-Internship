import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ title, subtitle, icon }: Props) {
  return (
    <div className="rounded-2xl border border-[#3a3d42] bg-[#2b2d31] shadow-sm p-6 flex flex-col items-center text-center">
      <div className="h-12 w-12 rounded-xl bg-[#1e1f22] border border-[#3a3d42] flex items-center justify-center text-gray-200 mb-4">
        {icon}
      </div>
      <div className="font-semibold text-gray-100">{title}</div>
      <div className="text-gray-400 text-sm mt-1">{subtitle}</div>
    </div>
  );
}
