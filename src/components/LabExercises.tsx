/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Award } from 'lucide-react';
import { LinkedListNode, ListType, LabExercise, QuizQuestion } from '../types';

interface LabExercisesProps {
  currentNodes: LinkedListNode[];
  listType: ListType;
  onLoadExerciseList: (values: number[], type: ListType) => void;
}

const SAMPLE_EXERCISES: LabExercise[] = [
  {
    id: 'ex1',
    title: 'The Reversal Challenge',
    description: 'Reverse a sequence to change its relative sequence from Ascending to Descending order.',
    difficulty: 'Beginner',
    initialList: [10, 20, 30, 40],
    listType: 'singly',
    instructions: 'Load the starting Singly List [10, 20, 30, 40], and then run the "Reverse" algorithm to obtain [40, 30, 20, 10].',
    expectedList: [40, 30, 20, 10],
  },
  {
    id: 'ex2',
    title: 'Doubly Circular Boundary',
    description: 'Construct a symmetric Doubly Linked List structure and delete the head element.',
    difficulty: 'Intermediate',
    initialList: [5, 15, 25, 35],
    listType: 'doubly',
    instructions: 'Load the Doubly List [5, 15, 25, 35]. Perform a "Delete Head" operation. The final list must be [15, 25, 35].',
    expectedList: [15, 25, 35],
  },
  {
    id: 'ex3',
    title: 'Middle Insertion & Rewiring',
    description: 'Insert a node precisely in the middle of a Circular list to test pointer updates.',
    difficulty: 'Advanced',
    initialList: [100, 200, 400],
    listType: 'circular',
    instructions: 'Load the Circular list [100, 200, 400]. Perform an "Insert at Index 2" with value 300 to create the sorted sequence [100, 200, 300, 400].',
    expectedList: [100, 200, 300, 400],
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the worst-case time complexity to insert an element at a given index k in a Singly Linked List of size N (assuming we only have a reference to the head)?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
    correctAnswer: 2,
    explanation: 'To insert at index k, we must first traverse k nodes starting from the head to find the predecessor node. In the worst case (inserting near the tail), this requires traversing up to N-1 nodes, resulting in O(N) complexity.',
  },
  {
    id: 'q2',
    question: 'Which linked list type requires the maximum extra memory space per node to store address references?',
    options: ['Singly Linked List', 'Doubly Linked List', 'Circular Singly Linked List', 'All use identical memory space'],
    correctAnswer: 1,
    explanation: 'Doubly Linked Lists store two references per node (prev and next), whereas Singly and Circular Singly Lists only store one reference (next). Hence, Doubly Linked Lists require more memory space per node.',
  },
  {
    id: 'q3',
    question: 'What happens to the tail node in a Circular Singly Linked List?',
    options: [
      'Its next pointer refers to null.',
      'Its next pointer refers to itself.',
      'Its next pointer refers to the head node.',
      'It does not contain a next pointer.',
    ],
    correctAnswer: 2,
    explanation: 'In a Circular Singly Linked List, there is no NULL terminator. Instead, the final node (tail) has its next pointer directed back to the first node (head), closing the circle.',
  },
  {
    id: 'q4',
    question: 'Why is deletion of the tail node in a Singly Linked List O(N) even if we maintain a tail pointer reference?',
    options: [
      'Because memory deallocation is slow.',
      'Because we must traverse from head to find the second-to-last node (predecessor of tail) to update its next pointer to NULL.',
      'Because elements must be shifted left in contiguous memory.',
      'Singly Linked Lists do not support tail pointers.',
    ],
    correctAnswer: 1,
    explanation: 'Even with a direct reference to the tail node, deleting it requires updating its predecessor\'s next pointer to NULL. Since SLL nodes only link forward, we must traverse the entire list from the head to locate this predecessor, making it O(N).',
  },
];

export const LabExercises: React.FC<LabExercisesProps> = ({
  currentNodes,
  listType,
  onLoadExerciseList,
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'quiz'>('challenges');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Helper to verify if exercise is completed by matching values
  const checkExerciseCompleted = (exercise: LabExercise) => {
    if (listType !== exercise.listType) return false;
    if (currentNodes.length !== exercise.expectedList.length) return false;
    return currentNodes.every((node, idx) => node.value === exercise.expectedList[idx]);
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setSubmittedQuiz(false);
    setShowExplanation({});
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="w-full bg-zinc-900/40 border border-white/20 rounded-none shadow-none overflow-hidden">
      {/* Navigation tabs */}
      <div className="flex border-b border-white/15 bg-black">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-mono text-xs font-bold tracking-widest uppercase border-r border-white/15 transition-all cursor-pointer ${
            activeTab === 'challenges'
              ? 'bg-white text-black font-black'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          // LAB_WORKBOOK_CHALLENGES
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 font-mono text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-white text-black font-black'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          // INTERACTIVE_LAB_QUIZ
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'challenges' ? (
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                [CS_101_PRACTICAL_LAB_MANUAL]
              </h3>
              <p className="text-xs text-white/50 mt-1 font-mono leading-relaxed">
                Load a lab challenge to bootstrap your simulator. Try to follow the instructions to achieve the target configuration, then observe the live validation check below!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SAMPLE_EXERCISES.map((ex) => {
                const isCompleted = checkExerciseCompleted(ex);
                const diffColors = {
                  Beginner: 'text-[#00FF00] bg-[#00FF00]/5 border-[#00FF00]/30 rounded-none font-mono text-[9px]',
                  Intermediate: 'text-amber-400 bg-amber-400/5 border-amber-400/30 rounded-none font-mono text-[9px]',
                  Advanced: 'text-red-400 bg-red-400/5 border-red-400/30 rounded-none font-mono text-[9px]',
                };

                return (
                  <div
                    key={ex.id}
                    className={`flex flex-col justify-between p-5 rounded-none border transition-all duration-300 ${
                      isCompleted
                        ? 'border-[#00FF00]/80 bg-[#00FF00]/5 shadow-none'
                        : 'border-white/10 bg-black/30 hover:border-white/30'
                    }`}
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h4 className="font-bold text-xs text-white font-mono tracking-wide">
                          {ex.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-none border uppercase tracking-widest ${diffColors[ex.difficulty]}`}>
                          {ex.difficulty}
                        </span>
                      </div>

                      {/* Desc */}
                      <p className="text-[11px] text-white/60 mb-4 leading-relaxed font-sans">
                        {ex.description}
                      </p>

                      {/* Steps instructions */}
                      <div className="p-3 rounded-none bg-zinc-950 border border-white/10 mb-4 font-mono text-[10px]">
                        <span className="text-[9px] font-bold text-[#00FF00] uppercase tracking-widest block mb-1">
                          [INSTRUCTIONS]:
                        </span>
                        <p className="text-[10px] text-white/80 leading-normal">
                          {ex.instructions}
                        </p>
                      </div>
                    </div>

                    {/* Loader Button & Completion Status */}
                    <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-4 mt-2">
                      <button
                        onClick={() => onLoadExerciseList(ex.initialList, ex.listType)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-black text-white text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer font-mono rounded-none"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Load Preset
                      </button>

                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-[#00FF00] font-bold text-[10px] uppercase font-mono tracking-widest">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF00]" />
                          <span>PASS</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-white/30 font-bold text-[10px] uppercase font-mono tracking-widest">
                          <AlertCircle className="w-3.5 h-3.5 text-white/20" />
                          <span>PENDING</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Quiz Section */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                  [LAB_APTITUDE_ASSESSMENT]
                </h3>
                <p className="text-xs text-white/50 mt-1 font-mono leading-relaxed">
                  Test your understanding of Linked List time complexities, memory pointers, and conceptual trade-offs.
                </p>
              </div>
              {submittedQuiz && (
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1.5 border border-white/20 hover:border-white hover:bg-white hover:text-black text-white text-[10px] font-bold tracking-widest font-mono uppercase transition-colors cursor-pointer rounded-none"
                >
                  Reset Assessment
                </button>
              )}
            </div>

            {/* Questions list */}
            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, qIdx) => {
                const selectedAnswer = quizAnswers[q.id];
                const isCorrect = selectedAnswer === q.correctAnswer;
                const isAnswered = selectedAnswer !== undefined;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-none border border-white/10 bg-black/40"
                  >
                    <h4 className="font-bold text-xs text-white leading-relaxed font-mono mb-4 uppercase tracking-wide">
                      {String(qIdx + 1).padStart(2, '0')}. {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedAnswer === optIdx;
                        let optionStyle = 'border-white/10 bg-zinc-950 hover:bg-zinc-900 text-white/70';

                        if (submittedQuiz) {
                          if (optIdx === q.correctAnswer) {
                            optionStyle = 'border-[#00FF00] bg-[#00FF00]/10 text-[#00FF00] font-bold shadow-[0_0_10px_rgba(0,255,0,0.1)]';
                          } else if (isChosen) {
                            optionStyle = 'border-red-500 bg-red-950/20 text-red-400 font-bold';
                          } else {
                            optionStyle = 'opacity-40 border-white/5 bg-zinc-950 text-white/40';
                          }
                        } else if (isChosen) {
                          optionStyle = 'border-amber-400 bg-amber-400/10 text-amber-300 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`flex items-center text-left p-3 border text-xs transition-all duration-200 rounded-none cursor-pointer ${optionStyle} font-mono`}
                          >
                            <span className="w-5 h-5 border border-white/20 flex items-center justify-center mr-3 font-bold text-[9px] shrink-0 text-white/50">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation toggle for submitted */}
                    {submittedQuiz && (
                      <div className="mt-4 p-4 rounded-none bg-zinc-950 border border-white/10 font-mono text-[10px]">
                        <span className="text-[9px] font-bold text-[#00FF00] uppercase tracking-widest block mb-1">
                          {isCorrect ? '✓ Correct Explanation' : '✗ Incorrect Explanation'}
                        </span>
                        <p className="text-[10px] text-white/60 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Bar */}
            <div className="mt-8 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              {!submittedQuiz ? (
                <div className="flex items-center gap-2 font-mono text-xs text-white/50">
                  <span>{Object.keys(quizAnswers).length} of {QUIZ_QUESTIONS.length} questions answered</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#00FF00] animate-pulse shrink-0" />
                  <div className="font-mono">
                    <span className="text-xs font-bold text-white block uppercase tracking-wider">
                      Laboratory Assessment Complete!
                    </span>
                    <p className="text-xs text-white/60 mt-1">
                      Your Score: <strong className="text-[#00FF00] font-black">{calculateScore()}</strong> / {QUIZ_QUESTIONS.length} ({Math.round((calculateScore() / QUIZ_QUESTIONS.length) * 100)}%)
                    </p>
                  </div>
                </div>
              )}

              {!submittedQuiz && (
                <button
                  onClick={() => setSubmittedQuiz(true)}
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  className={`flex items-center gap-2 px-5 py-3 text-[10px] font-bold font-mono uppercase tracking-widest transition-all duration-200 cursor-pointer rounded-none ${
                    Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length
                      ? 'bg-zinc-950 text-white/30 border border-white/10 cursor-not-allowed'
                      : 'bg-[#00FF00] hover:bg-[#33ff33] text-black shadow-none'
                  }`}
                >
                  Submit Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
