"use client";

import React, { useState, useRef, useEffect } from "react";
import { SkuRow } from "@/lib/offer-demo/types";
import { useSkuSearch } from "@/lib/offer-demo/hooks/useSkuSearch";
import { Plus, Trash2, Search, Sparkles, Loader2, Database, ChevronDown } from "lucide-react";

interface SkuSectionProps {
  selectedSkus: SkuRow[];
  onChange: (skus: SkuRow[]) => void;
  /** Pass the customer's businessStream to filter SKUs by stream automatically */
  stream?: string;
}

export default function SkuSection({
  selectedSkus,
  onChange,
  stream = "",
}: SkuSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedDisbursementSkuId, setSelectedDisbursementSkuId] = useState<string>("");
  const [skuSearchTerm, setSkuSearchTerm] = useState<string>("");

  const activeDisbursementSku =
    selectedSkus.find((s) => s.id === selectedDisbursementSkuId) || selectedSkus[0];

  const { query, results, loading, hasMore, total, setQuery, loadMore } =
    useSkuSearch({ stream });

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Add a SKU from odt_item_master search result ────────────────────────
  const handleAddSku = (item: (typeof results)[0]) => {
    if (selectedSkus.some((s) => s.skuCode === item.skuCode)) {
      alert("SKU is already added to the list");
      return;
    }

    const newRow: SkuRow = {
      id: Math.random().toString(36).substr(2, 9),
      skuCode: item.skuCode,
      skuName: item.brandName,
      skuDataOption: item.stream,
      cogs: item.cogs,
      lbmName: item.description,
      pvName: item.brandName,
      lbm: item.lbm || "",
      pv: item.pv || "",
      recMixIncentive: item.recMixIncentive,
      mixIncentive: item.mixIncentive,
      skuRebate: item.skuRebate,
      productTargetIncentive: item.productTargetIncentive,
      baseTO: item.baseTO,
      baseCOGS: item.cogs,
      contractVolume: 10000,
      focVolume: 100,
      totalInput: item.skuRebate + item.mixIncentive + item.productTargetIncentive,
      surcharge: 0,
      nhf: item.nhf,
      productTargetIncentiveDisbVol: 10000,
      productTargetIncentiveDisbMonths: 12,
      productTargetIncentiveDisbAmt: item.productTargetIncentive * 10000,
    };

    onChange([...selectedSkus, newRow]);
    setQuery("");
    setDropdownOpen(false);
  };

  // ── Field update (all existing calculation logic preserved intact) ───────
  const handleUpdateField = (id: string, field: keyof SkuRow, value: number) => {
    const updated = selectedSkus.map((row) => {
      if (row.id === id) {
        const nextRow = { ...row, [field]: value };
        nextRow.totalInput =
          Number(nextRow.skuRebate || 0) +
          Number(nextRow.mixIncentive || 0) +
          Number(nextRow.productTargetIncentive || 0);

        if (field === "contractVolume" || field === "productTargetIncentive") {
          nextRow.productTargetIncentiveDisbVol = nextRow.contractVolume;
          nextRow.productTargetIncentiveDisbAmt =
            nextRow.productTargetIncentive * nextRow.contractVolume;
        }
        return nextRow;
      }
      return row;
    });
    onChange(updated);
  };

  const handleRemoveSku = (id: string) => {
    onChange(selectedSkus.filter((row) => row.id !== id));
  };

  // ── Summary metrics (unchanged logic) ───────────────────────────────────
  const totalVolumeCommitment = selectedSkus.reduce(
    (sum, s) => sum + s.contractVolume,
    0
  );
  const totalRecommendedMixIncentiveAmt = selectedSkus.reduce(
    (sum, s) => sum + s.recMixIncentive * s.contractVolume,
    0
  );
  const totalActualMixIncentiveAmt = selectedSkus.reduce(
    (sum, s) => sum + s.mixIncentive * s.contractVolume,
    0
  );
  const totalSkuRebAmt = selectedSkus.reduce(
    (sum, s) => sum + s.skuRebate * s.contractVolume,
    0
  );
  const averageSkuRebate =
    totalVolumeCommitment > 0 ? totalSkuRebAmt / totalVolumeCommitment : 0;
  const totalFocVal = selectedSkus.reduce((sum, s) => {
    const baseTO = s.baseTO || s.cogs * 1.45;
    return sum + s.focVolume * baseTO;
  }, 0);
  const totalFocValPerLtr =
    totalVolumeCommitment > 0 ? totalFocVal / totalVolumeCommitment : 0;

  return (
    <div className="space-y-6">

      {/* ── Search bar: live from odt_item_master ─────────────────────────── */}
      <div className="relative" ref={dropdownRef}>
        <label className="text-xs font-bold text-brand-gray uppercase tracking-wider mb-2 block flex items-center gap-1.5">
          <Database size={11} className="text-primary" />
          SELECT SKU FROM PRODUCT MASTER
          {stream && (
            <span className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/20 px-1.5 py-0.5 rounded ml-1 uppercase tracking-wide">
              {stream} Stream
            </span>
          )}
        </label>

        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {loading ? (
                <Loader2 size={15} className="animate-spin text-primary" />
              ) : (
                <Search size={15} />
              )}
            </span>
            <input
              type="text"
              className="w-full text-sm font-medium text-brand-dark bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
              placeholder={`Search by SKU code, brand name, or description${stream ? ` (${stream} stream)` : ""}…`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => {
                setDropdownOpen(true);
                if (!query) setQuery("");
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setDropdownOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-gray hover:text-brand-dark"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dropdown results */}
        {dropdownOpen && (query.length >= 1 || results.length > 0) && (
          <div className="absolute z-20 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {loading
                  ? "Searching product master…"
                  : `${results.length} of ${total} items`}
              </span>
              {stream && (
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {stream}
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="px-4 py-3 space-y-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded" />
                ))}
              </div>
            )}

            {!loading && results.length === 0 && (
              <p className="p-4 text-xs font-semibold text-brand-gray text-center">
                {query.length < 2
                  ? "Type at least 2 characters to search…"
                  : "No matching SKUs found in product master"}
              </p>
            )}

            {!loading && results.length > 0 && (
              <>
                <ul className="divide-y divide-gray-100">
                  {results.map((item) => {
                    const isAdded = selectedSkus.some(
                      (s) => s.skuCode === item.skuCode
                    );
                    return (
                      <li key={item.skuCode}>
                        <button
                          type="button"
                          onClick={() => !isAdded && handleAddSku(item)}
                          disabled={isAdded}
                          className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 text-left transition
                            ${isAdded
                              ? "opacity-50 cursor-not-allowed bg-gray-50"
                              : "hover:bg-gray-50"
                            }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-brand-dark truncate">
                              {item.brandName}{" "}
                              <span className="text-[10px] text-brand-gray font-bold">
                                ({item.skuCode})
                              </span>
                            </p>
                            <p className="text-[10px] text-brand-gray mt-0.5 font-medium truncate">
                              Pack: {item.packSize || "—"} ·
                              COGS: ₹{(Number(item.cogs) || 0).toFixed(2)}/Ltr ·
                              Base TO: ₹{(Number(item.baseTO) || 0).toFixed(2)}/Ltr ·
                              NHF: ₹{(Number(item.nhf) || 0).toFixed(2)}/Ltr ·
                              MRP: ₹{(Number(item.mrp) || 0).toFixed(2)}
                            </p>
                          </div>
                          {isAdded ? (
                            <span className="text-[10px] font-bold text-gray-400 shrink-0">
                              Added
                            </span>
                          ) : (
                            <span className="text-primary hover:bg-primary/5 p-1 rounded font-bold text-xs flex items-center gap-0.5 shrink-0">
                              <Plus size={13} /> Add
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Load more */}
                {hasMore && (
                  <div className="sticky bottom-0 border-t border-slate-100 bg-slate-50 p-2 text-center">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loading}
                      className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 mx-auto"
                    >
                      <ChevronDown size={13} />
                      Load more ({total - results.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Selected SKUs table (all existing logic unchanged) ─────────────── */}
      {selectedSkus.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-brand-gray bg-gray-50/50">
          <Sparkles size={24} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-semibold">No SKUs selected</p>
          <p className="text-xs mt-1">
            Search and add product SKUs from the{" "}
            <span className="font-bold text-primary">Product Master</span> above.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto overflow-y-auto max-h-[420px] border border-gray-200 rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-50 text-brand-gray font-bold uppercase text-[9px] border-b border-gray-250 sticky top-0 z-10 shadow-xs">
                <tr className="border-b border-gray-200">
                  <th className="p-3 text-center border-r border-gray-200" colSpan={6}>
                    MANAGE SKU
                  </th>
                  <th className="p-3 text-center border-r border-gray-200" colSpan={3}>
                    VOLUME
                  </th>
                  <th className="p-3 text-center border-r border-gray-200" colSpan={5}>
                    CUSTOMER REBATES
                  </th>
                  <th className="p-3 text-center" colSpan={2}>
                    FOC VOLUME
                  </th>
                </tr>
                <tr>
                  <th className="p-3 border-r border-gray-200">SKU CODE</th>
                  <th className="p-3 border-r border-gray-200">SKU NAME</th>
                  <th className="p-3 border-r border-gray-200">LBM</th>
                  <th className="p-3 border-r border-gray-200">PV</th>
                  <th className="p-3 border-r border-gray-200">BASE T.O./LTR</th>
                  <th className="p-3 border-r border-gray-200">BASE COGS+JBR/LTR</th>
                  <th className="p-3 border-r border-gray-200">CONTRACT VOLUME (LTR)</th>
                  <th className="p-3 border-r border-gray-200">FOC VOLUME (LTR)</th>
                  <th className="p-3 border-r border-gray-200">TOTAL INPUT (₹/LTR)</th>
                  <th className="p-3 border-r border-gray-200">SURCHARGE (₹/LTR)</th>
                  <th className="p-3 border-r border-gray-200">NHF (₹/LTR)</th>
                  <th className="p-3 border-r border-gray-200">RECOMMENDED MIX INC (₹/LTR)</th>
                  <th className="p-3 border-r border-gray-200">MIX INCENTIVE (₹/LTR)</th>
                  <th className="p-3 border-r border-gray-200">SKU REBATE (₹/LTR)</th>
                  <th className="p-3 border-r border-gray-200">PROD. TGT. INC (₹/LTR)</th>
                  <th className="p-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {selectedSkus.map((sku) => {
                  const baseTO = sku.baseTO || (Number(sku.cogs) || 0) * 1.45;
                  return (
                    <tr key={sku.id} className="hover:bg-gray-50/50">
                      <td className="p-3 border-r border-gray-150 font-bold text-brand-dark">
                        {sku.skuCode || "-"}
                      </td>
                      <td className="p-3 border-r border-gray-150 font-bold text-brand-dark">
                        <p className="truncate max-w-[150px]">{sku.skuName || "-"}</p>
                      </td>
                      <td className="p-3 border-r border-gray-150 font-medium text-brand-gray">
                        {sku.lbm || "-"}
                      </td>
                      <td className="p-3 border-r border-gray-150 font-medium text-brand-gray">
                        {sku.pv || "-"}
                      </td>
                      <td className="p-3 border-r border-gray-150 font-bold text-brand-dark">
                        ₹{(Number(baseTO) || 0).toFixed(2)}
                      </td>
                      <td className="p-3 border-r border-gray-150 font-bold text-brand-dark">
                        ₹{(Number(sku.cogs) || 0).toFixed(2)}
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          value={sku.contractVolume}
                          onChange={(e) =>
                            handleUpdateField(sku.id, "contractVolume", Number(e.target.value))
                          }
                          className="w-20 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-brand-dark"
                        />
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          value={sku.focVolume}
                          onChange={(e) =>
                            handleUpdateField(sku.id, "focVolume", Number(e.target.value))
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-brand-dark"
                        />
                      </td>
                      <td className="p-3 border-r border-gray-150 font-bold text-brand-dark">
                        ₹{(Number(sku.totalInput) || 0).toFixed(2)}
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          value={sku.surcharge}
                          onChange={(e) =>
                            handleUpdateField(sku.id, "surcharge", Number(e.target.value))
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary text-brand-dark"
                        />
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          value={sku.nhf}
                          onChange={(e) =>
                            handleUpdateField(sku.id, "nhf", Number(e.target.value))
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary text-brand-dark"
                        />
                      </td>
                      <td className="p-3 border-r border-gray-150 text-brand-gray font-semibold">
                        ₹{(Number(sku.recMixIncentive) || 0).toFixed(2)}
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          step="0.1"
                          value={sku.mixIncentive}
                          onChange={(e) =>
                            handleUpdateField(sku.id, "mixIncentive", Number(e.target.value))
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-brand-dark"
                        />
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          step="0.1"
                          value={sku.skuRebate}
                          onChange={(e) =>
                            handleUpdateField(sku.id, "skuRebate", Number(e.target.value))
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-brand-dark"
                        />
                      </td>
                      <td className="p-2 border-r border-gray-150">
                        <input
                          type="number"
                          step="0.1"
                          value={sku.productTargetIncentive}
                          onChange={(e) =>
                            handleUpdateField(
                              sku.id,
                              "productTargetIncentive",
                              Number(e.target.value)
                            )
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary font-bold text-brand-dark"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSku(sku.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
                          title="Remove SKU"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          

          {/* Product Target Incentive Disbursement Schedules (Unified Enterprise Card Layout) */}
          <div className="space-y-3">
            {selectedSkus.length === 0 ? (
              <div className="text-xs text-gray-400 italic py-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                No SKUs selected. Add SKUs above to configure disbursement schedules.
              </div>
            ) : (
              <div className="bg-white border border-emerald-200 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row">
                {/* ── LEFT PANEL (30% Desktop / W-full Mobile) ── */}
                <div className="w-full md:w-[30%] lg:w-[28%] border-b md:border-b-0 md:border-r border-emerald-100 bg-emerald-50/30 p-3.5 flex flex-col">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-wider">
                      SELECT SKU
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {selectedSkus.length} Available
                    </span>
                  </div>

                  {selectedSkus.length > 4 && (
                    <div className="relative mb-2.5">
                      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search SKU..."
                        value={skuSearchTerm}
                        onChange={(e) => setSkuSearchTerm(e.target.value)}
                        className="w-full text-xs bg-white border border-emerald-200 rounded-lg pl-7 pr-2.5 py-1.5 focus:outline-none focus:border-primary font-medium"
                      />
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto max-h-[300px] md:max-h-[360px] space-y-1.5 pr-1">
                    {selectedSkus
                      .filter((s) =>
                        !skuSearchTerm ||
                        s.skuName.toLowerCase().includes(skuSearchTerm.toLowerCase()) ||
                        s.skuCode.toLowerCase().includes(skuSearchTerm.toLowerCase())
                      )
                      .map((sku) => {
                        const isSelected = (activeDisbursementSku?.id || selectedSkus[0]?.id) === sku.id;
                        return (
                          <button
                            key={sku.id}
                            type="button"
                            onClick={() => setSelectedDisbursementSkuId(sku.id)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 flex items-start gap-2.5 ${
                              isSelected
                                ? "bg-white border-[#16A34A] shadow-xs ring-1 ring-[#16A34A]/20 text-brand-dark"
                                : "bg-white/60 border-transparent hover:bg-white hover:border-emerald-200 text-slate-600"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isSelected ? "bg-[#16A34A]" : "bg-gray-300"}`} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold truncate leading-tight ${isSelected ? "text-[#16A34A]" : "text-slate-800"}`}>
                                {sku.skuName}
                              </p>
                              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                {sku.skuCode}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* ── RIGHT PANEL (70% Desktop / W-full Mobile) ── */}
                {activeDisbursementSku && (
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
                            <span className="font-bold text-brand-dark">{activeDisbursementSku.skuName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-medium">SKU Code : </span>
                            <span className="font-bold text-[#16A34A] bg-emerald-50 border border-[#16A34A]/30 px-2 py-0.5 rounded text-[11px]">
                              {activeDisbursementSku.skuCode}
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
                            value={activeDisbursementSku.productTargetIncentiveDisbVol ?? activeDisbursementSku.contractVolume}
                            onChange={(e) =>
                              handleUpdateField(
                                activeDisbursementSku.id,
                                "productTargetIncentiveDisbVol",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 rounded-lg border-2 border-[#16A34A]/40 bg-white px-2.5 py-1 text-center text-xs sm:text-sm font-bold text-[#16A34A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 shadow-xs transition"
                          />
                          <span>Ltrs Volume in</span>
                          <input
                            type="number"
                            value={activeDisbursementSku.productTargetIncentiveDisbMonths ?? 12}
                            onChange={(e) =>
                              handleUpdateField(
                                activeDisbursementSku.id,
                                "productTargetIncentiveDisbMonths",
                                Number(e.target.value)
                              )
                            }
                            className="w-16 rounded-lg border-2 border-[#16A34A]/40 bg-white px-2.5 py-1 text-center text-xs sm:text-sm font-bold text-[#16A34A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 shadow-xs transition"
                          />
                          <span>Months, ₹</span>
                          <input
                            type="number"
                            value={
                              activeDisbursementSku.productTargetIncentiveDisbAmt ??
                              activeDisbursementSku.productTargetIncentive * activeDisbursementSku.contractVolume
                            }
                            onChange={(e) =>
                              handleUpdateField(
                                activeDisbursementSku.id,
                                "productTargetIncentiveDisbAmt",
                                Number(e.target.value)
                              )
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
                              {(Number(activeDisbursementSku.contractVolume) || 0).toLocaleString()} Litres
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-[#16A34A]/20">
                            <span className="text-slate-600 font-medium">Incentive Pool :</span>
                            <span className="text-[#16A34A] font-extrabold">
                              ₹{(
                                Number(
                                  activeDisbursementSku.productTargetIncentiveDisbAmt ??
                                  activeDisbursementSku.productTargetIncentive * activeDisbursementSku.contractVolume
                                ) || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom summary metrics (all existing logic unchanged) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5 text-xs">
            <h5 className="text-[10px] font-bold text-brand-gray uppercase tracking-wider pb-1.5 border-b border-gray-200">
              SKU Allocation Summary Metrics
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-brand-gray text-[10px] uppercase">
                  TOTAL RECOMMENDED MIX INCENTIVE
                </span>
                <span className="font-bold text-brand-dark">
                  ₹{(Number(totalRecommendedMixIncentiveAmt) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-brand-gray text-[10px] uppercase">
                  TOTAL ACTUAL MIX INCENTIVE
                </span>
                <span className="font-bold text-brand-dark">
                  ₹{(Number(totalActualMixIncentiveAmt) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-brand-gray text-[10px] uppercase">
                  TOTAL VOLUME (LITRE)
                </span>
                <span className="font-bold text-primary">
                  {(Number(totalVolumeCommitment) || 0).toLocaleString()} Ltr
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-brand-gray text-[10px] uppercase">
                  AVERAGE SKU LEVEL REBATE
                </span>
                <span className="font-bold text-brand-dark">
                  ₹{(Number(averageSkuRebate) || 0).toFixed(2)}/Ltr
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-brand-gray text-[10px] uppercase">
                  TOTAL FOC VALUE
                </span>
                <span className="font-bold text-brand-dark">
                  ₹{(Number(totalFocVal) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="font-semibold text-brand-gray text-[10px] uppercase">
                  TOTAL FOC VALUE / LTR
                </span>
                <span className="font-bold text-brand-dark">
                  ₹{(Number(totalFocValPerLtr) || 0).toFixed(2)}/Ltr
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
