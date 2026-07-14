/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, HelpCircle } from 'lucide-react';
import { LinkedListNode, ListType } from '../types';

interface MemoryMapProps {
  nodes: LinkedListNode[];
  listType: ListType;
  pointers: {
    currAddress?: string | null;
    tempAddress?: string | null;
    prevAddress?: string | null;
    headAddress?: string | null;
    tailAddress?: string | null;
  };
}

export const MemoryMap: React.FC<MemoryMapProps> = ({ nodes, listType, pointers }) => {
  return (
    <div className="w-full bg-zinc-900/40 border border-white/20 rounded-none shadow-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#00FF00]" />
          <span className="text-xs font-bold tracking-widest uppercase text-white/80 font-mono">
            // HEAP_MEMORY_ALLOCATION_MAP
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono bg-white/5 border border-white/10 text-[#00FF00] px-2 py-0.5 rounded-none">
          <span>VIRTUAL ADDRESS SPACE: 16-BIT HEX</span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs text-white/50 mb-4 leading-relaxed font-mono">
          This table displays how nodes are represented dynamically on the system heap. Unlike arrays, which occupy contiguous block structures, linked list nodes reside at arbitrary virtual addresses. Pointers are memory variables storing these hexadecimal addresses to form the sequence.
        </p>

        {nodes.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-white/10 bg-black/40 text-white/30 text-xs font-mono rounded-none">
            [Heap is currently empty. Allocate some nodes in the simulator to view their physical memory layout]
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-zinc-900 text-white/50 border-b border-white/20 text-left">
                  <th className="py-2.5 px-4 font-bold tracking-widest uppercase text-[10px]">HEAP ADDRESS</th>
                  <th className="py-2.5 px-4 font-bold text-center tracking-widest uppercase text-[10px]">VALUE</th>
                  <th className="py-2.5 px-4 font-bold tracking-widest uppercase text-[10px]">NEXT POINTER</th>
                  {listType === 'doubly' && <th className="py-2.5 px-4 font-bold tracking-widest uppercase text-[10px]">PREV POINTER</th>}
                  <th className="py-2.5 px-4 font-bold tracking-widest uppercase text-[10px]">POINTER VARIABLES ATTACHED</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node, idx) => {
                  const attachedPointers: string[] = [];
                  if (pointers.headAddress === node.address) attachedPointers.push('head');
                  if (pointers.currAddress === node.address) attachedPointers.push('curr');
                  if (pointers.tempAddress === node.address) attachedPointers.push('temp');
                  if (pointers.prevAddress === node.address) attachedPointers.push('prev');
                  if (idx === nodes.length - 1) attachedPointers.push('tail');

                  const hasAttached = attachedPointers.length > 0;

                  return (
                    <tr
                      key={node.id}
                      className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                        hasAttached ? 'bg-[#00FF00]/5' : ''
                      }`}
                    >
                      {/* Heap address */}
                      <td className="py-3.5 px-4 font-bold text-[#00FF00]">
                        {node.address}
                      </td>

                      {/* Value (Center) */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-3 py-1 bg-zinc-950 font-bold text-white rounded-none border border-white/10">
                          {node.value}
                        </span>
                      </td>

                      {/* Next address */}
                      <td className="py-3.5 px-4">
                        {node.nextAddress ? (
                          <span className="text-white/80 font-medium">
                            {node.nextAddress}
                          </span>
                        ) : (
                          <span className="text-white/30 italic">NULL (0x0000)</span>
                        )}
                      </td>

                      {/* Prev address for DLL */}
                      {listType === 'doubly' && (
                        <td className="py-3.5 px-4">
                          {node.prevAddress ? (
                            <span className="text-white/80 font-medium">
                              {node.prevAddress}
                            </span>
                          ) : (
                            <span className="text-white/30 italic">NULL (0x0000)</span>
                          )}
                        </td>
                      )}

                      {/* Attached pointer variables */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {attachedPointers.length > 0 ? (
                            attachedPointers.map((p) => {
                              const colors: Record<string, string> = {
                                head: 'bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/30',
                                curr: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
                                temp: 'bg-purple-400/10 text-purple-300 border-purple-400/30',
                                prev: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
                                tail: 'bg-white/10 text-white border-white/35',
                              };
                              return (
                                <span
                                  key={p}
                                  className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-none ${colors[p]}`}
                                >
                                  {p}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-white/20 text-[10px] italic">No active labels</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
