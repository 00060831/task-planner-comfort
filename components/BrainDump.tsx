'use client';

import { BrainDumpItem } from '@/lib/types';
import { FormEvent, useState } from 'react';

type BrainDumpProps = {
  items: BrainDumpItem[];
  onAdd: (text: string) => void;
};

export function BrainDump({ items, onAdd }: BrainDumpProps) {
  const [value, setValue] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onAdd(value);
    setValue('');
  };

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
      <h2 className="mb-2 text-sm font-semibold text-white">Brain Dump</h2>
      <form onSubmit={submit} className="mb-4 flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Быстро закинь идею..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button className="rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white">Add</button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl bg-slate-800/70 px-3 py-2 text-sm text-slate-200">
            {item.text}
          </div>
        ))}
      </div>
    </section>
  );
}
