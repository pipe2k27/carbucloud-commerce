"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  brandsAtom,
  setBrandsState,
  setBrandsLoading,
  setBrandsError,
} from "@/jotai/brands-atom.jotai";
import { useAtomValue } from "jotai";
import { getAllBrandsAction } from "@/service/actions/brands.actions";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const brandsState = useAtomValue(brandsAtom);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchBrands = useCallback(async () => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setBrandsLoading(true);
    setBrandsError(null);

    try {
      const response = await getAllBrandsAction();

      if (!isMountedRef.current) return;

      if (response.status === 200 && response.data) {
        setBrandsState(response.data);
        retryCountRef.current = 0; // Reset retry count on success
      } else {
        const errorMessage = response.message || "Failed to fetch brands";
        console.error("[BrandsProvider] Failed to fetch brands:", errorMessage);
        setBrandsError(errorMessage);

        // Retry if we haven't exceeded max retries
        if (retryCountRef.current < MAX_RETRIES - 1) {
          retryCountRef.current += 1;
          retryTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchBrands();
            }
          }, RETRY_DELAY);
        }
      }
    } catch (error) {
      if (!isMountedRef.current) return;

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An error occurred while fetching brands";
      console.error("[BrandsProvider] Error fetching brands:", error);
      setBrandsError(errorMessage);

      // Retry if we haven't exceeded max retries
      if (retryCountRef.current < MAX_RETRIES - 1) {
        retryCountRef.current += 1;
        retryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchBrands();
          }
        }, RETRY_DELAY);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Only fetch if brands are not already loaded and we're not currently loading
    const shouldFetch =
      brandsState.brands.length === 0 &&
      !brandsState.isLoading &&
      retryCountRef.current < MAX_RETRIES;

    if (shouldFetch) {
      fetchBrands();
    }

    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [brandsState.brands.length, brandsState.isLoading, fetchBrands]);

  return <>{children}</>;
}
