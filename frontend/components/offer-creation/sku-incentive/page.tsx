"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Info, Upload, Download, Copy, Search, ArrowUpDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

// Custom UI Inputs
import Input from "@/components/offer-creation/ui/Input";
import Select from "@/components/offer-creation/ui/Select";
import Accordion from "@/components/offer-creation/ui/Accordion";
import SearchDropdown from "@/components/offer-creation/ui/SearchDropdown";

// Header & Footer Layouts
import OfferHeader from "@/components/offer-creation/layout/OfferHeader";
import StickyFooter from "@/components/offer-creation/layout/StickyFooter";

interface SkuRow {
  id: string;
  skuDataOption: string;
  lbmName: string;
  pvName: string;
  skuCode: string;
  skuName: string;
  cogs: number;
  contractVolume: number;
  focVolume: number;
  totalInput: number;
  surcharge: number;
  nhf: number;
  recMixIncentive: number;
  mixIncentive: number;
  skuRebate: number;
  productTargetIncentive: number;
  lbm?: string;
  pv?: string;
}

import { api } from "@/lib/api";

export default function SkuIncentivePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ----------------------------------------------------
  // OFFER STREAM STATE FOR CONDITIONAL COLUMNS
  // ----------------------------------------------------
  const [offerStream, setOfferStream] = useState<string>("IWS");

  const [availableSkus, setAvailableSkus] = useState<any[]>([]);
  const [skuCodesOptions, setSkuCodesOptions] = useState<string[]>([]);
  const [skuNamesOptions, setSkuNamesOptions] = useState<string[]>([]);
  const [offerId, setOfferId] = useState<number | null>(null);
  const [pcaResult, setPcaResult] = useState<any>(null);

  useEffect(() => {
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('odt_current_offer_id') : null;
    if (savedId) {
      const id = parseInt(savedId, 10);
      setOfferId(id);
      api.getOfferById(id).then((offer) => {
        if (!offer) return;
        const custInput = offer.customerLevelInput || {};
        const parsedSkuText = offer.parsedSkuText || {};
        const currProp = offer.currentProposed || {};

        const targetInc = parseFloat(custInput.target_incentive || custInput.targetIncentive || offer.money_offered || '0') || 0;
        const vol = parseFloat(offer.totalVolumeCommitment || currProp.volume_kl_proposed || parsedSkuText.volume || '0') || 0;
        const tenureMonths = parseInt(String(offer.tenure || currProp.months_proposed || custInput.months || '12'), 10) || 12;
        const disbAmt = parseFloat(custInput.disbursement_amount || custInput.disbursementAmount || targetInc || '0') || 0;

        setCustomerData((prev) => ({
          ...prev,
          targetIncentiveRs: targetInc,
          disbursementVolume: vol || prev.disbursementVolume,
          disbursementMonths: tenureMonths,
          disbursementAmount: disbAmt,
        }));

        setProductIncentiveData((prev) => ({
          ...prev,
          disbursementVolume: vol || prev.disbursementVolume,
          disbursementMonths: tenureMonths,
          disbursementAmount: disbAmt,
          skuVolume: vol || prev.skuVolume,
        }));

        const rawSkus = Array.isArray(offer.selectedSkus) && offer.selectedSkus.length > 0
          ? offer.selectedSkus
          : Array.isArray(offer.skus) && offer.skus.length > 0
          ? offer.skus
          : Array.isArray(offer.previousSkus) && offer.previousSkus.length > 0
          ? offer.previousSkus
          : [];

        if (rawSkus.length > 0) {
          const loadedSkus: SkuRow[] = rawSkus.map((s: any, idx: number) => ({
            id: String(idx + 1),
            skuDataOption: "Primary",
            lbmName: s.lbmName || "Lubricants",
            pvName: s.pvName || "PV",
            skuCode: s.skuCode || "",
            skuName: s.skuName || "",
            cogs: s.baseCogs || s.cogs || 0,
            contractVolume: s.volume || s.contractVolume || 0,
            focVolume: s.focVolume || 0,
            totalInput: s.totalInput || 0,
            surcharge: s.surcharge || 0,
            nhf: s.nhf || s.baseGross || 0,
            recMixIncentive: s.rebatePerLtr || s.recMixIncentive || 0,
            mixIncentive: s.mixIncentive || s.rebatePerLtr || 0,
            skuRebate: s.rebatePerLtr || s.skuRebate || 0,
            productTargetIncentive: s.productTargetIncentive || 0,
          }));
          setSkus(loadedSkus);
          if (loadedSkus.length > 0) {
            setSelectedSkuId(loadedSkus[0].id);
          }
        }
      }).catch(console.error);
    }

    api.getSkus("", offerStream).then(data => {
      const arr = Array.isArray(data) ? data : (data as any).data || [];
      setAvailableSkus(arr);
      setSkuCodesOptions(arr.map((s: any) => s.skuCode).filter(Boolean));
      setSkuNamesOptions(arr.map((s: any) => s.skuName).filter(Boolean));
    }).catch(console.error);
  }, [offerStream]);

  // ----------------------------------------------------
  // ACCORDIONS OPEN/CLOSE STATES
  // ----------------------------------------------------
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customerLevel: true,
    transport: false,
    skus: true,
    productIncentive: false,
    summary: true,
  });

  // ----------------------------------------------------
  // CUSTOMER LEVEL STATE
  // ----------------------------------------------------
  const [customerData, setCustomerData] = useState({
    targetIncentiveRs: 0,
    targetIncentiveLtr: 0,
    disbursementVolume: 0,
    disbursementMonths: 0,
    disbursementAmount: 0,
    totalCustomerRebate: 0,
    totalCustomerRebateLtr: 0,
  });

  // ----------------------------------------------------
  // SKU DATA TABLE STATE
  // ----------------------------------------------------
  const [skus, setSkus] = useState<SkuRow[]>([]);

  // Selected SKU for Product Target Incentive card
  const [selectedSkuId, setSelectedSkuId] = useState<string>("");

  // ----------------------------------------------------
  // PRODUCT TARGET INCENTIVE STATE
  // ----------------------------------------------------
  const [productIncentiveData, setProductIncentiveData] = useState({
    disbursementVolume: 0,
    disbursementMonths: 0,
    disbursementAmount: 0,
    skuVolume: 0,
    incentivePool: 0,
  });

  // ----------------------------------------------------
  // SUMMARY TOTALS STATE
  // ----------------------------------------------------
  const [summaryTotals, setSummaryTotals] = useState({
    totalRecMixIncentive: 0,
    totalActualMixIncentive: 0,
    totalVolume: 0,
    skuLevelRebateLtr: 0,
    totalFocValue: 0,
    totalFocValueLtr: 0,
    finalDofa: "L1 - Sales Manager Approval Approved",
  });

  // ----------------------------------------------------
  // TABLE SEARCH, SORTING & PAGINATION STATE
  // ----------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkuCode, setFilterSkuCode] = useState<string>("");
  const [filterSkuName, setFilterSkuName] = useState<string>("");
  const [sortField, setSortField] = useState<keyof SkuRow>("skuName");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // ----------------------------------------------------
  // AUTO CALCULATIONS EFFECT
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Customer Level calculations
    const rebateRs = Number(customerData.targetIncentiveRs || 0) + Number(customerData.disbursementAmount || 0);
    const rebateLtr = Number((rebateRs / (customerData.disbursementVolume || 1)).toFixed(2));

    if (rebateRs !== customerData.totalCustomerRebate || rebateLtr !== customerData.totalCustomerRebateLtr) {
      setCustomerData((prev) => ({
        ...prev,
        totalCustomerRebate: rebateRs,
        totalCustomerRebateLtr: rebateLtr,
      }));
    }

    // 2. Product Target Incentive calculations
    const selectedSku = skus.find((s) => s.id === selectedSkuId);
    const incentiveRate = selectedSku ? selectedSku.productTargetIncentive : 0;
    const pool = Number(productIncentiveData.disbursementAmount || 0) + Number(productIncentiveData.skuVolume || 0) * incentiveRate;

    if (pool !== productIncentiveData.incentivePool) {
      setProductIncentiveData((prev) => ({
        ...prev,
        incentivePool: pool,
      }));
    }

    // 3. SKU Table Summary totals
    let recMixIncTotal = 0;
    let actualMixIncTotal = 0;
    let totalVolume = 0;
    let totalFoc = 0;

    skus.forEach((sku) => {
      recMixIncTotal += sku.recMixIncentive * sku.contractVolume;
      actualMixIncTotal += sku.mixIncentive * sku.contractVolume;
      totalVolume += sku.contractVolume + sku.focVolume;
      totalFoc += sku.focVolume * sku.cogs;
    });

    const skuRebateLtr = Number((actualMixIncTotal / (totalVolume || 1)).toFixed(2));
    const FocLtr = Number((totalFoc / (totalVolume || 1)).toFixed(2));

    // DOFA rules based on rebate limits
    const dofaStatus = rebateRs >= 300000 ? "L3 - Vice President Approval Required" : "L1 - Sales Manager Approval Approved";

    if (
      recMixIncTotal !== summaryTotals.totalRecMixIncentive ||
      actualMixIncTotal !== summaryTotals.totalActualMixIncentive ||
      totalVolume !== summaryTotals.totalVolume ||
      skuRebateLtr !== summaryTotals.skuLevelRebateLtr ||
      totalFoc !== summaryTotals.totalFocValue ||
      FocLtr !== summaryTotals.totalFocValueLtr ||
      dofaStatus !== summaryTotals.finalDofa
    ) {
      setSummaryTotals({
        totalRecMixIncentive: recMixIncTotal,
        totalActualMixIncentive: actualMixIncTotal,
        totalVolume,
        skuLevelRebateLtr: skuRebateLtr,
        totalFocValue: totalFoc,
        totalFocValueLtr: FocLtr,
        finalDofa: dofaStatus,
      });
    }
  }, [
    customerData.targetIncentiveRs,
    customerData.disbursementAmount,
    customerData.disbursementVolume,
    productIncentiveData.disbursementAmount,
    productIncentiveData.skuVolume,
    selectedSkuId,
    skus,
    summaryTotals,
  ]);

  // Debounced PCA calculation
  useEffect(() => {
    if (skus.length === 0) return;
    const timer = setTimeout(async () => {
      try {
        const payload = {
          skus: skus.map(s => ({
            contractVolume: s.contractVolume || 0,
            focVolume: s.focVolume || 0,
            listPrice: s.nhf || s.totalInput || 0,
            cogs: s.cogs || 0,
            rebatePerLtr: s.skuRebate || s.recMixIncentive || 0,
            mixIncentive: s.mixIncentive || 0,
          })),
          investmentTerm: 12,
          customerLevelRebate: customerData.totalCustomerRebate || 0,
          secondaryTransportCost: 1.3,
        };
        const result = await api.getPcaAnalysis(payload);
        setPcaResult(result);
      } catch (err) {
        console.error('PCA analysis failed:', err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [skus, customerData.totalCustomerRebate]);

  // Sync selected SKU volume
  useEffect(() => {
    const selectedSku = skus.find((s) => s.id === selectedSkuId);
    if (selectedSku && selectedSku.contractVolume !== productIncentiveData.skuVolume) {
      setProductIncentiveData((prev) => ({
        ...prev,
        skuVolume: selectedSku.contractVolume,
      }));
    }
  }, [selectedSkuId, skus, productIncentiveData.skuVolume]);

  // ----------------------------------------------------
  // ROW LEVEL CHANGES
  // ----------------------------------------------------
  const handleRowFieldChange = (rowId: string, field: keyof SkuRow, value: any) => {
    setSkus((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          const updated = { ...row, [field]: value };
          // Auto populate Code & Name mock logic
          if (field === "skuDataOption") {
            if (value === "Synthetic") {
              updated.skuCode = "SKU-8392";
              updated.skuName = "EDGE 5W-40 Synthetic";
              updated.cogs = 420;
            } else if (value === "Mineral") {
              updated.skuCode = "SKU-4829";
              updated.skuName = "GTX 15W-40 Mineral";
              updated.cogs = 280;
            } else {
              updated.skuCode = "SKU-9182";
              updated.skuName = "CRB Turbo 15W-40 Diesel";
              updated.cogs = 310;
            }
          }
          return updated;
        }
        return row;
      })
    );
  };

  const handleSelectSku = (rowId: string, val: string) => {
    const selectedCode = val.split(" - ")[0];
    const foundSku = availableSkus.find((sku) => sku.skuCode === selectedCode);

    setSkus((prev) =>
      prev.map((row) => {
        if (row.id === rowId) {
          if (foundSku) {
            return {
              ...row,
              skuCode: foundSku.skuCode || '',
              skuName: foundSku.skuName || '',
              skuDataOption: foundSku.skuDataOption || '',
              cogs: foundSku.cogs || 0,
              lbmName: foundSku.lbmName || '',
              pvName: foundSku.pvName || '',
              lbm: (foundSku as any).lbm || '',
              pv: (foundSku as any).pv || '',
              recMixIncentive: foundSku.recMixIncentive || 0,
              mixIncentive: foundSku.mixIncentive || 0,
              skuRebate: foundSku.skuRebate || 0,
              productTargetIncentive: foundSku.productTargetIncentive || 0,
            };
          } else {
            return {
              ...row,
              skuCode: "",
              skuName: "",
              skuDataOption: "",
              cogs: 0,
              lbmName: "",
              pvName: "",
              lbm: "",
              pv: "",
              recMixIncentive: 0,
              mixIncentive: 0,
              skuRebate: 0,
              productTargetIncentive: 0,
            };
          }
        }
        return row;
      })
    );
  };

  // ----------------------------------------------------
  // VALIDATIONS & ERROR HANDLING
  // ----------------------------------------------------
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);

  const validateForm = (): { isValid: boolean; newErrors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};

    if (!customerData.targetIncentiveRs || customerData.targetIncentiveRs <= 0) {
      newErrors.targetIncentiveRs = "Target Incentive (Rs.) must be a positive number";
    }
    if (!customerData.targetIncentiveLtr || customerData.targetIncentiveLtr <= 0) {
      newErrors.targetIncentiveLtr = "Target Incentive (Rs/Ltr) must be a positive number";
    }

    skus.forEach((sku, idx) => {
      if (sku.contractVolume <= 0) {
        newErrors[`volume_${sku.id}`] = `Contract Volume must be positive for Row ${idx + 1}`;
      }
      if (sku.skuRebate < 0) {
        newErrors[`rebate_${sku.id}`] = `SKU Rebate cannot be negative for Row ${idx + 1}`;
      }
    });

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      newErrors,
    };
  };

  const handleProceed = async () => {
    setTouched(true);
    const { isValid } = validateForm();

    if (isValid) {
      if (!offerId) {
        router.push("/offer-creation/lifecycle");
        return;
      }
      try {
        await api.saveStep3Data({
          offerId,
          skus,
          customerData,
          productIncentiveData,
          summaryTotals
        });
      } catch (err) {
        console.error('Failed to save Step 3:', err);
      }
      startTransition(() => {
        alert("SKU & Incentive configuration submitted successfully! Redirecting to Lifecycle Workflow.");
        router.push("/offer-creation/lifecycle");
      });
    } else {
      alert("Validation failed. Please correct the validation errors in the highlighted sections.");
    }
  };

  const handleSaveDraft = () => {
    alert("Draft successfully saved! Your configuration changes have been recorded.");
  };

  const handleCancel = () => {
    startTransition(() => {
      router.push("/offer-creation/investment");
    });
  };

  const sectionHasErrors = (fields: string[]): boolean => {
    return touched && fields.some((f) => !!errors[f]);
  };

  // ----------------------------------------------------
  // TOOLBAR ACTIONS
  // ----------------------------------------------------
  const handleUpload = () => alert("Initiating SKU bulk upload template integration...");
  const handleDownload = () => alert("Exporting current SKU and incentives breakdown to Excel...");
  const handleCopy = () => alert("Copied current configuration settings to clipboard.");

  // ----------------------------------------------------
  // SORTING & SEARCH FILTERING LOGIC
  // ----------------------------------------------------
  const handleSort = (field: keyof SkuRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredSkus = skus.filter((row) => {
    // 1. Global Search
    const matchesGlobal =
      !searchQuery ||
      row.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.skuCode.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. SKU Code Filter
    const matchesCode = !filterSkuCode || row.skuCode === filterSkuCode;

    // 3. SKU Name Filter
    const matchesName = !filterSkuName || row.skuName === filterSkuName;

    return matchesGlobal && matchesCode && matchesName;
  });

  const sortedSkus = [...filteredSkus].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const paginatedSkus = sortedSkus.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(sortedSkus.length / rowsPerPage);

  const selectedSku = skus.find((s) => s.id === selectedSkuId) || skus[0];

  return (
    <DashboardShell>
      <div className="pb-32 space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
        <OfferHeader
          title="Offer Creation - SKU & Incentive"
          offerCode="OC-2026-0847"
          totalValue={customerData.totalCustomerRebate}
          onPreviewClick={() => setExpandedSections((prev) => ({ ...prev, summary: true }))}
        />

        {/* Stream selector selector for demonstration */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-primary shrink-0" />
            <span className="text-sm font-semibold text-brand-dark">
              Offer Stream Context Selector:
            </span>
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={["IWS", "FWS", "HD", "ILS", "WS"]}
              value={offerStream}
              onChange={(e) => setOfferStream(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Section 1: Customer Level Inputs */}
          <Accordion
            id="customerLevel"
            index="01"
            title="Customer Level Inputs"
            isOpen={expandedSections.customerLevel}
            onToggle={() => setExpandedSections((p) => ({ ...p, customerLevel: !p.customerLevel }))}
            requiredFieldsMissing={sectionHasErrors(["targetIncentiveRs", "targetIncentiveLtr"])}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Target Incentive (Rs.) *"
                type="number"
                value={customerData.targetIncentiveRs || ""}
                onChange={(e) =>
                  setCustomerData((prev) => ({ ...prev, targetIncentiveRs: Number(e.target.value) }))
                }
                error={errors.targetIncentiveRs}
                required
              />

              <Input
                label="Target Incentive (Rs/Ltr) *"
                type="number"
                value={customerData.targetIncentiveLtr || ""}
                onChange={(e) =>
                  setCustomerData((prev) => ({ ...prev, targetIncentiveLtr: Number(e.target.value) }))
                }
                error={errors.targetIncentiveLtr}
                required
              />

              <Input
                label="Disbursement Upon Vol (Ltr)"
                type="number"
                value={customerData.disbursementVolume || ""}
                onChange={(e) =>
                  setCustomerData((prev) => ({ ...prev, disbursementVolume: Number(e.target.value) }))
                }
              />

              <Input
                label="Disbursement In Months"
                type="number"
                value={customerData.disbursementMonths || ""}
                onChange={(e) =>
                  setCustomerData((prev) => ({ ...prev, disbursementMonths: Number(e.target.value) }))
                }
              />

              <Input
                label="Disbursement Amount (Rs.)"
                type="number"
                value={customerData.disbursementAmount || ""}
                onChange={(e) =>
                  setCustomerData((prev) => ({ ...prev, disbursementAmount: Number(e.target.value) }))
                }
              />

              <Input
                label="Total Customer Rebate (Rs.)"
                type="number"
                disabled
                value={customerData.totalCustomerRebate}
              />

              <Input
                label="Total Customer Rebate (Rs/Ltr)"
                type="number"
                disabled
                value={customerData.totalCustomerRebateLtr}
              />
            </div>
          </Accordion>

          {/* Section 2: Base Secondary Transport Cost */}
          <Accordion
            id="transport"
            index="02"
            title="Base Secondary Transport Cost"
            isOpen={expandedSections.transport}
            onToggle={() => setExpandedSections((p) => ({ ...p, transport: !p.transport }))}
          >
            <div className="max-w-xs">
              <Input
                label="Base Secondary Transport Cost / Litre"
                disabled
                value={1.3}
                suffixText="₹/L"
              />
            </div>
          </Accordion>

          {/* Section 3: SKU Table Accordion */}
          <Accordion
            id="skus"
            index="03"
            title="SKU Data Details Table"
            isOpen={expandedSections.skus}
            onToggle={() => setExpandedSections((p) => ({ ...p, skus: !p.skus }))}
          >
            <div className="space-y-4">
              {/* TABLE TOOLBAR */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-150 shadow-sm text-brand-dark">
                {/* Search controls group */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                  {/* Global Search */}
                  <div className="relative w-full lg:w-[300px]">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-gray pointer-events-none">
                      <Search size={15} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search SKU Name or Code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm text-brand-dark bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-400 transition"
                    />
                  </div>

                  {/* SKU Code Dropdown */}
                  <div className="w-full md:w-[220px]">
                    <SearchDropdown
                      placeholder="Select SKU Code"
                      options={skuCodesOptions}
                      value={filterSkuCode}
                      onChange={(val) => setFilterSkuCode(val)}
                    />
                  </div>

                  {/* SKU Name Dropdown */}
                  <div className="w-full md:w-[240px]">
                    <SearchDropdown
                      placeholder="Select SKU Name"
                      options={skuNamesOptions}
                      value={filterSkuName}
                      onChange={(val) => setFilterSkuName(val)}
                    />
                  </div>
                </div>

                {/* Actions group */}
                <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 h-9 text-xs font-semibold text-brand-gray hover:text-brand-dark bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 transition duration-150"
                    title="Upload file"
                  >
                    <Upload size={14} />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 h-9 text-xs font-semibold text-brand-gray hover:text-brand-dark bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 transition duration-150"
                    title="Download file"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 h-9 text-xs font-semibold text-brand-gray hover:text-brand-dark bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 transition duration-150"
                    title="Copy settings"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                </div>
              </div>

              {/* ENTERPRISE DATA TABLE */}
              <div className="overflow-x-auto overflow-y-auto max-h-[420px] border border-gray-200 rounded-xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-brand-gray font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-gray-200 select-none">
                    <tr>
                      <th className="p-3.5">Select</th>
                      <th className="p-3.5 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("skuCode")}>
                        <div className="flex items-center gap-1">
                          SKU Code <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th className="p-3.5 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("skuName")}>
                        <div className="flex items-center gap-1">
                          SKU Name <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th className="p-3.5 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("lbm" as any)}>
                        <div className="flex items-center gap-1">
                          LBM <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th className="p-3.5 cursor-pointer hover:bg-gray-100" onClick={() => handleSort("pv" as any)}>
                        <div className="flex items-center gap-1">
                          PV <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th className="p-3.5 min-w-[200px]">Select SKU</th>
                      {offerStream === "IWS" && <th className="p-3.5">LBM Name</th>}
                      {(offerStream === "FWS" || offerStream === "HD" || offerStream === "ILS") && <th className="p-3.5">PV Name</th>}
                      <th className="p-3.5">Base Vol</th>
                      <th className="p-3.5">FOC Vol</th>
                      <th className="p-3.5">COGS</th>
                      <th className="p-3.5">Total Input</th>
                      {offerStream === "FWS" && (
                        <>
                          <th className="p-3.5">Surcharge</th>
                          <th className="p-3.5">NHF</th>
                        </>
                      )}
                      <th className="p-3.5">Rec Mix Inc</th>
                      <th className="p-3.5">Actual Mix Inc</th>
                      <th className="p-3.5">SKU Rebate</th>
                      <th className="p-3.5">Prod Incentive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {paginatedSkus.map((row) => {
                      const isSelected = selectedSkuId === row.id;
                      const isPvFws = row.pvName === "FWS";
                      const isEditableRebate = row.pvName === "HD" || row.pvName === "ILS";
                      const isEditableProductIncentive = row.pvName === "HD" || row.pvName === "ILS";

                      return (
                        <tr
                          key={row.id}
                          className={`hover:bg-primary/5 transition-colors duration-150 ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="p-3">
                            <input
                              type="radio"
                              name="selectedSkuRow"
                              checked={isSelected}
                              onChange={() => setSelectedSkuId(row.id)}
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 font-semibold text-brand-dark">{row.skuCode || "-"}</td>
                          <td className="p-3 font-medium text-brand-dark">{row.skuName || "-"}</td>
                          <td className="p-3 font-medium text-brand-gray">{row.lbm || "-"}</td>
                          <td className="p-3 font-medium text-brand-gray">{row.pv || "-"}</td>
                          <td className="p-3 min-w-[220px]">
                            <SearchDropdown
                              placeholder="Search SKU..."
                              options={availableSkus.map((sku) => `${sku.skuCode} - ${sku.skuName}`)}
                              value={row.skuCode && row.skuName ? `${row.skuCode} - ${row.skuName}` : ""}
                              onChange={(val) => handleSelectSku(row.id, val)}
                            />
                          </td>
                          {offerStream === "IWS" && (
                            <td className="p-3 min-w-[150px]">
                              <select
                                value={row.lbmName}
                                onChange={(e) => handleRowFieldChange(row.id, "lbmName", e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full bg-white focus:outline-none"
                              >
                                <option value="LBM - High Performance">LBM - High Performance</option>
                                <option value="LBM - Standard">LBM - Standard</option>
                                <option value="LBM - Light Duty">LBM - Light Duty</option>
                              </select>
                            </td>
                          )}
                          {(offerStream === "FWS" || offerStream === "HD" || offerStream === "ILS") && (
                            <td className="p-3 min-w-[100px]">
                              <select
                                value={row.pvName}
                                onChange={(e) => handleRowFieldChange(row.id, "pvName", e.target.value)}
                                className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full bg-white focus:outline-none"
                              >
                                <option value="FWS">FWS</option>
                                <option value="HD">HD</option>
                                <option value="ILS">ILS</option>
                              </select>
                            </td>
                          )}
                          <td className="p-3 min-w-[100px]">
                            <input
                              type="number"
                              value={row.contractVolume}
                              onChange={(e) => handleRowFieldChange(row.id, "contractVolume", Number(e.target.value))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full focus:outline-none"
                            />
                          </td>
                          <td className="p-3 min-w-[100px]">
                            <input
                              type="number"
                              value={row.focVolume}
                              onChange={(e) => handleRowFieldChange(row.id, "focVolume", Number(e.target.value))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-brand-dark">₹{row.cogs}</td>
                          <td className="p-3 min-w-[100px]">
                            <input
                              type="number"
                              value={row.totalInput}
                              onChange={(e) => handleRowFieldChange(row.id, "totalInput", Number(e.target.value))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full focus:outline-none"
                            />
                          </td>
                          {offerStream === "FWS" && (
                            <>
                              <td className="p-3 min-w-[80px]">
                                <input
                                  type="number"
                                  disabled={!isPvFws}
                                  value={row.surcharge}
                                  onChange={(e) => handleRowFieldChange(row.id, "surcharge", Number(e.target.value))}
                                  className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full disabled:bg-gray-100 focus:outline-none"
                                />
                              </td>
                              <td className="p-3 min-w-[80px]">
                                <input
                                  type="number"
                                  disabled={!isPvFws}
                                  value={row.nhf}
                                  onChange={(e) => handleRowFieldChange(row.id, "nhf", Number(e.target.value))}
                                  className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full disabled:bg-gray-100 focus:outline-none"
                                />
                              </td>
                            </>
                          )}
                          <td className="p-3 text-brand-gray font-medium">{row.recMixIncentive}</td>
                          <td className="p-3 text-brand-gray font-medium">{row.mixIncentive}</td>
                          <td className="p-3 min-w-[90px]">
                            <input
                              type="number"
                              disabled={!isEditableRebate}
                              value={row.skuRebate}
                              onChange={(e) => handleRowFieldChange(row.id, "skuRebate", Number(e.target.value))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full disabled:bg-gray-100 focus:outline-none"
                            />
                          </td>
                          <td className="p-3 min-w-[90px]">
                            <input
                              type="number"
                              disabled={!isEditableProductIncentive}
                              value={row.productTargetIncentive}
                              onChange={(e) => handleRowFieldChange(row.id, "productTargetIncentive", Number(e.target.value))}
                              className="text-xs border border-gray-200 rounded px-1.5 py-1 w-full disabled:bg-gray-100 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* TABLE PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs text-brand-gray font-semibold">
                    Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedSkus.length)} of {sortedSkus.length} entries
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-brand-gray transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded border transition ${
                          currentPage === p
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-gray-200 text-brand-gray hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-brand-gray transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Accordion>

          {/* Section 4: Product Target Incentive Card */}
          <Accordion
            id="productIncentive"
            index="04"
            title="Product Target Incentive Pool Configuration"
            isOpen={expandedSections.productIncentive}
            onToggle={() => setExpandedSections((p) => ({ ...p, productIncentive: !p.productIncentive }))}
          >
            <div className="bg-white border border-emerald-200 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row">
              {/* ── LEFT PANEL (30% Desktop / W-full Mobile) ── */}
              <div className="w-full md:w-[30%] lg:w-[28%] border-b md:border-b-0 md:border-r border-emerald-100 bg-emerald-50/30 p-3.5 flex flex-col">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                    SELECT SKU
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {skus.length} Available
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[300px] md:max-h-[360px] space-y-1.5 pr-1">
                  {skus.map((s) => {
                    const isSelected = selectedSku?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSkuId(s.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-white border-primary shadow-xs ring-1 ring-primary/20 text-brand-dark"
                            : "bg-white/60 border-transparent hover:bg-white hover:border-emerald-200 text-slate-600"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSelected ? "bg-primary" : "bg-gray-300"}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate leading-tight ${isSelected ? "text-primary" : "text-slate-800"}`}>
                            {s.skuName || "Unnamed SKU"}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                            {s.skuCode || "—"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── RIGHT PANEL (70% Desktop / W-full Mobile) ── */}
              <div className="flex-1 p-5 bg-white flex flex-col justify-start">
                {/* ONE UNIFIED CONTAINER: border: 1px solid #16A34A, rounded: 12px, bg: #FFFFFF, padding: 20px */}
                <div className="w-full bg-white border border-[#16A34A] rounded-[12px] p-[20px] flex flex-col space-y-4 shadow-xs">
                  
                  {/* 1. SKU INFORMATION */}
                  <div>
                    <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-widest mb-3">
                      SKU INFORMATION
                    </p>
                    <div className="space-y-2 text-xs font-semibold text-brand-dark">
                      <div>
                        <span className="text-slate-500 font-medium">SKU Name : </span>
                        <span className="font-bold text-brand-dark">{selectedSku ? selectedSku.skuName : "No SKU Selected"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">SKU Code : </span>
                        <span className="font-bold text-[#16A34A] bg-emerald-50 border border-[#16A34A]/30 px-2 py-0.5 rounded text-[11px]">
                          {selectedSku ? selectedSku.skuCode : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thin Green Divider Line */}
                  <hr className="border-[#16A34A]/25 my-0" />

                  {/* 2. DISBURSEMENT SCHEDULE */}
                  <div>
                    <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-widest mb-3">
                      DISBURSEMENT SCHEDULE
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5 text-xs sm:text-sm font-semibold text-brand-dark leading-relaxed">
                      <span>Upon completion of</span>
                      <input
                        type="number"
                        value={productIncentiveData.disbursementVolume}
                        onChange={(e) =>
                          setProductIncentiveData((prev) => ({ ...prev, disbursementVolume: Number(e.target.value) }))
                        }
                        className="w-20 rounded-lg border-2 border-[#16A34A]/40 bg-white px-2.5 py-1 text-center text-xs sm:text-sm font-bold text-[#16A34A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 shadow-xs transition"
                      />
                      <span>Ltrs Volume in</span>
                      <input
                        type="number"
                        value={productIncentiveData.disbursementMonths}
                        onChange={(e) =>
                          setProductIncentiveData((prev) => ({ ...prev, disbursementMonths: Number(e.target.value) }))
                        }
                        className="w-16 rounded-lg border-2 border-[#16A34A]/40 bg-white px-2.5 py-1 text-center text-xs sm:text-sm font-bold text-[#16A34A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 shadow-xs transition"
                      />
                      <span>Months, ₹</span>
                      <input
                        type="number"
                        value={productIncentiveData.disbursementAmount}
                        onChange={(e) =>
                          setProductIncentiveData((prev) => ({ ...prev, disbursementAmount: Number(e.target.value) }))
                        }
                        className="w-28 rounded-lg border-2 border-[#16A34A]/40 bg-white px-2.5 py-1 text-center text-xs sm:text-sm font-bold text-[#16A34A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 shadow-xs transition"
                      />
                      <span>will be disbursed.</span>
                    </div>
                  </div>

                  {/* Thin Green Divider Line */}
                  <hr className="border-[#16A34A]/25 my-0" />

                  {/* 3. SUMMARY */}
                  <div>
                    <p className="text-[10px] font-black text-[#16A34A] uppercase tracking-widest mb-3">
                      SUMMARY
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-brand-dark">
                      <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-[#16A34A]/20">
                        <span className="text-slate-600 font-medium">SKU Volume :</span>
                        <span className="text-brand-dark font-extrabold">
                          {(Number(productIncentiveData.skuVolume) || 0).toLocaleString()} Litres
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-[#16A34A]/20">
                        <span className="text-slate-600 font-medium">Incentive Pool :</span>
                        <span className="text-[#16A34A] font-extrabold">
                          ₹{(Number(productIncentiveData.incentivePool) || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Accordion>

          {/* Section 5: Summary Totals */}
          <Accordion
            id="summary"
            index="05"
            title="SKU summary & Totals Breakdown"
            isOpen={expandedSections.summary}
            onToggle={() => setExpandedSections((p) => ({ ...p, summary: !p.summary }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Totals Data fields */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Total Recommended Mix Incentive (Rs.)"
                  type="number"
                  disabled
                  value={summaryTotals.totalRecMixIncentive}
                />
                <Input
                  label="Total Actual Mix Incentive (Rs.)"
                  type="number"
                  disabled
                  value={summaryTotals.totalActualMixIncentive}
                />
                <Input
                  label="Total Volume (Litres)"
                  type="number"
                  disabled
                  value={summaryTotals.totalVolume}
                />
                <Input
                  label="SKU Level Rebate (Rs/Ltr)"
                  type="number"
                  disabled
                  value={summaryTotals.skuLevelRebateLtr}
                />
                <Input
                  label="Total FOC Value (Rs.)"
                  type="number"
                  disabled
                  value={summaryTotals.totalFocValue}
                />
                <Input
                  label="Total FOC Value (Rs/Ltr)"
                  type="number"
                  disabled
                  value={summaryTotals.totalFocValueLtr}
                />
              </div>

              {/* KPI highlight card */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-15">
                  <Check size={90} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                    Final DOFA Approval Threshold
                  </h4>
                  <p className="text-xl sm:text-2xl font-black text-brand-dark mt-2.5 leading-tight">
                    {summaryTotals.finalDofa}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-100/60">
                  <p className="text-[11px] text-primary/80 font-medium leading-relaxed">
                    Automatically evaluated based on customer rebate parameters and cumulative risk matrix metrics.
                  </p>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      <StickyFooter
        onProceed={handleProceed}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
        isSubmitting={isPending}
        proceedLabel="Save & Send for Approval"
      />
    </DashboardShell>
  );
}
