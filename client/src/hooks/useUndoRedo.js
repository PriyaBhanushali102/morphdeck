import { useState, useCallback } from "react";

const MAX_HISTORY = 50;

const useUndoRedo = (initialState) => {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initialState);
  const [future, setFuture] = useState([]);

  const set = useCallback((newStateOrUpdater) => {
    setPresent((currPresent) => {
      const newState =
        typeof newStateOrUpdater === "function"
          ? newStateOrUpdater(currPresent)
          : newStateOrUpdater;

      if (newState === currPresent) return currPresent;
      setPast((currPast) => [...currPast.slice(-MAX_HISTORY), currPresent]);
      setFuture([]);
      return newState;
    });
  }, []);

  const undo = useCallback(() => {
    setPast((currPast) => {
      if (currPast.length === 0) return currPast;
      const previous = currPast[currPast.length - 1];
      const newPast = currPast.slice(0, currPast.length - 1);
      setPresent((currPresent) => {
        setFuture((currFuture) => [currPresent, ...currFuture]);
        return previous;
      });

      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((currFuture) => {
      if (currFuture.length === 0) return currFuture;
      const next = currFuture[0];
      const newFuture = currFuture.slice(1);
      setPresent((currPresent) => {
        setPast((currPast) => [...currPast, currPresent]);
        return next;
      });
      return newFuture;
    });
  }, []);

  return {
    state: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
};

export default useUndoRedo;
