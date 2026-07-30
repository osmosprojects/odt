/**
 * usePreviousOffer.ts
 * Enterprise Hook for Previous Offer Lookup using structured DTO & State Machine.
 * Single Owner & Source of Truth for Previous Contract lifecycle.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { PreviousOffer, PreviousOfferResult, PreviousOfferState } from '../types';
import { fetchPreviousOffer, PreviousOfferLookupPayload } from '../customerApi';

interface UsePreviousOfferReturn {
  state: PreviousOfferState;
  data: PreviousOfferResult | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const INITIAL_STATE: PreviousOfferState = {
  status: 'idle',
  customerCode: null,
  requestId: 0,
  data: null,
  error: null,
};

function logLifecycle(
  caller: string,
  reason: string,
  prevState: PreviousOfferState,
  nextState: PreviousOfferState
) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[PreviousOffer Lifecycle] ${new Date().toISOString()} | CustCode: ${nextState.customerCode || 'NONE'} | ReqID: #${nextState.requestId}`,
      {
        prevState: prevState.status,
        nextState: nextState.status,
        caller,
        reason,
        dataFound: !!nextState.data?.found,
      }
    );
  }
}

const NOT_FOUND_OBJECT: PreviousOfferResult = Object.freeze({
  found: false,
  message: 'No Previous Offer Found',
});

export function usePreviousOffer(
  criteria: PreviousOfferLookupPayload | string | null | undefined,
): UsePreviousOfferReturn {
  const [state, setState] = useState<PreviousOfferState>(INITIAL_STATE);
  const requestIdRef = useRef<number>(0);
  const stateRef = useRef<PreviousOfferState>(INITIAL_STATE);
  stateRef.current = state;

  const updateState = useCallback(
    (nextState: PreviousOfferState, caller: string, reason: string) => {
      logLifecycle(caller, reason, stateRef.current, nextState);
      setState(nextState);
    },
    []
  );

  const getStr = (val: any): string => (val !== undefined && val !== null ? String(val).trim() : '');

  const primaryCode = typeof criteria === 'string'
    ? criteria
    : (getStr(criteria?.customerCode) || getStr(criteria?.custId) || getStr(criteria?.executiveCode) || getStr(criteria?.customerName) || '');

  console.log("Hook Criteria", criteria);
  console.log("Primary Code", primaryCode);

  const payload: PreviousOfferLookupPayload = typeof criteria === 'string'
    ? { executiveCode: criteria }
    : criteria || {};

  const hasValue = Boolean(
    getStr(payload.customerCode) ||
    getStr(payload.custId) ||
    getStr(payload.executiveCode) ||
    getStr(payload.customerName)
  );

  const load = useCallback(async (currentPayload: PreviousOfferLookupPayload, targetCode: string, currentReqId: number) => {
    try {
      console.log("Entering load()", currentPayload);
      const result = await fetchPreviousOffer(currentPayload);
      console.log("API Result", result);
      console.log("Result Found", result.found);
      console.log("Offer ID", (result as any)?.offerId);

      // PART 4: Request Protection — Ignore stale requests
      if (currentReqId !== requestIdRef.current) {
        logLifecycle('usePreviousOffer', `Ignored stale response for req #${currentReqId} (active is #${requestIdRef.current})`, stateRef.current, stateRef.current);
        return;
      }

      if (result.found) {
        console.log("Updating State -> loaded");
        const normalize = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const nameKey = normalize(currentPayload.customerName || '').slice(0, 12);
        const topMatches = !nameKey || normalize(result.customerName || '').includes(nameKey);

        let matchedData: PreviousOffer = result;
        if (!topMatches && result.history && result.history.length > 0) {
          const match = result.history.find((h) =>
            normalize(h.customerName || '').includes(nameKey)
          );
          if (match) {
            matchedData = { ...result, ...match, found: true };
          }
        }

        updateState(
          {
            status: 'loaded',
            customerCode: targetCode,
            requestId: currentReqId,
            data: matchedData,
            error: null,
          },
          'usePreviousOffer',
          'Successfully loaded previous contract'
        );
      } else {
        console.log("Updating State -> not_found");
        // PART 5: Prevent Overwrite — Do not overwrite loaded state for the same customer
        if (stateRef.current.status === 'loaded' && stateRef.current.customerCode === targetCode) {
          logLifecycle('usePreviousOffer', `Ignored not_found overwrite for already loaded customer ${targetCode}`, stateRef.current, stateRef.current);
          return;
        }

        updateState(
          {
            status: 'not_found',
            customerCode: targetCode,
            requestId: currentReqId,
            data: null,
            error: null,
          },
          'usePreviousOffer',
          'No previous offer found'
        );
      }
    } catch (err: unknown) {
      if (currentReqId !== requestIdRef.current) return;

      if (stateRef.current.status === 'loaded' && stateRef.current.customerCode === targetCode) {
        logLifecycle('usePreviousOffer', `Ignored error overwrite for already loaded customer ${targetCode}`, stateRef.current, stateRef.current);
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to load previous offer data';

      updateState(
        {
          status: 'error',
          customerCode: targetCode,
          requestId: currentReqId,
          data: null,
          error: errorMessage,
        },
        'usePreviousOffer',
        'Request error encountered'
      );
    }
  }, [updateState]);

  useEffect(() => {
    if (!hasValue) {
      if (stateRef.current.status !== 'idle') {
        updateState(INITIAL_STATE, 'usePreviousOffer', 'Customer cleared -> Reset to IDLE');
      }
      return;
    }

    // PART 6: Reset ONLY when customer identifier changes
    if (stateRef.current.customerCode !== primaryCode) {
      requestIdRef.current += 1;
      const nextReqId = requestIdRef.current;

      updateState(
        {
          status: 'loading',
          customerCode: primaryCode,
          requestId: nextReqId,
          data: null,
          error: null,
        },
        'usePreviousOffer',
        `New customer selected (${primaryCode}) -> Set to LOADING`
      );

      load(payload, primaryCode, nextReqId);
    }
  }, [primaryCode, hasValue, load, updateState]);

  const refresh = useCallback(() => {
    if (!hasValue || !primaryCode) return;
    requestIdRef.current += 1;
    const nextReqId = requestIdRef.current;
    updateState(
      {
        status: 'loading',
        customerCode: primaryCode,
        requestId: nextReqId,
        data: stateRef.current.data,
        error: null,
      },
      'usePreviousOffer',
      'Manual refresh requested'
    );
    load(payload, primaryCode, nextReqId);
  }, [hasValue, primaryCode, payload, load, updateState]);

  const legacyData: PreviousOfferResult | null = state.data
    ? state.data
    : state.status === 'not_found'
      ? NOT_FOUND_OBJECT
      : null;

  return {
    state,
    data: legacyData,
    loading: state.status === 'loading',
    error: state.error,
    refresh,
  };
}
