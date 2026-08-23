"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { BotWorkflow, BotNode, BotConnection } from "@/components/bots/types";

interface HistoryState {
  workflow: BotWorkflow;
  timestamp: number;
}

export function useUndoRedo(initialWorkflow: BotWorkflow, maxHistory = 50) {
  const [history, setHistory] = useState<HistoryState[]>([{ workflow: initialWorkflow, timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isRestoring = useRef(false);
  const lastSave = useRef(0);
  const saveDebounce = useRef<NodeJS.Timeout | null>(null);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushHistory = useCallback((workflow: BotWorkflow) => {
    const now = Date.now();
    
    // Debounce rapid saves (e.g., during drag)
    if (now - lastSave.current < 100) {
      if (saveDebounce.current) clearTimeout(saveDebounce.current);
      saveDebounce.current = setTimeout(() => {
        pushHistory(workflow);
      }, 150);
      return;
    }
    
    lastSave.current = now;

    if (isRestoring.current) return;

    const newState: HistoryState = { workflow, timestamp: now };
    
    setHistory(prev => {
      // If we're not at the end, truncate future history
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory);
      }
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [historyIndex, maxHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isRestoring.current = true;
      setHistoryIndex(prev => prev - 1);
      // Reset flag after state update
      setTimeout(() => { isRestoring.current = false; }, 0);
    }
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isRestoring.current = true;
      setHistoryIndex(prev => prev + 1);
      setTimeout(() => { isRestoring.current = false; }, 0);
    }
  }, [historyIndex, history.length]);

  const goToHistoryIndex = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      isRestoring.current = true;
      setHistoryIndex(index);
      setTimeout(() => { isRestoring.current = false; }, 0);
    }
  }, [history.length]);

  const clearHistory = useCallback((newWorkflow: BotWorkflow) => {
    setHistory([{ workflow: newWorkflow, timestamp: Date.now() }]);
    setHistoryIndex(0);
  }, []);

  const getCurrentWorkflow = useCallback(() => {
    return history[historyIndex]?.workflow || initialWorkflow;
  }, [history, historyIndex, initialWorkflow]);

  return {
    history,
    historyIndex,
    canUndo,
    canRedo,
    pushHistory,
    undo,
    redo,
    goToHistoryIndex,
    clearHistory,
    getCurrentWorkflow,
  };
}