/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Cpu, ArrowRight } from 'lucide-react';
import { PseudoCodeBlock } from '../types';

interface CodeVisualizerProps {
  pseudoCode: PseudoCodeBlock;
  currentLine: number;
  description: string;
  pointers: {
    currAddress?: string | null;
    tempAddress?: string | null;
    prevAddress?: string | null;
    headAddress?: string | null;
    tailAddress?: string | null;
  };
}

export const CodeVisualizer: React.FC<CodeVisualizerProps> = ({
  pseudoCode,
  currentLine,
  description,
  pointers,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      {/* Left side: Pseudo Code Block */}
      <div className="lg:col-span-7 flex flex-col rounded-none border border-white/20 bg-black overflow-hidden">
        {/* Code Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00FF00]" />
            <span className="text-xs font-bold tracking-widest text-[#00FF00] font-mono">
              // ALGORITHM_PSEUDO_CODE
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-white/10" />
            <span className="w-2.5 h-2.5 bg-[#00FF00]/50" />
            <span className="w-2.5 h-2.5 bg-[#00FF00]" />
          </div>
        </div>

        {/* Pseudo-code Lines */}
        <div className="flex-1 p-5 font-mono text-xs leading-relaxed text-white/80 overflow-y-auto max-h-72">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-3 border-b border-white/10 pb-2 font-bold">
            CURRENT: {pseudoCode.title}
          </div>
          {pseudoCode.lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === currentLine;
            return (
              <div
                key={idx}
                className={`flex items-start py-1 px-2.5 rounded-none transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00FF00]/10 border-l-2 border-[#00FF00] text-[#00FF00] font-bold'
                    : 'border-l-2 border-transparent hover:bg-white/5 text-white/50'
                }`}
              >
                <span className="w-6 text-right mr-4 select-none font-bold text-white/30">
                  {String(lineNum).padStart(2, '0')}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Console logs & Variable Watcher */}
      <div className="lg:col-span-5 flex flex-col rounded-none border border-white/20 bg-black overflow-hidden">
        {/* Watcher Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-white/60" />
            <span className="text-xs font-bold text-white/80 font-mono tracking-widest">
              // DRY_RUN_MONITOR
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold bg-white/10 text-white/80 px-2 py-0.5">
            STEP_VARIABLES
          </span>
        </div>

        <div className="p-4 flex flex-col flex-1 justify-between gap-4">
          {/* Explain log */}
          <div className="flex-1 flex flex-col bg-zinc-950 p-4 rounded-none border border-white/10">
            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">
              [DEBUGGER_LOG]:
            </span>
            <p className="text-xs font-mono text-[#00FF00] leading-relaxed">
              {description || 'No execution active.'}
            </p>
          </div>

          {/* Variables table */}
          <div>
            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-2">
              [POINTER_WATCH_TABLE]:
            </span>
            <div className="border border-white/15 rounded-none overflow-hidden font-mono text-[10px]">
              <div className="grid grid-cols-3 bg-zinc-900 py-2 px-3 border-b border-white/15 font-bold text-white/50 uppercase tracking-widest">
                <span>Pointer</span>
                <span className="col-span-2">Address Reference</span>
              </div>

              {/* Head pointer */}
              <div className="grid grid-cols-3 py-2 px-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                <span className="font-bold text-[#00FF00]">head</span>
                <span className="col-span-2 font-bold text-white">
                  {pointers.headAddress || <span className="text-white/30 font-normal">NULL</span>}
                </span>
              </div>

              {/* Curr pointer */}
              <div className="grid grid-cols-3 py-2 px-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                <span className="font-bold text-amber-400">curr</span>
                <span className="col-span-2 font-bold text-white">
                  {pointers.currAddress || <span className="text-white/30 font-normal">NULL</span>}
                </span>
              </div>

              {/* Prev pointer */}
              <div className="grid grid-cols-3 py-2 px-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                <span className="font-bold text-rose-400">prev</span>
                <span className="col-span-2 font-bold text-white">
                  {pointers.prevAddress || <span className="text-white/30 font-normal">NULL</span>}
                </span>
              </div>

              {/* Temp pointer */}
              <div className="grid grid-cols-3 py-2 px-3 hover:bg-white/5 transition-colors">
                <span className="font-bold text-purple-400">temp</span>
                <span className="col-span-2 font-bold text-white">
                  {pointers.tempAddress || <span className="text-white/30 font-normal">NULL</span>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
