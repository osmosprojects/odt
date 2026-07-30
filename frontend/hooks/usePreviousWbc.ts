"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";

export interface PreviousWbcItem {
  offerId: number;
  offerCode: string;
  customerName: string;
  segment: string;
  startDate: string | null;
  endDate: string | null;
  effectiveEndDate: string | null;
  closureStatus: string;
}

export interface PreviousWbcPerformance {
  offerId: number;
  offerCode: string;
  customerName: string;
  segment: string;
  volume: number;
  months: number;
  periodFrom: string;
  periodTo: string;
  investment: number;
  gmpl: number;
  skuRebate: number;
  foc: number;
  targetIncentive: number;
  marketing: number;
  others: number;
  totalInvestment: number;
  rsPerLitre: number;
  remark: string;
  prevOfferCommitment?: number;
  prevOfferActual?: number;
  prevGmpl?: number;
  skuLevelRebate?: number;
  totalFocValue?: number;
  rsLtrInvestment?: number;
  additionalInput?: number;
  signOnBonus?: number;
}

export function usePreviousWbc() {
  const [wbcOffers, setWbcOffers] = useState<PreviousWbcItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedOfferDetails, setSelectedOfferDetails] = useState<PreviousWbcPerformance | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const fetchWbcOffers = useCallback(async (executiveCode?: string) => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const response = await api.getPreviousWbcOffers(executiveCode);
      const data = response?.success && Array.isArray(response?.data) ? response.data : [];
      setWbcOffers(data);
      return data;
    } catch (err: any) {
      console.error("[usePreviousWbc] Error fetching previous WBC offers:", err);
      setListError(err.message || "Failed to fetch previous WBC offers");
      setWbcOffers([]);
      return [];
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  const fetchWbcOfferDetails = useCallback(async (offerId: string | number) => {
    if (!offerId) {
      setSelectedOfferDetails(null);
      return null;
    }
    setIsLoadingDetails(true);
    setDetailsError(null);
    try {
      const numericId = typeof offerId === "string" ? parseInt(offerId, 10) : offerId;
      if (isNaN(numericId)) {
        throw new Error("Invalid offer ID");
      }
      const response = await api.getPreviousWbcOfferDetails(numericId);
      const data = response?.success ? response.data : null;
      setSelectedOfferDetails(data);
      return data;
    } catch (err: any) {
      console.error(`[usePreviousWbc] Error fetching details for offerId ${offerId}:`, err);
      setDetailsError(err.message || "Failed to fetch offer performance details");
      setSelectedOfferDetails(null);
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  const clearSelectedDetails = useCallback(() => {
    setSelectedOfferDetails(null);
    setDetailsError(null);
  }, []);

  return {
    wbcOffers,
    isLoadingList,
    listError,
    fetchWbcOffers,
    selectedOfferDetails,
    isLoadingDetails,
    detailsError,
    fetchWbcOfferDetails,
    clearSelectedDetails,
  };
}
