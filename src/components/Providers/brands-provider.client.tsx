"use client";

import { useEffect, useRef, useCallback } from "react";
import { getAllBrandsAction } from "@/service/actions/brands.actions";
import { getCompanyCountryAction } from "@/service/actions/companies.actions";
import {
  brandsAtom,
  setBrandsState,
  setBrandsLoading,
  setBrandsError,
} from "@/jotai/brands-atom.jotai";
import {
  companyCountryAtom,
  setCompanyCountryState,
  setCompanyCountryLoading,
  setCompanyCountryError,
} from "@/jotai/company-country-atom.jotai";
import { useAtomValue } from "jotai";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const brandsState = useAtomValue(brandsAtom);
  const companyCountryState = useAtomValue(companyCountryAtom);

  // Brands retry state
  const brandsRetryCountRef = useRef(0);
  const brandsRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Company country retry state
  const companyCountryRetryCountRef = useRef(0);
  const companyCountryRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMountedRef = useRef(true);

  const fetchBrands = useCallback(async () => {
    // Clear any pending retry
    if (brandsRetryTimeoutRef.current) {
      clearTimeout(brandsRetryTimeoutRef.current);
      brandsRetryTimeoutRef.current = null;
    }

    setBrandsLoading(true);
    setBrandsError(null);

    try {
      const response = await getAllBrandsAction();

      if (!isMountedRef.current) return;

      if (response.status === 200 && response.data) {
        setBrandsState(response.data);
        brandsRetryCountRef.current = 0; // Reset retry count on success
      } else {
        const errorMessage = response.message || "Failed to fetch brands";
        console.error(
          "[AppDataProvider] Failed to fetch brands:",
          errorMessage
        );
        setBrandsError(errorMessage);

        // Retry if we haven't exceeded max retries
        if (brandsRetryCountRef.current < MAX_RETRIES - 1) {
          brandsRetryCountRef.current += 1;
          brandsRetryTimeoutRef.current = setTimeout(() => {
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
      console.error("[AppDataProvider] Error fetching brands:", error);
      setBrandsError(errorMessage);

      // Retry if we haven't exceeded max retries
      if (brandsRetryCountRef.current < MAX_RETRIES - 1) {
        brandsRetryCountRef.current += 1;
        brandsRetryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchBrands();
          }
        }, RETRY_DELAY);
      }
    }
  }, []);

  const fetchCompanyCountry = useCallback(async () => {
    // Clear any pending retry
    if (companyCountryRetryTimeoutRef.current) {
      clearTimeout(companyCountryRetryTimeoutRef.current);
      companyCountryRetryTimeoutRef.current = null;
    }

    setCompanyCountryLoading(true);
    setCompanyCountryError(null);

    try {
      const response = await getCompanyCountryAction();

      if (!isMountedRef.current) return;

      if (response.status === 200 && response.data) {
        setCompanyCountryState(response.data as "AR" | "UY");
        companyCountryRetryCountRef.current = 0; // Reset retry count on success
      } else {
        const errorMessage =
          response.message || "Failed to fetch company country";
        console.error(
          "[AppDataProvider] Failed to fetch company country:",
          errorMessage
        );
        setCompanyCountryError(errorMessage);

        // Retry if we haven't exceeded max retries
        if (companyCountryRetryCountRef.current < MAX_RETRIES - 1) {
          companyCountryRetryCountRef.current += 1;
          companyCountryRetryTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              fetchCompanyCountry();
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
          : "An error occurred while fetching company country";
      console.error("[AppDataProvider] Error fetching company country:", error);
      setCompanyCountryError(errorMessage);

      // Retry if we haven't exceeded max retries
      if (companyCountryRetryCountRef.current < MAX_RETRIES - 1) {
        companyCountryRetryCountRef.current += 1;
        companyCountryRetryTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            fetchCompanyCountry();
          }
        }, RETRY_DELAY);
      }
    }
  }, []);

  // Fetch brands effect
  useEffect(() => {
    isMountedRef.current = true;

    // Only fetch if brands are not already loaded and we're not currently loading
    const shouldFetch =
      brandsState.brands.length === 0 &&
      !brandsState.isLoading &&
      brandsRetryCountRef.current < MAX_RETRIES;

    if (shouldFetch) {
      fetchBrands();
    }

    return () => {
      isMountedRef.current = false;
      if (brandsRetryTimeoutRef.current) {
        clearTimeout(brandsRetryTimeoutRef.current);
        brandsRetryTimeoutRef.current = null;
      }
    };
  }, [brandsState.brands.length, brandsState.isLoading, fetchBrands]);

  // Fetch company country effect
  useEffect(() => {
    isMountedRef.current = true;

    // Only fetch if country is not already loaded and we're not currently loading
    const shouldFetch =
      companyCountryState.country === null &&
      !companyCountryState.isLoading &&
      companyCountryRetryCountRef.current < MAX_RETRIES;

    if (shouldFetch) {
      fetchCompanyCountry();
    }

    return () => {
      isMountedRef.current = false;
      if (companyCountryRetryTimeoutRef.current) {
        clearTimeout(companyCountryRetryTimeoutRef.current);
        companyCountryRetryTimeoutRef.current = null;
      }
    };
  }, [
    companyCountryState.country,
    companyCountryState.isLoading,
    fetchCompanyCountry,
  ]);

  return <>{children}</>;
}
