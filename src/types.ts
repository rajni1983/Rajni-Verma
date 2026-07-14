/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ListType = 'singly' | 'doubly' | 'circular';

export interface LinkedListNode {
  id: string; // Unique UI identifier
  value: number;
  address: string; // E.g., '0x4F8D' (mock memory address)
  nextAddress: string | null; // Address of the next node
  prevAddress: string | null; // Address of the previous node (for DLL)
  highlighted?: boolean;
  pulse?: boolean;
}

export type OperationType = 'insertHead' | 'insertTail' | 'insertIndex' | 'deleteHead' | 'deleteTail' | 'deleteIndex' | 'search' | 'reverse';

export interface SimulationStep {
  nodes: LinkedListNode[];
  pseudoCodeLine: number;
  description: string;
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

export interface PseudoCodeBlock {
  title: string;
  lines: string[];
}

export interface LabExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  initialList: number[];
  listType: ListType;
  instructions: string;
  expectedList: number[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
