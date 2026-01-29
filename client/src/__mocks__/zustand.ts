import * as zustand from "zustand";
import { act } from "@testing-library/react";
import { vi } from "vitest";

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof zustand>("zustand");

// a variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  console.log("zustand create mock called");
  return typeof stateCreator === "function"
    ? createUncurried(stateCreator)
    : createUncurried(stateCreator);
}) as typeof zustand.create;

export const createStore = (<T>(stateCreator: zustand.StateCreator<T>) => {
  console.log("zustand createStore mock called");
  return typeof stateCreator === "function"
    ? createUncurried(stateCreator)
    : createUncurried(stateCreator);
}) as unknown as typeof zustand.createStore;
