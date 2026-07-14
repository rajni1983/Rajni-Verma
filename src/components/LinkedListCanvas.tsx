/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { LinkedListNode, ListType } from '../types';

interface LinkedListCanvasProps {
  nodes: LinkedListNode[];
  listType: ListType;
  pointers: {
    currAddress?: string | null;
    tempAddress?: string | null;
    prevAddress?: string | null;
    headAddress?: string | null;
    tailAddress?: string | null;
  };
  highlightedAddresses?: string[];
  connectionHighlights?: {
    from: string;
    to: string;
    type: 'next' | 'prev';
  }[];
}

export const LinkedListCanvas: React.FC<LinkedListCanvasProps> = ({
  nodes,
  listType,
  pointers,
  highlightedAddresses = [],
  connectionHighlights = [],
}) => {
  const isHighlighted = (address: string) => highlightedAddresses.includes(address);

  const getPointerBadges = (address: string) => {
    const badges: { label: string; color: string; bg: string }[] = [];
    if (pointers.headAddress === address) {
      badges.push({ label: 'HEAD', color: 'text-[#00FF00]', bg: 'bg-[#00FF00]/10 border-[#00FF00]/40 rounded-none font-mono text-[10px]' });
    }
    if (pointers.tailAddress === address || (nodes.length > 0 && nodes[nodes.length - 1].address === address && pointers.tailAddress === undefined)) {
      if (nodes.length > 0 && nodes[nodes.length - 1].address === address) {
        badges.push({ label: 'TAIL', color: 'text-white', bg: 'bg-white/10 border-white/30 rounded-none font-mono text-[10px]' });
      }
    }
    if (pointers.currAddress === address) {
      badges.push({ label: 'curr', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/40 rounded-none font-mono text-[10px]' });
    }
    if (pointers.tempAddress === address) {
      badges.push({ label: 'temp', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/40 rounded-none font-mono text-[10px]' });
    }
    if (pointers.prevAddress === address) {
      badges.push({ label: 'prev', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/40 rounded-none font-mono text-[10px]' });
    }
    return badges;
  };

  const isConnectionHighlighted = (from: string, to: string, type: 'next' | 'prev') => {
    return connectionHighlights.some(
      (ch) => ch.from === from && ch.to === to && ch.type === type
    );
  };

  return (
    <div id="canvas-container" className="relative w-full overflow-x-auto py-16 px-6 bg-black rounded-none border border-white/15 shadow-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-white/40">
          <Layers className="w-12 h-12 mb-4 stroke-1 animate-pulse text-white/25" />
          <p className="text-xs font-mono uppercase tracking-widest text-white/50">Linked List is currently empty</p>
          <p className="text-[10px] font-mono text-white/30 mt-2 uppercase tracking-wider">// Insert a node using the panel above to begin</p>
        </div>
      ) : (
        <div className="flex items-center min-w-max h-40 relative px-4">
          <AnimatePresence mode="popLayout">
            {nodes.map((node, index) => {
              const nodeBadges = getPointerBadges(node.address);
              const highlighted = isHighlighted(node.address);
              const pulse = node.pulse;

              return (
                <React.Fragment key={node.id}>
                  {/* Node Wrapper */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.35, ease: 'easeOut' },
                    }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                    className="relative flex items-center select-none animate-fade-in"
                  >
                    {/* Floating Pointer Labels Above Node */}
                    <div className="absolute -top-12 left-0 right-0 flex flex-wrap justify-center gap-1">
                      <AnimatePresence>
                        {nodeBadges.map((badge) => (
                          <motion.span
                            key={badge.label}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold tracking-wider border uppercase shadow-none ${badge.bg} ${badge.color}`}
                          >
                            {badge.label}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Node Visual Box */}
                    <div
                      className={`relative flex flex-col w-32 h-20 rounded-none border bg-zinc-950 overflow-hidden transition-all duration-300 ${
                        pulse
                          ? 'border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.25)]'
                          : highlighted
                          ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                          : 'border-white/15 hover:border-white/30 hover:bg-zinc-900/60'
                      }`}
                    >
                      {/* Node Address (Header) */}
                      <div className="flex items-center justify-between px-2 py-0.5 border-b border-white/10 bg-zinc-900/80">
                        <span className="text-[9px] font-mono text-white/40 font-bold">
                          ADDR:
                        </span>
                        <span className="text-[9px] font-mono font-bold text-white/70">
                          {node.address}
                        </span>
                      </div>

                      {/* Node Inner Layout */}
                      <div className="flex flex-1 items-center justify-between">
                        {/* DLL Prev segment */}
                        {listType === 'doubly' && (
                          <div className="flex flex-col justify-center items-center w-8 h-full border-r border-white/10 bg-zinc-900/20">
                            <span className="text-[7px] font-mono font-bold text-white/40">PREV</span>
                            <span className="text-[9px] font-mono font-semibold text-white/70 truncate w-full text-center px-0.5">
                              {node.prevAddress ? node.prevAddress.substring(2) : '•'}
                            </span>
                          </div>
                        )}

                        {/* Value Segment */}
                        <div className="flex-1 flex flex-col justify-center items-center">
                          <span className="text-[7px] tracking-wider uppercase font-mono font-bold text-white/40">DATA</span>
                          <span className="text-base font-bold font-mono text-white">
                            {node.value}
                          </span>
                        </div>

                        {/* Next Segment */}
                        <div className="flex flex-col justify-center items-center w-8 h-full border-l border-white/10 bg-zinc-900/20">
                          <span className="text-[7px] font-mono font-bold text-white/40">NEXT</span>
                          <span className="text-[9px] font-mono font-semibold text-white/70 truncate w-full text-center px-0.5">
                            {node.nextAddress ? node.nextAddress.substring(2) : '•'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Node Index Badge (Below) */}
                    <div className="absolute -bottom-7 left-0 right-0 text-center">
                      <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">
                        Index_{index}
                      </span>
                    </div>
                  </motion.div>

                  {/* Connector Arrow to the Next Node */}
                  {index < nodes.length - 1 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto', transition: { delay: 0.1 } }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex flex-col items-center justify-center px-3 select-none"
                    >
                      <div className="flex flex-col gap-1 items-center relative py-2">
                        {/* Next Arrow (Rightward) */}
                        <div className="flex items-center gap-0.5">
                          <div
                            className={`h-[1px] w-10 transition-all duration-300 ${
                              isConnectionHighlighted(node.address, nodes[index + 1].address, 'next')
                                ? 'bg-amber-400 h-[2px] shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'bg-white/20'
                            }`}
                          />
                          <ArrowRight
                            className={`w-3 h-3 -ml-1 transition-all duration-300 ${
                              isConnectionHighlighted(node.address, nodes[index + 1].address, 'next')
                                ? 'text-amber-400 stroke-[3px]'
                                : 'text-white/35'
                            }`}
                          />
                        </div>

                        {/* Prev Arrow (Leftward - DLL Only) */}
                        {listType === 'doubly' && (
                          <div className="flex items-center gap-0.5 -mt-1">
                            <ArrowLeft
                              className={`w-3 h-3 -mr-1 transition-all duration-300 ${
                                isConnectionHighlighted(nodes[index + 1].address, node.address, 'prev')
                                  ? 'text-purple-400 stroke-[3px]'
                                  : 'text-white/35'
                              }`}
                            />
                            <div
                              className={`h-[1px] w-10 transition-all duration-300 ${
                                isConnectionHighlighted(nodes[index + 1].address, node.address, 'prev')
                                  ? 'bg-purple-400 h-[2px] shadow-[0_0_8px_rgba(192,132,252,0.5)]'
                                  : 'bg-white/20'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Circular List Ending Arrow back to Head */}
                  {listType === 'circular' && index === nodes.length - 1 && (
                    <div className="absolute right-4 bottom-2 left-6 h-4 pointer-events-none select-none">
                      <div className="absolute -right-3 -top-12 flex items-center gap-1.5 py-1 px-2 border border-[#00FF00]/30 bg-black text-[#00FF00] text-[9px] font-bold font-mono shadow-none">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>NEXT → HEAD ({nodes[0].address})</span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {/* SLL Tail pointing to NULL */}
          {listType !== 'circular' && (
            <div className="flex items-center pl-3">
              <div className="h-[1px] w-6 bg-white/20" />
              <div className="flex items-center justify-center px-2 py-1 bg-zinc-900 border border-white/10 rounded-none text-[9px] font-mono font-bold text-white/40">
                NULL
              </div>
            </div>
          )}
        </div>
      )}

      {/* Circular Return Pointer Line Visualizer for Circular list */}
      {listType === 'circular' && nodes.length > 1 && (
        <div className="w-full mt-6 border-t border-dashed border-[#00FF00]/20 pt-3 flex justify-between items-center text-[9px] text-[#00FF00]/70 font-mono uppercase tracking-widest">
          <div className="flex items-center gap-1.5 pl-4">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Circular Loopback active</span>
          </div>
          <div className="pr-4 flex items-center gap-1">
            <span>Tail ({nodes[nodes.length - 1].address}) points back to Head ({nodes[0].address})</span>
          </div>
        </div>
      )}
    </div>
  );
};
