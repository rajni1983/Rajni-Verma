/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ListType, OperationType, LinkedListNode, SimulationStep, PseudoCodeBlock } from '../types';

export const generateAddress = (): string => {
  return '0x' + Math.floor(Math.random() * 61439 + 4096).toString(16).toUpperCase();
};

export const createInitialList = (values: number[], listType: ListType): LinkedListNode[] => {
  const nodes: LinkedListNode[] = values.map((val) => ({
    id: Math.random().toString(36).substr(2, 9),
    value: val,
    address: generateAddress(),
    nextAddress: null,
    prevAddress: null,
  }));

  rebuildPointers(nodes, listType);
  return nodes;
};

// Help rebuild nextAddress and prevAddress based on ListType
export const rebuildPointers = (nodes: LinkedListNode[], listType: ListType) => {
  if (nodes.length === 0) return;

  for (let i = 0; i < nodes.length; i++) {
    const nextNode = nodes[i + 1];
    const prevNode = nodes[i - 1];

    // Reset
    nodes[i].nextAddress = null;
    nodes[i].prevAddress = null;

    if (listType === 'singly') {
      if (nextNode) {
        nodes[i].nextAddress = nextNode.address;
      }
    } else if (listType === 'doubly') {
      if (nextNode) {
        nodes[i].nextAddress = nextNode.address;
      }
      if (prevNode) {
        nodes[i].prevAddress = prevNode.address;
      }
    } else if (listType === 'circular') {
      if (nextNode) {
        nodes[i].nextAddress = nextNode.address;
      } else {
        nodes[i].nextAddress = nodes[0].address; // Circular loop
      }
    }
  }
};

// Deep copy nodes
const copyNodes = (nodes: LinkedListNode[]): LinkedListNode[] => {
  return nodes.map((n) => ({ ...n }));
};

export const getPseudoCode = (listType: ListType, op: OperationType): PseudoCodeBlock => {
  switch (op) {
    case 'insertHead':
      if (listType === 'singly') {
        return {
          title: 'Singly Linked List: Insert at Head',
          lines: [
            '1. temp = createNewNode(val)',
            '2. temp.next = head',
            '3. head = temp',
          ],
        };
      } else if (listType === 'doubly') {
        return {
          title: 'Doubly Linked List: Insert at Head',
          lines: [
            '1. temp = createNewNode(val)',
            '2. temp.next = head',
            '3. if head != null:',
            '4.     head.prev = temp',
            '5. head = temp',
          ],
        };
      } else {
        return {
          title: 'Circular Linked List: Insert at Head',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if head == null:',
            '3.     temp.next = temp',
            '4.     head = temp',
            '5. else:',
            '6.     curr = head',
            '7.     while curr.next != head:',
            '8.         curr = curr.next',
            '9.     temp.next = head',
            '10.    curr.next = temp',
            '11.    head = temp',
          ],
        };
      }

    case 'insertTail':
      if (listType === 'singly') {
        return {
          title: 'Singly Linked List: Insert at Tail',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if head == null:',
            '3.     head = temp; return',
            '4. curr = head',
            '5. while curr.next != null:',
            '6.     curr = curr.next',
            '7. curr.next = temp',
          ],
        };
      } else if (listType === 'doubly') {
        return {
          title: 'Doubly Linked List: Insert at Tail',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if head == null:',
            '3.     head = temp; return',
            '4. curr = head',
            '5. while curr.next != null:',
            '6.     curr = curr.next',
            '7. curr.next = temp',
            '8. temp.prev = curr',
          ],
        };
      } else {
        return {
          title: 'Circular Linked List: Insert at Tail',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if head == null:',
            '3.     temp.next = temp',
            '4.     head = temp',
            '5. else:',
            '6.     curr = head',
            '7.     while curr.next != head:',
            '8.         curr = curr.next',
            '9.     curr.next = temp',
            '10.    temp.next = head',
          ],
        };
      }

    case 'insertIndex':
      if (listType === 'singly') {
        return {
          title: 'Singly Linked List: Insert at Index',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if index == 0:',
            '3.     temp.next = head; head = temp; return',
            '4. curr = head; i = 0',
            '5. while curr != null and i < index - 1:',
            '6.     curr = curr.next; i++',
            '7. if curr == null: error("Index Out of Bounds")',
            '8. temp.next = curr.next',
            '9. curr.next = temp',
          ],
        };
      } else if (listType === 'doubly') {
        return {
          title: 'Doubly Linked List: Insert at Index',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if index == 0:',
            '3.     temp.next = head; if head != null head.prev = temp; head = temp; return',
            '4. curr = head; i = 0',
            '5. while curr != null and i < index - 1:',
            '6.     curr = curr.next; i++',
            '7. if curr == null: error("Index Out of Bounds")',
            '8. temp.next = curr.next',
            '9. if curr.next != null:',
            '10.    curr.next.prev = temp',
            '11. curr.next = temp',
            '12. temp.prev = curr',
          ],
        };
      } else {
        return {
          title: 'Circular Linked List: Insert at Index',
          lines: [
            '1. temp = createNewNode(val)',
            '2. if index == 0:',
            '3.     (See Insert at Head steps)',
            '4. curr = head; i = 0',
            '5. while curr.next != head and i < index - 1:',
            '6.     curr = curr.next; i++',
            '7. temp.next = curr.next',
            '8. curr.next = temp',
          ],
        };
      }

    case 'deleteHead':
      if (listType === 'singly') {
        return {
          title: 'Singly Linked List: Delete from Head',
          lines: [
            '1. if head == null: return',
            '2. temp = head',
            '3. head = head.next',
            '4. delete temp',
          ],
        };
      } else if (listType === 'doubly') {
        return {
          title: 'Doubly Linked List: Delete from Head',
          lines: [
            '1. if head == null: return',
            '2. temp = head',
            '3. head = head.next',
            '4. if head != null:',
            '5.     head.prev = null',
            '6. delete temp',
          ],
        };
      } else {
        return {
          title: 'Circular Linked List: Delete from Head',
          lines: [
            '1. if head == null: return',
            '2. temp = head',
            '3. if head.next == head:',
            '4.     head = null',
            '5. else:',
            '6.     curr = head',
            '7.     while curr.next != head:',
            '8.         curr = curr.next',
            '9.     head = head.next',
            '10.    curr.next = head',
            '11. delete temp',
          ],
        };
      }

    case 'deleteTail':
      if (listType === 'singly') {
        return {
          title: 'Singly Linked List: Delete from Tail',
          lines: [
            '1. if head == null: return',
            '2. if head.next == null:',
            '3.     temp = head; head = null; delete temp; return',
            '4. prev = null; curr = head',
            '5. while curr.next != null:',
            '6.     prev = curr; curr = curr.next',
            '7. prev.next = null',
            '8. delete curr',
          ],
        };
      } else if (listType === 'doubly') {
        return {
          title: 'Doubly Linked List: Delete from Tail',
          lines: [
            '1. if head == null: return',
            '2. if head.next == null:',
            '3.     temp = head; head = null; delete temp; return',
            '4. curr = head',
            '5. while curr.next != null:',
            '6.     curr = curr.next',
            '7. curr.prev.next = null',
            '8. delete curr',
          ],
        };
      } else {
        return {
          title: 'Circular Linked List: Delete from Tail',
          lines: [
            '1. if head == null: return',
            '2. if head.next == head:',
            '3.     temp = head; head = null; delete temp; return',
            '4. prev = null; curr = head',
            '5. while curr.next != head:',
            '6.     prev = curr; curr = curr.next',
            '7. prev.next = head',
            '8. delete curr',
          ],
        };
      }

    case 'deleteIndex':
      if (listType === 'singly') {
        return {
          title: 'Singly Linked List: Delete at Index',
          lines: [
            '1. if head == null: return',
            '2. if index == 0:',
            '3.     temp = head; head = head.next; delete temp; return',
            '4. curr = head; i = 0',
            '5. while curr != null and i < index - 1:',
            '6.     curr = curr.next; i++',
            '7. if curr == null or curr.next == null: error("Out of Bounds")',
            '8. temp = curr.next',
            '9. curr.next = temp.next',
            '10. delete temp',
          ],
        };
      } else if (listType === 'doubly') {
        return {
          title: 'Doubly Linked List: Delete at Index',
          lines: [
            '1. if head == null: return',
            '2. if index == 0:',
            '3.     temp = head; head = head.next; if head != null head.prev = null; delete temp; return',
            '4. curr = head; i = 0',
            '5. while curr != null and i < index - 1:',
            '6.     curr = curr.next; i++',
            '7. if curr == null or curr.next == null: error("Out of Bounds")',
            '8. temp = curr.next',
            '9. curr.next = temp.next',
            '10. if temp.next != null:',
            '11.    temp.next.prev = curr',
            '12. delete temp',
          ],
        };
      } else {
        return {
          title: 'Circular Linked List: Delete at Index',
          lines: [
            '1. if head == null: return',
            '2. if index == 0:',
            '3.     (See Delete from Head steps)',
            '4. curr = head; i = 0',
            '5. while curr.next != head and i < index - 1:',
            '6.     curr = curr.next; i++',
            '7. temp = curr.next',
            '8. curr.next = temp.next',
            '9. delete temp',
          ],
        };
      }

    case 'search':
      return {
        title: 'Search Value in Linked List',
        lines: [
          '1. curr = head',
          '2. index = 0',
          '3. while curr != null:',
          '4.     if curr.value == target:',
          '5.         return index // Found!',
          '6.     curr = curr.next; index++',
          '7. return -1 // Not Found',
        ],
      };

    case 'reverse':
      if (listType === 'singly' || listType === 'circular') {
        return {
          title: 'Singly/Circular Linked List: Reverse',
          lines: [
            '1. prev = null; curr = head',
            '2. while curr != null: (For CLL, until we loop back)',
            '3.     nextTemp = curr.next',
            '4.     curr.next = prev',
            '5.     prev = curr',
            '6.     curr = nextTemp',
            '7. head = prev',
          ],
        };
      } else {
        return {
          title: 'Doubly Linked List: Reverse',
          lines: [
            '1. curr = head; temp = null',
            '2. while curr != null:',
            '3.     temp = curr.prev',
            '4.     curr.prev = curr.next',
            '5.     curr.next = temp',
            '6.     curr = curr.prev',
            '7. if temp != null:',
            '8.     head = temp.prev',
          ],
        };
      }
  }
};

// 1. INSERT AT HEAD
export const generateInsertHeadSteps = (
  nodes: LinkedListNode[],
  value: number,
  listType: ListType
): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const headAddress = nodes.length > 0 ? nodes[0].address : null;

  // Step 0: Initial state
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Ready to insert value ${value} at the head of the list.`,
    pointers: { headAddress },
  });

  // Create new node
  const newNode: LinkedListNode = {
    id: 'newNode_' + Math.random().toString(36).substr(2, 9),
    value,
    address: generateAddress(),
    nextAddress: null,
    prevAddress: null,
    highlighted: true,
  };

  const withNewNode = [newNode, ...copyNodes(nodes)];

  // Step 1: Create new node
  steps.push({
    nodes: withNewNode.map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
    pseudoCodeLine: 1,
    description: `Created a new node with value ${value} at address ${newNode.address}.`,
    pointers: { headAddress, tempAddress: newNode.address },
  });

  if (listType === 'singly') {
    // Step 2: Set new node's next to current head
    newNode.nextAddress = headAddress;
    const withNextLinked = [newNode, ...copyNodes(nodes)];
    steps.push({
      nodes: withNextLinked.map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 2,
      description: `Pointed new node's next pointer to the current head (${headAddress || 'null'}).`,
      pointers: { headAddress, tempAddress: newNode.address },
      connectionHighlights: headAddress ? [{ from: newNode.address, to: headAddress, type: 'next' }] : [],
    });

    // Step 3: Set head to new node
    const finalNodes = [newNode, ...copyNodes(nodes)];
    rebuildPointers(finalNodes, 'singly');
    steps.push({
      nodes: finalNodes.map((n, i) => (i === 0 ? { ...n, pulse: true } : n)),
      pseudoCodeLine: 3,
      description: `Updated head pointer to point to the new node (${newNode.address}). Insertion completed!`,
      pointers: { headAddress: newNode.address, tempAddress: newNode.address },
    });
  } else if (listType === 'doubly') {
    // Step 2: temp.next = head
    newNode.nextAddress = headAddress;
    const withNextLinked = [newNode, ...copyNodes(nodes)];
    steps.push({
      nodes: withNextLinked.map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 2,
      description: `Pointed new node's next pointer to current head (${headAddress || 'null'}).`,
      pointers: { headAddress, tempAddress: newNode.address },
      connectionHighlights: headAddress ? [{ from: newNode.address, to: headAddress, type: 'next' }] : [],
    });

    // Step 3-4: if head != null: head.prev = temp
    if (nodes.length > 0) {
      const updatedNodes = copyNodes(nodes);
      updatedNodes[0].prevAddress = newNode.address;
      steps.push({
        nodes: [newNode, ...updatedNodes].map((n, i) => (i <= 1 ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 4,
        description: `Since current head is not null, updated current head node's prev pointer to point back to the new node.`,
        pointers: { headAddress, tempAddress: newNode.address },
        connectionHighlights: [
          { from: newNode.address, to: headAddress!, type: 'next' },
          { from: headAddress!, to: newNode.address, type: 'prev' },
        ],
      });
    } else {
      steps.push({
        nodes: [newNode],
        pseudoCodeLine: 3,
        description: `Head is null, skipping prev pointer assignment.`,
        pointers: { headAddress: null, tempAddress: newNode.address },
      });
    }

    // Step 5: head = temp
    const finalNodes = [newNode, ...copyNodes(nodes)];
    rebuildPointers(finalNodes, 'doubly');
    steps.push({
      nodes: finalNodes.map((n, i) => (i === 0 ? { ...n, pulse: true } : n)),
      pseudoCodeLine: 5,
      description: `Updated head pointer to point to the new node (${newNode.address}). Insertion completed!`,
      pointers: { headAddress: newNode.address, tempAddress: newNode.address },
    });
  } else if (listType === 'circular') {
    if (nodes.length === 0) {
      // Step 2: if head == null
      steps.push({
        nodes: [{ ...newNode }],
        pseudoCodeLine: 2,
        description: `List is empty, so we point temp.next to itself.`,
        pointers: { headAddress: null, tempAddress: newNode.address },
      });

      // Step 3: temp.next = temp
      newNode.nextAddress = newNode.address;
      steps.push({
        nodes: [{ ...newNode }],
        pseudoCodeLine: 3,
        description: `Pointed new node's next to itself (${newNode.address}).`,
        pointers: { headAddress: null, tempAddress: newNode.address },
        connectionHighlights: [{ from: newNode.address, to: newNode.address, type: 'next' }],
      });

      // Step 4: head = temp
      steps.push({
        nodes: [{ ...newNode, pulse: true }],
        pseudoCodeLine: 4,
        description: `Set head pointer to the new node. Insertion completed!`,
        pointers: { headAddress: newNode.address, tempAddress: newNode.address },
      });
    } else {
      // List is not empty
      const currNode = nodes[nodes.length - 1]; // Tail node

      // Step 5: else
      steps.push({
        nodes: [newNode, ...copyNodes(nodes)],
        pseudoCodeLine: 5,
        description: `List is not empty, preparing to traverse to the end of the circular list to update circular reference.`,
        pointers: { headAddress, tempAddress: newNode.address },
      });

      // Step 6-8: traverse to the end (find last node pointing to head)
      steps.push({
        nodes: [newNode, ...copyNodes(nodes)],
        pseudoCodeLine: 8,
        description: `Traversed list to tail node at ${currNode.address} which currently points back to head.`,
        pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
        highlightedAddresses: [currNode.address],
      });

      // Step 9: temp.next = head
      newNode.nextAddress = headAddress;
      steps.push({
        nodes: [newNode, ...copyNodes(nodes)],
        pseudoCodeLine: 9,
        description: `Pointed new node's next to the current head (${headAddress}).`,
        pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
        connectionHighlights: [{ from: newNode.address, to: headAddress!, type: 'next' }],
      });

      // Step 10: curr.next = temp
      const updatedNodes = copyNodes(nodes);
      updatedNodes[updatedNodes.length - 1].nextAddress = newNode.address;
      steps.push({
        nodes: [newNode, ...updatedNodes],
        pseudoCodeLine: 10,
        description: `Pointed tail node's next to the new node (${newNode.address}).`,
        pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
        connectionHighlights: [
          { from: newNode.address, to: headAddress!, type: 'next' },
          { from: currNode.address, to: newNode.address, type: 'next' },
        ],
      });

      // Step 11: head = temp
      const finalNodes = [newNode, ...copyNodes(nodes)];
      rebuildPointers(finalNodes, 'circular');
      steps.push({
        nodes: finalNodes.map((n, i) => (i === 0 ? { ...n, pulse: true } : n)),
        pseudoCodeLine: 11,
        description: `Set head pointer to the new node (${newNode.address}). Circular list updated successfully!`,
        pointers: { headAddress: newNode.address, tempAddress: newNode.address, currAddress: currNode.address },
      });
    }
  }

  return steps;
};

// 2. INSERT AT TAIL
export const generateInsertTailSteps = (
  nodes: LinkedListNode[],
  value: number,
  listType: ListType
): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const headAddress = nodes.length > 0 ? nodes[0].address : null;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Ready to insert value ${value} at the tail of the list.`,
    pointers: { headAddress },
  });

  // Create new node
  const newNode: LinkedListNode = {
    id: 'newNode_' + Math.random().toString(36).substr(2, 9),
    value,
    address: generateAddress(),
    nextAddress: null,
    prevAddress: null,
    highlighted: true,
  };

  // Step 1: Create node
  steps.push({
    nodes: [...copyNodes(nodes), { ...newNode }],
    pseudoCodeLine: 1,
    description: `Created new node with value ${value} at address ${newNode.address}.`,
    pointers: { headAddress, tempAddress: newNode.address },
  });

  // Step 2-3: If head is null
  if (nodes.length === 0) {
    steps.push({
      nodes: [{ ...newNode, highlighted: true }],
      pseudoCodeLine: 2,
      description: `List is empty (head == null). Pointing head to the new node.`,
      pointers: { headAddress: null, tempAddress: newNode.address },
    });

    if (listType === 'circular') {
      newNode.nextAddress = newNode.address;
    }

    steps.push({
      nodes: [{ ...newNode, pulse: true }],
      pseudoCodeLine: 3,
      description: `Head points to the new node. Tail insertion completed!`,
      pointers: { headAddress: newNode.address, tempAddress: newNode.address },
    });
    return steps;
  }

  // Traverse to tail
  // Step 4: curr = head
  steps.push({
    nodes: [...copyNodes(nodes), { ...newNode }],
    pseudoCodeLine: 4,
    description: `Initialized traversal pointer 'curr' at head (${headAddress}).`,
    pointers: { headAddress, tempAddress: newNode.address, currAddress: headAddress },
    highlightedAddresses: [headAddress!],
  });

  // Step 5-6: Traverse loop
  const tempNodes = copyNodes(nodes);
  for (let i = 0; i < tempNodes.length - 1; i++) {
    steps.push({
      nodes: [...tempNodes, { ...newNode }],
      pseudoCodeLine: 6,
      description: `Traversing... 'curr' moves to next node (${tempNodes[i + 1].address}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: tempNodes[i + 1].address },
      highlightedAddresses: [tempNodes[i + 1].address],
    });
  }

  const lastNode = tempNodes[tempNodes.length - 1];

  // Now curr is at last node
  if (listType === 'singly') {
    // Step 7: curr.next = temp
    const finalNodes = [...copyNodes(nodes), newNode];
    rebuildPointers(finalNodes, 'singly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 7,
      description: `Updated current node's next pointer to the new node (${newNode.address}). Tail insertion completed!`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: lastNode.address },
      connectionHighlights: [{ from: lastNode.address, to: newNode.address, type: 'next' }],
    });
  } else if (listType === 'doubly') {
    // Step 7: curr.next = temp
    const partialNodes = [...copyNodes(nodes), { ...newNode }];
    partialNodes[partialNodes.length - 2].nextAddress = newNode.address;

    steps.push({
      nodes: partialNodes,
      pseudoCodeLine: 7,
      description: `Updated previous tail node's next pointer to point to the new node (${newNode.address}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: lastNode.address },
      connectionHighlights: [{ from: lastNode.address, to: newNode.address, type: 'next' }],
    });

    // Step 8: temp.prev = curr
    const finalNodes = [...copyNodes(nodes), newNode];
    rebuildPointers(finalNodes, 'doubly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 8,
      description: `Pointed new node's prev pointer back to 'curr' (${lastNode.address}). Insertion completed!`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: lastNode.address },
      connectionHighlights: [
        { from: lastNode.address, to: newNode.address, type: 'next' },
        { from: newNode.address, to: lastNode.address, type: 'prev' },
      ],
    });
  } else if (listType === 'circular') {
    // Step 9: curr.next = temp
    const partialNodes = [...copyNodes(nodes), { ...newNode }];
    partialNodes[partialNodes.length - 2].nextAddress = newNode.address;

    steps.push({
      nodes: partialNodes,
      pseudoCodeLine: 9,
      description: `Updated current tail node's next pointer to the new node (${newNode.address}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: lastNode.address },
      connectionHighlights: [{ from: lastNode.address, to: newNode.address, type: 'next' }],
    });

    // Step 10: temp.next = head
    const finalNodes = [...copyNodes(nodes), newNode];
    rebuildPointers(finalNodes, 'circular');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 10,
      description: `Pointed new tail node's next back to head (${headAddress}) to maintain circular loop. Completed!`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: lastNode.address },
      connectionHighlights: [
        { from: lastNode.address, to: newNode.address, type: 'next' },
        { from: newNode.address, to: headAddress!, type: 'next' },
      ],
    });
  }

  return steps;
};

// 3. INSERT AT INDEX
export const generateInsertIndexSteps = (
  nodes: LinkedListNode[],
  value: number,
  index: number,
  listType: ListType
): SimulationStep[] => {
  // If index is 0, reuse insertHead
  if (index === 0 || nodes.length === 0) {
    return generateInsertHeadSteps(nodes, value, listType);
  }

  const steps: SimulationStep[] = [];
  const headAddress = nodes[0].address;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Preparing to insert value ${value} at index ${index}.`,
    pointers: { headAddress },
  });

  // Create new node
  const newNode: LinkedListNode = {
    id: 'newNode_' + Math.random().toString(36).substr(2, 9),
    value,
    address: generateAddress(),
    nextAddress: null,
    prevAddress: null,
    highlighted: true,
  };

  // Step 1: Create node
  steps.push({
    nodes: [...copyNodes(nodes), { ...newNode }],
    pseudoCodeLine: 1,
    description: `Created a new node with value ${value} at address ${newNode.address}.`,
    pointers: { headAddress, tempAddress: newNode.address },
  });

  // Step 4: curr = head; i = 0
  let currIndex = 0;
  let currNode = nodes[0];

  steps.push({
    nodes: [...copyNodes(nodes), { ...newNode }],
    pseudoCodeLine: 4,
    description: `Initialized traversal pointer 'curr' at head, counter i = 0.`,
    pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
    highlightedAddresses: [currNode.address],
  });

  // Step 5-6: Walk to index - 1
  const limit = Math.min(index - 1, nodes.length - 1);
  for (let i = 0; i < limit; i++) {
    currIndex++;
    currNode = nodes[currIndex];
    steps.push({
      nodes: [...copyNodes(nodes), { ...newNode }],
      pseudoCodeLine: 6,
      description: `Traversing... 'curr' moves to next node (i = ${currIndex}, address: ${currNode.address}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      highlightedAddresses: [currNode.address],
    });
  }

  // Verify bounds
  if (index - 1 >= nodes.length) {
    // Step 7: error
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 7,
      description: `Error: Index ${index} is out of bounds! List length is ${nodes.length}.`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
    });
    return steps;
  }

  const nextNodeAfterCurr = nodes[currIndex + 1];

  if (listType === 'singly') {
    // Step 8: temp.next = curr.next
    newNode.nextAddress = currNode.nextAddress;
    steps.push({
      nodes: [...copyNodes(nodes), { ...newNode }],
      pseudoCodeLine: 8,
      description: `Pointed new node's next pointer to 'curr's next node (${newNode.nextAddress || 'null'}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: newNode.nextAddress
        ? [{ from: newNode.address, to: newNode.nextAddress, type: 'next' }]
        : [],
    });

    // Step 9: curr.next = temp
    const finalNodes = [...nodes];
    finalNodes.splice(index, 0, newNode);
    rebuildPointers(finalNodes, 'singly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 9,
      description: `Updated 'curr's next pointer to point to the new node (${newNode.address}). Insertion completed!`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: [
        { from: currNode.address, to: newNode.address, type: 'next' },
        ...(newNode.nextAddress ? [{ from: newNode.address, to: newNode.nextAddress, type: 'next' as const }] : []),
      ],
    });
  } else if (listType === 'doubly') {
    // Step 8: temp.next = curr.next
    newNode.nextAddress = currNode.nextAddress;
    steps.push({
      nodes: [...copyNodes(nodes), { ...newNode }],
      pseudoCodeLine: 8,
      description: `Pointed new node's next to 'curr's next node (${newNode.nextAddress || 'null'}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: newNode.nextAddress
        ? [{ from: newNode.address, to: newNode.nextAddress, type: 'next' }]
        : [],
    });

    // Step 9-10: if curr.next != null: curr.next.prev = temp
    if (nextNodeAfterCurr) {
      const updatedNodes = copyNodes(nodes);
      updatedNodes[currIndex + 1].prevAddress = newNode.address;

      steps.push({
        nodes: [...updatedNodes, { ...newNode }],
        pseudoCodeLine: 10,
        description: `Since next node exists, updated 'curr's next node's prev pointer back to the new node (${newNode.address}).`,
        pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
        connectionHighlights: [
          { from: newNode.address, to: nextNodeAfterCurr.address, type: 'next' },
          { from: nextNodeAfterCurr.address, to: newNode.address, type: 'prev' },
        ],
      });
    } else {
      steps.push({
        nodes: [...copyNodes(nodes), { ...newNode }],
        pseudoCodeLine: 9,
        description: `Next node is null (inserting at the very end). Skipping prev pointer update on next.`,
        pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      });
    }

    // Step 11: curr.next = temp
    const step11Nodes = copyNodes(nodes);
    step11Nodes[currIndex].nextAddress = newNode.address;
    steps.push({
      nodes: [...step11Nodes, { ...newNode }],
      pseudoCodeLine: 11,
      description: `Updated 'curr's next pointer to point to the new node (${newNode.address}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: [
        { from: currNode.address, to: newNode.address, type: 'next' },
        ...(newNode.nextAddress ? [{ from: newNode.address, to: newNode.nextAddress, type: 'next' as const }] : []),
      ],
    });

    // Step 12: temp.prev = curr
    const finalNodes = [...nodes];
    finalNodes.splice(index, 0, newNode);
    rebuildPointers(finalNodes, 'doubly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 12,
      description: `Pointed new node's prev pointer back to 'curr' (${currNode.address}). Insertion completed!`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: [
        { from: currNode.address, to: newNode.address, type: 'next' },
        { from: newNode.address, to: currNode.address, type: 'prev' },
      ],
    });
  } else if (listType === 'circular') {
    // Circular SLL
    // Step 7: temp.next = curr.next
    newNode.nextAddress = currNode.nextAddress;
    steps.push({
      nodes: [...copyNodes(nodes), { ...newNode }],
      pseudoCodeLine: 7,
      description: `Pointed new node's next to 'curr's next node (${newNode.nextAddress || 'head'}).`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: newNode.nextAddress
        ? [{ from: newNode.address, to: newNode.nextAddress, type: 'next' }]
        : [],
    });

    // Step 8: curr.next = temp
    const finalNodes = [...nodes];
    finalNodes.splice(index, 0, newNode);
    rebuildPointers(finalNodes, 'circular');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 8,
      description: `Updated 'curr's next pointer to point to the new node (${newNode.address}). Insertion completed!`,
      pointers: { headAddress, tempAddress: newNode.address, currAddress: currNode.address },
      connectionHighlights: [
        { from: currNode.address, to: newNode.address, type: 'next' },
        ...(newNode.nextAddress ? [{ from: newNode.address, to: newNode.nextAddress, type: 'next' as const }] : []),
      ],
    });
  }

  return steps;
};

// 4. DELETE FROM HEAD
export const generateDeleteHeadSteps = (nodes: LinkedListNode[], listType: ListType): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  if (nodes.length === 0) {
    steps.push({
      nodes: [],
      pseudoCodeLine: 1,
      description: 'List is empty. Nothing to delete!',
      pointers: {},
    });
    return steps;
  }

  const headAddress = nodes[0].address;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Ready to delete node from head. Current head address is ${headAddress}.`,
    pointers: { headAddress },
  });

  // Step 2: temp = head
  steps.push({
    nodes: copyNodes(nodes).map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
    pseudoCodeLine: 2,
    description: `Assigned 'temp' pointer to the current head (${headAddress}).`,
    pointers: { headAddress, tempAddress: headAddress },
  });

  if (nodes.length === 1) {
    if (listType === 'circular') {
      // Step 3: if head.next == head
      steps.push({
        nodes: copyNodes(nodes).map((n) => ({ ...n, highlighted: true })),
        pseudoCodeLine: 3,
        description: `List has only 1 node, which points to itself.`,
        pointers: { headAddress, tempAddress: headAddress },
      });

      // Step 4: head = null
      steps.push({
        nodes: copyNodes(nodes).map((n) => ({ ...n, highlighted: true })),
        pseudoCodeLine: 4,
        description: `Set head pointer to null.`,
        pointers: { headAddress: null, tempAddress: headAddress },
      });
    } else {
      // Step 3: head = head.next
      steps.push({
        nodes: copyNodes(nodes).map((n) => ({ ...n, highlighted: true })),
        pseudoCodeLine: 3,
        description: `Pointed head to head.next (null).`,
        pointers: { headAddress: null, tempAddress: headAddress },
      });
    }

    // delete temp
    steps.push({
      nodes: [],
      pseudoCodeLine: listType === 'circular' ? 11 : (listType === 'doubly' ? 6 : 4),
      description: `Deallocated memory of temp node (${headAddress}). List is now empty. Deletion completed!`,
      pointers: {},
    });
    return steps;
  }

  // Multiple nodes
  const nextNode = nodes[1];

  if (listType === 'singly') {
    // Step 3: head = head.next
    steps.push({
      nodes: copyNodes(nodes).map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 3,
      description: `Moved head pointer to head.next (${nextNode.address}).`,
      pointers: { headAddress: nextNode.address, tempAddress: headAddress },
    });

    // Step 4: delete temp
    const finalNodes = copyNodes(nodes).slice(1);
    rebuildPointers(finalNodes, 'singly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 4,
      description: `Deleted old head node (${headAddress}) from memory. Deletion completed!`,
      pointers: { headAddress: nextNode.address },
    });
  } else if (listType === 'doubly') {
    // Step 3: head = head.next
    steps.push({
      nodes: copyNodes(nodes).map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 3,
      description: `Moved head pointer to head.next (${nextNode.address}).`,
      pointers: { headAddress: nextNode.address, tempAddress: headAddress },
    });

    // Step 4-5: if head != null: head.prev = null
    const step4Nodes = copyNodes(nodes);
    step4Nodes[1].prevAddress = null;

    steps.push({
      nodes: step4Nodes.map((n, i) => (i <= 1 ? { ...n, highlighted: i === 0 } : n)),
      pseudoCodeLine: 5,
      description: `Set new head node's prev pointer to null.`,
      pointers: { headAddress: nextNode.address, tempAddress: headAddress },
    });

    // Step 6: delete temp
    const finalNodes = copyNodes(nodes).slice(1);
    rebuildPointers(finalNodes, 'doubly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 6,
      description: `Deallocated old head node (${headAddress}). Deletion completed!`,
      pointers: { headAddress: nextNode.address },
    });
  } else if (listType === 'circular') {
    // Circular list deletion with multiple elements
    const tailNode = nodes[nodes.length - 1];

    // Step 6-8: traverse to tail to update pointer
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 8,
      description: `Traversing circular list to tail node at ${tailNode.address} to update its next pointer.`,
      pointers: { headAddress, tempAddress: headAddress, currAddress: tailNode.address },
      highlightedAddresses: [tailNode.address],
    });

    // Step 9: head = head.next
    steps.push({
      nodes: copyNodes(nodes).map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 9,
      description: `Updated head pointer to point to next node (${nextNode.address}).`,
      pointers: { headAddress: nextNode.address, tempAddress: headAddress, currAddress: tailNode.address },
    });

    // Step 10: curr.next = head
    const step10Nodes = copyNodes(nodes);
    step10Nodes[step10Nodes.length - 1].nextAddress = nextNode.address;

    steps.push({
      nodes: step10Nodes.map((n, i) => (i === 0 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 10,
      description: `Pointed tail node's next back to the new head (${nextNode.address}).`,
      pointers: { headAddress: nextNode.address, tempAddress: headAddress, currAddress: tailNode.address },
      connectionHighlights: [{ from: tailNode.address, to: nextNode.address, type: 'next' }],
    });

    // Step 11: delete temp
    const finalNodes = copyNodes(nodes).slice(1);
    rebuildPointers(finalNodes, 'circular');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 11,
      description: `Deleted old head node (${headAddress}) from memory. Deletion completed!`,
      pointers: { headAddress: nextNode.address },
    });
  }

  return steps;
};

// 5. DELETE FROM TAIL
export const generateDeleteTailSteps = (nodes: LinkedListNode[], listType: ListType): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  if (nodes.length === 0) {
    steps.push({
      nodes: [],
      pseudoCodeLine: 1,
      description: 'List is empty. Nothing to delete!',
      pointers: {},
    });
    return steps;
  }

  const headAddress = nodes[0].address;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Preparing to delete the last node from the list.`,
    pointers: { headAddress },
  });

  // Single element
  if (nodes.length === 1) {
    steps.push({
      nodes: copyNodes(nodes).map((n) => ({ ...n, highlighted: true })),
      pseudoCodeLine: 2,
      description: `List contains only one node.`,
      pointers: { headAddress, tempAddress: headAddress },
    });

    steps.push({
      nodes: [],
      pseudoCodeLine: 3,
      description: `Set head pointer to null and deallocated node (${headAddress}). List is empty.`,
      pointers: {},
    });
    return steps;
  }

  const lastIndex = nodes.length - 1;
  const lastNode = nodes[lastIndex];

  if (listType === 'singly') {
    // Step 4: prev = null; curr = head
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 4,
      description: `Initialized 'prev' as null, and 'curr' at head (${headAddress}).`,
      pointers: { headAddress, currAddress: headAddress, prevAddress: null },
      highlightedAddresses: [headAddress],
    });

    // Step 5-6: traverse
    let prevNode = nodes[0];
    let currNode = nodes[1];

    for (let i = 1; i < lastIndex; i++) {
      prevNode = nodes[i - 1];
      currNode = nodes[i];
      steps.push({
        nodes: copyNodes(nodes),
        pseudoCodeLine: 6,
        description: `Traversing... 'prev' moves to ${prevNode.address}, 'curr' moves to ${currNode.address}.`,
        pointers: { headAddress, currAddress: currNode.address, prevAddress: prevNode.address },
        highlightedAddresses: [currNode.address, prevNode.address],
      });
    }

    // Now curr points to tail, prev points to tail-1
    const secondToLast = nodes[nodes.length - 2];

    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 5,
      description: `Reached the end. 'curr' is now at tail (${lastNode.address}) and 'prev' is at ${secondToLast.address}.`,
      pointers: { headAddress, currAddress: lastNode.address, prevAddress: secondToLast.address },
      highlightedAddresses: [lastNode.address, secondToLast.address],
    });

    // Step 7: prev.next = null
    const step7Nodes = copyNodes(nodes);
    step7Nodes[step7Nodes.length - 2].nextAddress = null;

    steps.push({
      nodes: step7Nodes.map((n, idx) => (idx === lastIndex ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 7,
      description: `Severed connection: Set 'prev' next pointer to null.`,
      pointers: { headAddress, currAddress: lastNode.address, prevAddress: secondToLast.address },
    });

    // Step 8: delete curr
    const finalNodes = copyNodes(nodes).slice(0, -1);
    rebuildPointers(finalNodes, 'singly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 8,
      description: `Deleted tail node (${lastNode.address}) from memory. Tail deletion completed!`,
      pointers: { headAddress },
    });
  } else if (listType === 'doubly') {
    // Step 4: curr = head
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 4,
      description: `Initialized traversal pointer 'curr' at head (${headAddress}).`,
      pointers: { headAddress, currAddress: headAddress },
      highlightedAddresses: [headAddress],
    });

    // Step 5-6: Traverse to end
    for (let i = 1; i < nodes.length; i++) {
      steps.push({
        nodes: copyNodes(nodes),
        pseudoCodeLine: 6,
        description: `Traversing... 'curr' moves to ${nodes[i].address}.`,
        pointers: { headAddress, currAddress: nodes[i].address },
        highlightedAddresses: [nodes[i].address],
      });
    }

    // curr is at lastNode
    const secondToLast = nodes[nodes.length - 2];

    // Step 7: curr.prev.next = null
    const step7Nodes = copyNodes(nodes);
    step7Nodes[step7Nodes.length - 2].nextAddress = null;

    steps.push({
      nodes: step7Nodes.map((n, idx) => (idx === lastIndex ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 7,
      description: `Severed connection: Set second-to-last node's next pointer to null.`,
      pointers: { headAddress, currAddress: lastNode.address },
    });

    // Step 8: delete curr
    const finalNodes = copyNodes(nodes).slice(0, -1);
    rebuildPointers(finalNodes, 'doubly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 8,
      description: `Deleted tail node (${lastNode.address}) from memory. Tail deletion completed!`,
      pointers: { headAddress },
    });
  } else if (listType === 'circular') {
    // Circular
    // Step 4: prev = null; curr = head
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 4,
      description: `Initialized 'prev' as null, and 'curr' at head (${headAddress}).`,
      pointers: { headAddress, currAddress: headAddress, prevAddress: null },
      highlightedAddresses: [headAddress],
    });

    // Step 5-6: Walk to tail
    for (let i = 1; i < nodes.length; i++) {
      const prevNode = nodes[i - 1];
      const currNode = nodes[i];
      steps.push({
        nodes: copyNodes(nodes),
        pseudoCodeLine: 6,
        description: `Traversing... 'prev' at ${prevNode.address}, 'curr' at ${currNode.address}.`,
        pointers: { headAddress, currAddress: currNode.address, prevAddress: prevNode.address },
        highlightedAddresses: [currNode.address, prevNode.address],
      });
    }

    const secondToLast = nodes[nodes.length - 2];

    // Step 7: prev.next = head
    const step7Nodes = copyNodes(nodes);
    step7Nodes[step7Nodes.length - 2].nextAddress = headAddress;

    steps.push({
      nodes: step7Nodes.map((n, idx) => (idx === lastIndex ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 7,
      description: `Severed old tail pointer: Set 'prev' next pointer back to head (${headAddress}).`,
      pointers: { headAddress, currAddress: lastNode.address, prevAddress: secondToLast.address },
      connectionHighlights: [{ from: secondToLast.address, to: headAddress, type: 'next' }],
    });

    // Step 8: delete curr
    const finalNodes = copyNodes(nodes).slice(0, -1);
    rebuildPointers(finalNodes, 'circular');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 8,
      description: `Deallocated tail node (${lastNode.address}). Circular list updated.`,
      pointers: { headAddress },
    });
  }

  return steps;
};

// 6. DELETE AT INDEX
export const generateDeleteIndexSteps = (
  nodes: LinkedListNode[],
  index: number,
  listType: ListType
): SimulationStep[] => {
  if (index === 0 || nodes.length <= 1) {
    return generateDeleteHeadSteps(nodes, listType);
  }

  if (index >= nodes.length) {
    return [{
      nodes: copyNodes(nodes),
      pseudoCodeLine: 7,
      description: `Error: Index ${index} is out of bounds!`,
      pointers: {},
    }];
  }

  const steps: SimulationStep[] = [];
  const headAddress = nodes[0].address;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Preparing to delete node at index ${index}.`,
    pointers: { headAddress },
  });

  // Step 4: curr = head; i = 0
  let currIndex = 0;
  let currNode = nodes[0];

  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 4,
    description: `Initialized traversal pointer 'curr' at head, index counter i = 0.`,
    pointers: { headAddress, currAddress: currNode.address },
    highlightedAddresses: [currNode.address],
  });

  // Step 5-6: walk to index - 1
  for (let i = 0; i < index - 1; i++) {
    currIndex++;
    currNode = nodes[currIndex];
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 6,
      description: `Traversing... 'curr' moves to ${currNode.address} (i = ${currIndex}).`,
      pointers: { headAddress, currAddress: currNode.address },
      highlightedAddresses: [currNode.address],
    });
  }

  // Node to delete
  const targetNode = nodes[currIndex + 1];
  const nextNodeAfterTarget = nodes[currIndex + 2] || null;

  // Step 8: temp = curr.next
  steps.push({
    nodes: copyNodes(nodes).map((n, idx) => (idx === currIndex + 1 ? { ...n, highlighted: true } : n)),
    pseudoCodeLine: listType === 'circular' ? 7 : 8,
    description: `Assigned 'temp' pointer to the node to be deleted (${targetNode.address}).`,
    pointers: { headAddress, currAddress: currNode.address, tempAddress: targetNode.address },
  });

  if (listType === 'singly') {
    // Step 9: curr.next = temp.next
    const step9Nodes = copyNodes(nodes);
    step9Nodes[currIndex].nextAddress = targetNode.nextAddress;

    steps.push({
      nodes: step9Nodes.map((n, idx) => (idx === currIndex + 1 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 9,
      description: `Connected 'curr' node's next pointer directly to 'temp's next node (${targetNode.nextAddress || 'null'}).`,
      pointers: { headAddress, currAddress: currNode.address, tempAddress: targetNode.address },
      connectionHighlights: targetNode.nextAddress
        ? [{ from: currNode.address, to: targetNode.nextAddress, type: 'next' }]
        : [],
    });

    // Step 10: delete temp
    const finalNodes = [...nodes];
    finalNodes.splice(index, 1);
    rebuildPointers(finalNodes, 'singly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 10,
      description: `Deallocated memory of the deleted node (${targetNode.address}). Deletion completed!`,
      pointers: { headAddress, currAddress: currNode.address },
    });
  } else if (listType === 'doubly') {
    // Step 9: curr.next = temp.next
    const step9Nodes = copyNodes(nodes);
    step9Nodes[currIndex].nextAddress = targetNode.nextAddress;

    steps.push({
      nodes: step9Nodes.map((n, idx) => (idx === currIndex + 1 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 9,
      description: `Set 'curr' node's next pointer to point to 'temp's next node (${targetNode.nextAddress || 'null'}).`,
      pointers: { headAddress, currAddress: currNode.address, tempAddress: targetNode.address },
      connectionHighlights: targetNode.nextAddress
        ? [{ from: currNode.address, to: targetNode.nextAddress, type: 'next' }]
        : [],
    });

    // Step 10-11: if temp.next != null: temp.next.prev = curr
    if (nextNodeAfterTarget) {
      const step10Nodes = copyNodes(nodes);
      step10Nodes[currIndex].nextAddress = targetNode.nextAddress;
      step10Nodes[currIndex + 2].prevAddress = currNode.address;

      steps.push({
        nodes: step10Nodes.map((n, idx) => (idx === currIndex + 1 ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 11,
        description: `Since next node exists, updated 'temp's next node's prev pointer back to 'curr' (${currNode.address}).`,
        pointers: { headAddress, currAddress: currNode.address, tempAddress: targetNode.address },
        connectionHighlights: [
          { from: currNode.address, to: nextNodeAfterTarget.address, type: 'next' },
          { from: nextNodeAfterTarget.address, to: currNode.address, type: 'prev' },
        ],
      });
    } else {
      steps.push({
        nodes: copyNodes(nodes).map((n, idx) => (idx === currIndex + 1 ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 10,
        description: `'temp' node was at the end. Skipping prev pointer redirection.`,
        pointers: { headAddress, currAddress: currNode.address, tempAddress: targetNode.address },
      });
    }

    // Step 12: delete temp
    const finalNodes = [...nodes];
    finalNodes.splice(index, 1);
    rebuildPointers(finalNodes, 'doubly');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 12,
      description: `Deallocated memory of deleted node (${targetNode.address}). Deletion completed!`,
      pointers: { headAddress, currAddress: currNode.address },
    });
  } else if (listType === 'circular') {
    // Circular
    // Step 8: curr.next = temp.next
    const step8Nodes = copyNodes(nodes);
    step8Nodes[currIndex].nextAddress = targetNode.nextAddress;

    steps.push({
      nodes: step8Nodes.map((n, idx) => (idx === currIndex + 1 ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 8,
      description: `Connected 'curr' node's next directly to 'temp's next (${targetNode.nextAddress || 'head'}).`,
      pointers: { headAddress, currAddress: currNode.address, tempAddress: targetNode.address },
      connectionHighlights: [{ from: currNode.address, to: targetNode.nextAddress!, type: 'next' }],
    });

    // Step 9: delete temp
    const finalNodes = [...nodes];
    finalNodes.splice(index, 1);
    rebuildPointers(finalNodes, 'circular');

    steps.push({
      nodes: finalNodes,
      pseudoCodeLine: 9,
      description: `Deallocated memory of deleted node (${targetNode.address}). Circular list updated.`,
      pointers: { headAddress, currAddress: currNode.address },
    });
  }

  return steps;
};

// 7. SEARCH VALUE
export const generateSearchSteps = (
  nodes: LinkedListNode[],
  target: number,
  listType: ListType
): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  const headAddress = nodes.length > 0 ? nodes[0].address : null;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Ready to search for value ${target} in the linked list.`,
    pointers: { headAddress },
  });

  if (nodes.length === 0) {
    steps.push({
      nodes: [],
      pseudoCodeLine: 7,
      description: `List is empty! Value ${target} not found.`,
      pointers: {},
    });
    return steps;
  }

  // Step 1: curr = head; index = 0
  let currNode = nodes[0];
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 1,
    description: `Initialized 'curr' pointer at head (${headAddress}), search index = 0.`,
    pointers: { headAddress, currAddress: currNode.address },
    highlightedAddresses: [currNode.address],
  });

  let foundIndex = -1;
  const loopLimit = listType === 'circular' ? nodes.length : nodes.length;

  for (let i = 0; i < loopLimit; i++) {
    currNode = nodes[i];

    // Step 3-4: Compare value
    steps.push({
      nodes: copyNodes(nodes).map((n, idx) => (idx === i ? { ...n, highlighted: true } : n)),
      pseudoCodeLine: 4,
      description: `Comparing current node value (${currNode.value}) with target (${target}).`,
      pointers: { headAddress, currAddress: currNode.address },
      highlightedAddresses: [currNode.address],
    });

    if (currNode.value === target) {
      foundIndex = i;
      // Step 5: Found!
      steps.push({
        nodes: copyNodes(nodes).map((n, idx) => (idx === i ? { ...n, pulse: true } : n)),
        pseudoCodeLine: 5,
        description: `Match found! Value ${target} is located at index ${i} (Address: ${currNode.address}).`,
        pointers: { headAddress, currAddress: currNode.address },
        highlightedAddresses: [currNode.address],
      });
      break;
    }

    // Step 6: curr = curr.next; index++
    if (i < nodes.length - 1) {
      const nextNode = nodes[i + 1];
      steps.push({
        nodes: copyNodes(nodes),
        pseudoCodeLine: 6,
        description: `Value doesn't match. Moving 'curr' to the next node (${nextNode.address}) and incrementing index.`,
        pointers: { headAddress, currAddress: nextNode.address },
        highlightedAddresses: [nextNode.address],
      });
    }
  }

  if (foundIndex === -1) {
    // Step 7: Not found
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 7,
      description: `Finished list traversal. Value ${target} was not found in the list. Returning -1.`,
      pointers: {},
    });
  }

  return steps;
};

// 8. REVERSE LIST
export const generateReverseSteps = (nodes: LinkedListNode[], listType: ListType): SimulationStep[] => {
  const steps: SimulationStep[] = [];
  if (nodes.length <= 1) {
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 1,
      description: `List has ${nodes.length} element(s). No reversal needed!`,
      pointers: nodes.length > 0 ? { headAddress: nodes[0].address } : {},
    });
    return steps;
  }

  const originalHeadAddress = nodes[0].address;

  // Step 0: Initial
  steps.push({
    nodes: copyNodes(nodes),
    pseudoCodeLine: 0,
    description: `Ready to reverse the linked list in-place.`,
    pointers: { headAddress: originalHeadAddress },
  });

  if (listType === 'singly' || listType === 'circular') {
    // Step 1: prev = null; curr = head
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 1,
      description: `Initialized 'prev' pointer to null, 'curr' to head (${originalHeadAddress}).`,
      pointers: { headAddress: originalHeadAddress, currAddress: originalHeadAddress, prevAddress: null },
      highlightedAddresses: [originalHeadAddress],
    });

    let prevAddr: string | null = null;
    let currAddr: string | null = originalHeadAddress;
    const currentNodesState = copyNodes(nodes);

    // To reverse we step through each node
    for (let i = 0; i < nodes.length; i++) {
      const nodeIndex = i;
      const currNode = currentNodesState[nodeIndex];
      const nextTempAddr = listType === 'circular' && i === nodes.length - 1 ? originalHeadAddress : nodes[i + 1]?.address || null;

      // Step 3: nextTemp = curr.next
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 3,
        description: `Stored the next node's address in variable 'nextTemp' (${nextTempAddr || 'null'}).`,
        pointers: {
          headAddress: originalHeadAddress,
          currAddress: currAddr,
          prevAddress: prevAddr,
          tempAddress: nextTempAddr,
        },
        highlightedAddresses: currAddr ? [currAddr] : [],
      });

      // Step 4: curr.next = prev
      currNode.nextAddress = prevAddr;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 4,
        description: `Replaced next pointer of node ${currNode.address} to point backward to 'prev' (${prevAddr || 'null'}).`,
        pointers: {
          headAddress: originalHeadAddress,
          currAddress: currAddr,
          prevAddress: prevAddr,
          tempAddress: nextTempAddr,
        },
        connectionHighlights: prevAddr ? [{ from: currNode.address, to: prevAddr, type: 'next' }] : [],
      });

      // Step 5: prev = curr
      prevAddr = currAddr;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 5,
        description: `Moved 'prev' pointer forward to the current node (${currAddr}).`,
        pointers: {
          headAddress: originalHeadAddress,
          currAddress: currAddr,
          prevAddress: prevAddr,
          tempAddress: nextTempAddr,
        },
      });

      // Step 6: curr = nextTemp
      currAddr = nextTempAddr;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === prevAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 6,
        description: `Moved 'curr' pointer forward to 'nextTemp' (${currAddr || 'null'}).`,
        pointers: {
          headAddress: originalHeadAddress,
          currAddress: currAddr,
          prevAddress: prevAddr,
          tempAddress: null,
        },
      });
    }

    // For circular, we need to make sure the loop is rebuilt correctly
    // Step 7: head = prev
    const finalReversedNodes = [...nodes].reverse();
    rebuildPointers(finalReversedNodes, listType);

    steps.push({
      nodes: finalReversedNodes.map((n, i) => (i === 0 ? { ...n, pulse: true } : n)),
      pseudoCodeLine: 7,
      description: `Reversal completed! Set head pointer to the last visited node (${prevAddr}). Pointers have been cleanly reversed.`,
      pointers: { headAddress: prevAddr },
    });
  } else if (listType === 'doubly') {
    // Doubly Reversal: swap prev & next for all nodes
    // Step 1: curr = head; temp = null
    steps.push({
      nodes: copyNodes(nodes),
      pseudoCodeLine: 1,
      description: `Initialized 'curr' pointer at head (${originalHeadAddress}) and 'temp' helper to null.`,
      pointers: { headAddress: originalHeadAddress, currAddress: originalHeadAddress, tempAddress: null },
      highlightedAddresses: [originalHeadAddress],
    });

    const currentNodesState = copyNodes(nodes);
    let currAddr: string | null = originalHeadAddress;
    let tempAddr: string | null = null;

    for (let i = 0; i < nodes.length; i++) {
      const node = currentNodesState[i];
      currAddr = node.address;

      // Step 3: temp = curr.prev
      tempAddr = node.prevAddress;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 3,
        description: `Saved node ${currAddr}'s 'prev' pointer in 'temp' (${tempAddr || 'null'}).`,
        pointers: { headAddress: originalHeadAddress, currAddress: currAddr, tempAddress: tempAddr },
      });

      // Step 4: curr.prev = curr.next
      const oldNext = node.nextAddress;
      node.prevAddress = oldNext;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 4,
        description: `Swapped pointers: Set node ${currAddr}'s 'prev' pointer to point to next node (${oldNext || 'null'}).`,
        pointers: { headAddress: originalHeadAddress, currAddress: currAddr, tempAddress: tempAddr },
        connectionHighlights: oldNext ? [{ from: node.address, to: oldNext, type: 'prev' }] : [],
      });

      // Step 5: curr.next = temp
      node.nextAddress = tempAddr;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 5,
        description: `Swapped pointers: Set node ${currAddr}'s 'next' pointer to point backward to 'temp' (${tempAddr || 'null'}).`,
        pointers: { headAddress: originalHeadAddress, currAddress: currAddr, tempAddress: tempAddr },
        connectionHighlights: tempAddr ? [{ from: node.address, to: tempAddr, type: 'next' }] : [],
      });

      // Step 6: curr = curr.prev
      // Note that curr.prev is now pointing to the old next, so we move forward in the original list
      const nextAddress = oldNext;
      steps.push({
        nodes: currentNodesState.map((n) => (n.address === currAddr ? { ...n, highlighted: true } : n)),
        pseudoCodeLine: 6,
        description: `Moved 'curr' pointer to the next unswapped node (${nextAddress || 'null'}).`,
        pointers: { headAddress: originalHeadAddress, currAddress: nextAddress, tempAddress: tempAddr },
      });
    }

    // Step 7: if temp != null
    steps.push({
      nodes: currentNodesState,
      pseudoCodeLine: 7,
      description: `All nodes swapped. Checking if 'temp' is not null to identify the new head.`,
      pointers: { headAddress: originalHeadAddress, tempAddress: tempAddr },
    });

    // Step 8: head = temp.prev
    // temp.prev is the previous node of the last temp, which points to the new head node
    const finalReversedNodes = [...nodes].reverse();
    rebuildPointers(finalReversedNodes, 'doubly');
    const newHeadAddr = finalReversedNodes[0].address;

    steps.push({
      nodes: finalReversedNodes.map((n, i) => (i === 0 ? { ...n, pulse: true } : n)),
      pseudoCodeLine: 8,
      description: `Reversal completed! Updated head pointer to ${newHeadAddr}. All doubly linked pointers reversed!`,
      pointers: { headAddress: newHeadAddr },
    });
  }

  return steps;
};
