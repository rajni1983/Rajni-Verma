/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  Sliders,
  CheckCircle,
  HelpCircle,
  Clock,
  Code,
  Sparkles,
  Bookmark,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ListType, OperationType, LinkedListNode, SimulationStep } from './types';
import {
  createInitialList,
  getPseudoCode,
  rebuildPointers,
  generateInsertHeadSteps,
  generateInsertTailSteps,
  generateInsertIndexSteps,
  generateDeleteHeadSteps,
  generateDeleteTailSteps,
  generateDeleteIndexSteps,
  generateSearchSteps,
  generateReverseSteps,
} from './utils/linkedListAlgorithms';
import { LinkedListCanvas } from './components/LinkedListCanvas';
import { CodeVisualizer } from './components/CodeVisualizer';
import { MemoryMap } from './components/MemoryMap';
import { LabExercises } from './components/LabExercises';

export default function App() {
  // Main list state (the active list currently committed)
  const [listType, setListType] = useState<ListType>('singly');
  const [nodes, setNodes] = useState<LinkedListNode[]>([]);

  // Form input states
  const [selectedOp, setSelectedOp] = useState<OperationType>('insertHead');
  const [inputValue, setInputValue] = useState<number>(15);
  const [inputIndex, setInputIndex] = useState<number>(1);
  const [searchTarget, setSearchTarget] = useState<number>(24);

  // Simulation playback state
  const [activeSteps, setActiveSteps] = useState<SimulationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepDelay, setStepDelay] = useState<number>(1000); // ms delay between steps

  // Lab Tab selection: 'memory' | 'workbook' | 'complexity'
  const [activeTab, setActiveTab] = useState<'memory' | 'workbook' | 'complexity'>('memory');

  // Interactive warning toast/alert
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Playback timer reference
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with some beautiful starting values
  useEffect(() => {
    const startingValues = [12, 24, 48, 96];
    const initial = createInitialList(startingValues, listType);
    setNodes(initial);
    // Reset active simulation if list type changes
    cancelSimulation();
  }, [listType]);

  // Handle auto-play stepping
  useEffect(() => {
    if (isPlaying && activeSteps.length > 0) {
      playbackTimerRef.current = setTimeout(() => {
        if (currentStepIdx < activeSteps.length - 1) {
          setCurrentStepIdx((prev) => prev + 1);
        } else {
          // Finished simulation
          setIsPlaying(false);
          commitSimulation();
          setSuccessMsg('Simulation finished! Pointers have been successfully updated in memory.');
          setTimeout(() => setSuccessMsg(null), 4000);
        }
      }, stepDelay);
    }

    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, [isPlaying, currentStepIdx, activeSteps, stepDelay]);

  // Start a new simulation
  const startSimulation = (steps: SimulationStep[]) => {
    if (steps.length === 0) return;
    setIsPlaying(false);
    setActiveSteps(steps);
    setCurrentStepIdx(0);
    setErrorMsg(null);
  };

  // Commit the current state of simulation nodes as the primary list
  const commitSimulation = () => {
    if (activeSteps.length > 0 && currentStepIdx >= 0) {
      const finalNodes = activeSteps[activeSteps.length - 1].nodes;
      // Filter out temporary highlighted/pulse flags for final storage
      const cleanedNodes = finalNodes.map((n) => ({
        ...n,
        highlighted: false,
        pulse: false,
      }));
      setNodes(cleanedNodes);
      setActiveSteps([]);
      setCurrentStepIdx(-1);
      setIsPlaying(false);
    }
  };

  // Cancel active simulation and restore state to the original committed list
  const cancelSimulation = () => {
    setActiveSteps([]);
    setCurrentStepIdx(-1);
    setIsPlaying(false);
    setErrorMsg(null);
  };

  // Run selected operation
  const handleExecuteOperation = () => {
    cancelSimulation(); // Clear old simulation

    // Bounds and empty validations
    if (selectedOp === 'insertIndex' && inputIndex < 0) {
      setErrorMsg('Error: Index must be a non-negative integer.');
      return;
    }
    if (selectedOp === 'insertIndex' && inputIndex > nodes.length) {
      setErrorMsg(`Error: Index ${inputIndex} is out of bounds! List length is ${nodes.length}.`);
      return;
    }
    if (selectedOp === 'deleteHead' && nodes.length === 0) {
      setErrorMsg('Error: Cannot delete from an empty linked list.');
      return;
    }
    if (selectedOp === 'deleteTail' && nodes.length === 0) {
      setErrorMsg('Error: Cannot delete from an empty linked list.');
      return;
    }
    if (selectedOp === 'deleteIndex' && nodes.length === 0) {
      setErrorMsg('Error: Cannot delete from an empty linked list.');
      return;
    }
    if (selectedOp === 'deleteIndex' && (inputIndex < 0 || inputIndex >= nodes.length)) {
      setErrorMsg(`Error: Index ${inputIndex} is out of bounds. Valid indices are 0 to ${nodes.length - 1}.`);
      return;
    }
    if (selectedOp === 'search' && nodes.length === 0) {
      setErrorMsg('Error: Linked list is empty. Search returned no match.');
      return;
    }

    let steps: SimulationStep[] = [];

    switch (selectedOp) {
      case 'insertHead':
        steps = generateInsertHeadSteps(nodes, inputValue, listType);
        break;
      case 'insertTail':
        steps = generateInsertTailSteps(nodes, inputValue, listType);
        break;
      case 'insertIndex':
        steps = generateInsertIndexSteps(nodes, inputValue, inputIndex, listType);
        break;
      case 'deleteHead':
        steps = generateDeleteHeadSteps(nodes, listType);
        break;
      case 'deleteTail':
        steps = generateDeleteTailSteps(nodes, listType);
        break;
      case 'deleteIndex':
        steps = generateDeleteIndexSteps(nodes, inputIndex, listType);
        break;
      case 'search':
        steps = generateSearchSteps(nodes, searchTarget, listType);
        break;
      case 'reverse':
        steps = generateReverseSteps(nodes, listType);
        break;
    }

    if (steps.length > 0) {
      startSimulation(steps);
    }
  };

  // Helper to load exercises starting configurations
  const handleLoadPresetList = (values: number[], type: ListType) => {
    cancelSimulation();
    setListType(type);
    const initial = createInitialList(values, type);
    setNodes(initial);
    setSuccessMsg(`Loaded practical preset sequence: [${values.join(', ')}] with ${type} pointers!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Load Standard presets
  const handleLoadGenericPreset = (presetType: 'sorted' | 'fibonacci' | 'primes' | 'powers') => {
    let values: number[] = [];
    switch (presetType) {
      case 'sorted':
        values = [10, 20, 30, 40, 50];
        break;
      case 'fibonacci':
        values = [1, 2, 3, 5, 8, 13];
        break;
      case 'primes':
        values = [2, 3, 5, 7, 11, 13];
        break;
      case 'powers':
        values = [2, 4, 8, 16, 32];
        break;
    }
    handleLoadPresetList(values, listType);
  };

  // Simulation controls
  const stepForward = () => {
    if (currentStepIdx < activeSteps.length - 1) {
      setIsPlaying(false);
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStepIdx > 0) {
      setIsPlaying(false);
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const jumpToStart = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const jumpToEnd = () => {
    setIsPlaying(false);
    setCurrentStepIdx(activeSteps.length - 1);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Determine active render states depending on whether we have an active simulation running
  const isSimulating = activeSteps.length > 0 && currentStepIdx >= 0;
  const currentStep = isSimulating ? activeSteps[currentStepIdx] : null;
  const displayedNodes = currentStep ? currentStep.nodes : nodes;
  const displayedPointers = currentStep
    ? currentStep.pointers
    : { headAddress: nodes.length > 0 ? nodes[0].address : null };
  const displayedHighlights = currentStep?.highlightedAddresses || [];
  const displayedConnections = currentStep?.connectionHighlights || [];
  const activePseudoCode = getPseudoCode(listType, selectedOp);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#00FF00] selection:text-black">
      {/* Header Section */}
      <header className="border-b border-white/20 bg-black/40 px-8 py-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 sticky top-0 z-30 backdrop-blur-md">
        <div>
          <h1 className="text-6xl md:text-8xl font-black font-display tracking-tighter leading-none m-0 p-0 text-white select-none">
            LINKED<br className="hidden md:block" />LIST
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-[#00FF00] mt-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse"></span>
            // DATA_STRUCTURE_LAB_01 / SIMULATION_ACTIVE
          </p>
        </div>

        {/* Quick presets & Node Count bar */}
        <div className="flex flex-col md:items-end gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="text-left md:text-right">
              <div className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">
                {String(displayedNodes.length).padStart(2, '0')}
              </div>
              <div className="text-[9px] font-mono text-white/50 uppercase tracking-widest mt-1">
                Nodes in sequence
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/20 hidden md:block"></div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/70">
              Lab Platform: S-101
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-1">
              [Presets]:
            </span>
            <button
              onClick={() => handleLoadGenericPreset('sorted')}
              className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 hover:border-white hover:bg-white hover:text-black text-white transition-all duration-150"
            >
              Sorted S-10
            </button>
            <button
              onClick={() => handleLoadGenericPreset('fibonacci')}
              className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 hover:border-white hover:bg-white hover:text-black text-white transition-all duration-150"
            >
              Fibonacci
            </button>
            <button
              onClick={() => handleLoadGenericPreset('primes')}
              className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 hover:border-white hover:bg-white hover:text-black text-white transition-all duration-150"
            >
              Primes
            </button>
            <button
              onClick={() => handleLoadGenericPreset('powers')}
              className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 hover:border-white hover:bg-white hover:text-black text-white transition-all duration-150"
            >
              Powers of 2
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 flex-1 flex flex-col gap-8">
        {/* Error / Success Toast alerts */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-5 bg-red-950/40 border-2 border-red-500 text-red-200 rounded-none flex items-start gap-4"
            >
              <Info className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500 block">
                  // Laboratory Error Notice
                </span>
                <p className="text-xs font-mono mt-1.5 leading-relaxed">{errorMsg}</p>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 border border-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-5 bg-zinc-900 border-2 border-[#00FF00] text-emerald-200 rounded-none flex items-start gap-4 shadow-[0_0_20px_rgba(0,255,0,0.1)]"
            >
              <CheckCircle className="w-5 h-5 shrink-0 text-[#00FF00] mt-0.5" />
              <div className="flex-1">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00FF00] block">
                  // Lab Operation Success
                </span>
                <p className="text-xs font-mono mt-1.5 leading-relaxed">{successMsg}</p>
              </div>
              <button
                onClick={() => setSuccessMsg(null)}
                className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 border border-[#00FF00] hover:bg-[#00FF00] hover:text-black transition-colors"
              >
                Acknowledge
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Controls Cabin */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            {/* List Type selection */}
            <div className="bg-zinc-900/40 border border-white/20 p-6 rounded-none">
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4 font-mono">
                [01_SELECT_LIST_ARCHITECTURE]
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: 'singly',
                    name: 'Singly Linked List',
                    desc: 'Nodes reference next only. Unidirectional traversal.',
                  },
                  {
                    id: 'doubly',
                    name: 'Doubly Linked List',
                    desc: 'Nodes reference prev and next. Bidirectional.',
                  },
                  {
                    id: 'circular',
                    name: 'Circular Linked List',
                    desc: 'Tail connects back to head. Continuous loop.',
                  },
                ].map((type) => {
                  const isSel = listType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        if (!isSimulating || confirm('Switching architectures will abort the current active debugger simulation. Proceed?')) {
                          setListType(type.id as ListType);
                        }
                      }}
                      className={`flex flex-col items-start text-left p-4 border-2 transition-all duration-200 cursor-pointer ${
                        isSel
                          ? 'bg-white/5 border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.15)]'
                          : 'border-white/10 hover:border-white/30 bg-transparent'
                      }`}
                    >
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isSel ? 'text-[#00FF00]' : 'text-white'}`}>
                        {type.name}
                      </span>
                      <span className="text-[10px] text-white/60 mt-1 leading-relaxed font-sans">
                        {type.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List Operations forms */}
            <div className="bg-zinc-900/40 border border-white/20 p-6 rounded-none">
              <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4 font-mono">
                [02_OPERATIONAL_PANEL]
              </h2>

              <div className="space-y-5">
                {/* Op selector */}
                <div>
                  <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest block mb-2">
                    Select Operation
                  </label>
                  <select
                    value={selectedOp}
                    disabled={isSimulating}
                    onChange={(e) => setSelectedOp(e.target.value as OperationType)}
                    className="w-full text-xs font-mono font-bold px-3 py-3 border border-white/20 bg-black text-white focus:outline-none focus:border-[#00FF00] rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <optgroup label="Insertion Operations" className="bg-zinc-950 text-white">
                      <option value="insertHead">Insert at Head</option>
                      <option value="insertTail">Insert at Tail</option>
                      <option value="insertIndex">Insert at Index</option>
                    </optgroup>
                    <optgroup label="Deletion Operations" className="bg-zinc-950 text-white">
                      <option value="deleteHead">Delete from Head</option>
                      <option value="deleteTail">Delete from Tail</option>
                      <option value="deleteIndex">Delete from Index</option>
                    </optgroup>
                    <optgroup label="Utility Algorithms" className="bg-zinc-950 text-white">
                      <option value="search">Search for Value</option>
                      <option value="reverse">Reverse List In-Place</option>
                    </optgroup>
                  </select>
                </div>

                {/* Operation input fields */}
                {(selectedOp === 'insertHead' || selectedOp === 'insertTail' || selectedOp === 'insertIndex') && (
                  <div>
                    <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest block mb-2">
                      Node Data Value (Integer)
                    </label>
                    <input
                      type="number"
                      disabled={isSimulating}
                      value={inputValue}
                      onChange={(e) => setInputValue(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-mono font-bold px-3 py-3 border border-white/20 bg-black text-white focus:outline-none focus:border-[#00FF00] rounded-none"
                    />
                  </div>
                )}

                {(selectedOp === 'insertIndex' || selectedOp === 'deleteIndex') && (
                  <div>
                    <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest block mb-2">
                      Target Index Location (0 to {selectedOp === 'insertIndex' ? nodes.length : nodes.length - 1})
                    </label>
                    <input
                      type="number"
                      disabled={isSimulating}
                      value={inputIndex}
                      min={0}
                      max={selectedOp === 'insertIndex' ? nodes.length : nodes.length - 1}
                      onChange={(e) => setInputIndex(parseInt(e.target.value) ?? 0)}
                      className="w-full text-xs font-mono font-bold px-3 py-3 border border-white/20 bg-black text-white focus:outline-none focus:border-[#00FF00] rounded-none"
                    />
                  </div>
                )}

                {selectedOp === 'search' && (
                  <div>
                    <label className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest block mb-2">
                      Value to Search
                    </label>
                    <input
                      type="number"
                      disabled={isSimulating}
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(parseInt(e.target.value) || 0)}
                      className="w-full text-xs font-mono font-bold px-3 py-3 border border-white/20 bg-black text-white focus:outline-none focus:border-[#00FF00] rounded-none"
                    />
                  </div>
                )}

                {/* Fire Button */}
                {!isSimulating ? (
                  <button
                    onClick={handleExecuteOperation}
                    className="w-full mt-2 py-3.5 px-4 bg-transparent border-2 border-white hover:bg-white hover:text-black active:scale-[0.98] text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {selectedOp === 'search' && <Search className="w-4 h-4" />}
                    {selectedOp === 'reverse' && <RefreshCw className="w-4 h-4" />}
                    {selectedOp.startsWith('insert') && <Plus className="w-4 h-4" />}
                    {selectedOp.startsWith('delete') && <Trash2 className="w-4 h-4" />}
                    Simulate Algorithm
                  </button>
                ) : (
                  <button
                    onClick={cancelSimulation}
                    className="w-full mt-2 py-3.5 px-4 bg-transparent border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-mono font-bold text-xs uppercase tracking-widest transition-all duration-150 cursor-pointer"
                  >
                    Abort Active Simulation
                  </button>
                )}
              </div>
            </div>

            {/* Stepper debugger panel */}
            {isSimulating && (
              <div className="bg-black border-2 border-[#00FF00] p-6 rounded-none shadow-[0_0_20px_rgba(0,255,0,0.15)]">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <span className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-ping"></span>
                    // DEBUG_STEPPER_ACTIVE
                  </span>
                  <span className="text-[10px] font-mono text-[#00FF00] font-bold">
                    STEP {currentStepIdx + 1} OF {activeSteps.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-none overflow-hidden mb-5">
                  <div
                    className="h-full bg-[#00FF00] transition-all duration-200"
                    style={{ width: `${((currentStepIdx + 1) / activeSteps.length) * 100}%` }}
                  />
                </div>

                {/* Control buttons group */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <button
                    onClick={jumpToStart}
                    title="Jump to Start"
                    className="p-3 bg-white/5 hover:bg-[#00FF00] hover:text-black border border-white/20 transition-all font-mono font-bold cursor-pointer"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={stepBackward}
                    disabled={currentStepIdx === 0}
                    title="Previous Step"
                    className="p-3 bg-white/5 hover:bg-[#00FF00] hover:text-black border border-white/20 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white disabled:cursor-not-allowed transition-all font-mono font-bold cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className={`p-4 border-2 shadow-sm transition-all duration-150 cursor-pointer ${
                      isPlaying
                        ? 'bg-[#00FF00] text-black border-[#00FF00] hover:bg-[#33ff33]'
                        : 'bg-transparent text-[#00FF00] border-[#00FF00] hover:bg-[#00FF00] hover:text-black'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={stepForward}
                    disabled={currentStepIdx === activeSteps.length - 1}
                    title="Next Step"
                    className="p-3 bg-white/5 hover:bg-[#00FF00] hover:text-black border border-white/20 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-white disabled:cursor-not-allowed transition-all font-mono font-bold cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={jumpToEnd}
                    title="Jump to End"
                    className="p-3 bg-white/5 hover:bg-[#00FF00] hover:text-black border border-white/20 transition-all font-mono font-bold cursor-pointer"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/50 tracking-widest">
                    <span>STEP FREQUENCY</span>
                    <span className="text-[#00FF00]">{(1000 / stepDelay).toFixed(1)}Hz</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="2200"
                    step="100"
                    value={2500 - stepDelay}
                    onChange={(e) => setStepDelay(2500 - parseInt(e.target.value))}
                    className="w-full accent-[#00FF00] bg-white/10 h-1 rounded-none appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono tracking-widest">
                    <span>SLOW (2.2s)</span>
                    <span>FAST (0.3s)</span>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
                  <button
                    onClick={cancelSimulation}
                    className="py-2 px-3 border border-white/30 hover:border-white text-white/70 hover:text-white rounded-none text-[10px] font-bold uppercase tracking-widest font-mono text-center transition-all duration-150 cursor-pointer"
                  >
                    Revert State
                  </button>
                  <button
                    onClick={commitSimulation}
                    className="py-2 px-3 bg-[#00FF00] hover:bg-[#33ff33] text-black rounded-none text-[10px] font-bold uppercase tracking-widest font-mono text-center transition-all duration-150 cursor-pointer"
                  >
                    Commit & Exit
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: Visual Canvas + Code debug area + Interactive Tab map */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            {/* Visual Canvas Wrapper Card */}
            <div className="bg-zinc-900/40 border border-white/20 p-6 rounded-none flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
                    [03_LIVE_POINTER_GRAPH_VISUALIZER]
                  </h2>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    Inspect relative sequence layout, node memory references, and dynamic pointer transitions
                  </p>
                </div>
                {/* Active node counter */}
                <div className="flex gap-2 font-mono text-[10px] font-bold">
                  <span className="bg-white/5 border border-white/10 px-3 py-1 text-[#00FF00]">
                    NODES: {displayedNodes.length}
                  </span>
                </div>
              </div>

              {/* Dynamic canvas */}
              <LinkedListCanvas
                nodes={displayedNodes}
                listType={listType}
                pointers={displayedPointers}
                highlightedAddresses={displayedHighlights}
                connectionHighlights={displayedConnections}
              />
            </div>

            {/* Code Debugger Visualizer */}
            <CodeVisualizer
              pseudoCode={activePseudoCode}
              currentLine={currentStep ? currentStep.pseudoCodeLine : 0}
              description={currentStep ? currentStep.description : 'Algorithm idle. Select an operation and click "Simulate Algorithm" to watch code execution.'}
              pointers={displayedPointers}
            />

            {/* Bottom Tabs area: Memory map, workbook, complexities */}
            <div>
              <div className="flex border border-white/15 bg-black/40 p-1 mb-6 rounded-none">
                <button
                  onClick={() => setActiveTab('memory')}
                  className={`flex-1 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                    activeTab === 'memory'
                      ? 'bg-white text-black font-black'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Heap Memory Map
                </button>
                <button
                  onClick={() => setActiveTab('workbook')}
                  className={`flex-1 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                    activeTab === 'workbook'
                      ? 'bg-white text-black font-black'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Practical Lab Challenges
                </button>
                <button
                  onClick={() => setActiveTab('complexity')}
                  className={`flex-1 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-all cursor-pointer ${
                    activeTab === 'complexity'
                      ? 'bg-white text-black font-black'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Big-O Complexity Chart
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'memory' && (
                <MemoryMap nodes={displayedNodes} listType={listType} pointers={displayedPointers} />
              )}

              {activeTab === 'workbook' && (
                <LabExercises
                  currentNodes={nodes}
                  listType={listType}
                  onLoadExerciseList={handleLoadPresetList}
                />
              )}

              {activeTab === 'complexity' && (
                <div className="bg-zinc-900/40 border border-white/20 p-6 rounded-none font-sans">
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono mb-4">
                    [04_ALGORITHMIC_BIG-O_COMPLEXITY_SUMMARY]
                  </h3>
                  <p className="text-xs text-white/60 mb-5 leading-relaxed font-mono">
                    Compare the theoretical time complexities of crucial operations across list variants. In linked list structures, memory links allow O(1) edits at a pointer, but O(N) lookup/index scanning are required to position that pointer.
                  </p>

                  <div className="overflow-x-auto border border-white/10">
                    <table className="w-full border-collapse text-xs text-left">
                      <thead>
                        <tr className="bg-black text-white/50 border-b border-white/20 font-mono">
                          <th className="py-3 px-4 font-bold tracking-wider">Operation Type</th>
                          <th className="py-3 px-4 font-bold text-center tracking-wider">Singly List</th>
                          <th className="py-3 px-4 font-bold text-center tracking-wider">Doubly List</th>
                          <th className="py-3 px-4 font-bold text-center tracking-wider">Circular SLL</th>
                          <th className="py-3 px-4 font-bold tracking-wider">Primary Reason</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white font-sans">Insert Head</td>
                          <td className="py-3.5 px-4 text-center text-[#00FF00] font-bold">O(1)</td>
                          <td className="py-3.5 px-4 text-center text-[#00FF00] font-bold">O(1)</td>
                          <td className="py-3.5 px-4 text-center text-[#00FF00] font-bold">O(N)* / O(1)</td>
                          <td className="py-3.5 px-4 font-sans text-white/60 text-xs leading-relaxed">Requires simple pointer reassignment. Circular lists require O(N) traversal to tail unless tail pointer is cached.</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white font-sans">Insert Tail</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N) / O(1)*</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N) / O(1)*</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N) / O(1)*</td>
                          <td className="py-3.5 px-4 font-sans text-white/60 text-xs leading-relaxed">O(N) to traverse to the end, or O(1) if direct tail reference pointer is kept by the descriptor.</td>
                        </tr>
                        <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white font-sans">Delete Tail</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N)</td>
                          <td className="py-3.5 px-4 text-center text-[#00FF00] font-bold">O(1)*</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N)</td>
                          <td className="py-3.5 px-4 font-sans text-white/60 text-xs leading-relaxed">Singly requires O(N) traversal to find tail predecessor. Doubly tail predecessor is instantly found via prev link in O(1).</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white font-sans">Search / Index</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N)</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N)</td>
                          <td className="py-3.5 px-4 text-center text-amber-400 font-bold">O(N)</td>
                          <td className="py-3.5 px-4 font-sans text-white/60 text-xs leading-relaxed">Elements are not indexed contiguously. Requires sequential search starting from head to reach destination.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="border-t border-white/20 bg-black/60 py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-white/40 mt-12">
        <span>CS_LAB // ALGORITHMS_V2.0</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#00FF00] rounded-full"></span>
          Status: Execution_Safe
        </span>
        <span>©2026 Terminal_Vision</span>
      </footer>
    </div>
  );
}
