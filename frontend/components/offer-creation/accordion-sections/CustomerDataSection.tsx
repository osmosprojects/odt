"use client";

import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import SearchDropdown from "../ui/SearchDropdown";
import { Plus, Trash2, Check, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { usePreviousWbc } from "@/hooks/usePreviousWbc";

export interface Customer {
  id?: string;
  name?: string;
  newExistingCustomer?: string;
  currentCustomerType?: string;
  proposedCustomerType?: string;
  customerNames?: string[];
  distributorName?: string;
  customerNumber?: string;
  keyAccount?: string;
  state?: string;
  segment?: string;
  subSegment?: string;
  jdeCode?: string;
  salesRep?: string;
  salesArea?: string;
  address?: string;
  previousWbc?: string;
  previousWbcOffer?: string;
  gstNumber?: string;
}

interface CustomerDataSectionProps {
  offerStream: string;
  customers: Customer[];
  errors: Record<string, string>;
  onChange: (updatedCustomers: Customer[]) => void;
  touched: boolean;
  onSelectPreviousOfferDetails?: (details: any) => void;
}




const AutoBadge = () => (
  <span className="text-[9px] font-semibold text-brand-gray bg-gray-100 border border-gray-250 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
    Auto-populated
  </span>
);

export default function CustomerDataSection({
  offerStream,
  customers,
  errors,
  onChange,
  touched,
  onSelectPreviousOfferDetails,
}: CustomerDataSectionProps) {
  const [activeCustomerIndex, setActiveCustomerIndex] = useState<number>(0);
  const [shouldFocusName, setShouldFocusName] = useState(false);
  const [availableCustomers, setAvailableCustomers] = useState<any[]>([]);

  const {
    wbcOffers,
    isLoadingList,
    listError,
    fetchWbcOffers,
    fetchWbcOfferDetails,
  } = usePreviousWbc();

  useEffect(() => {
    api.getCustomers().then(data => {
      setAvailableCustomers(Array.isArray(data) ? data : (data as any).data || []);
    }).catch(console.error);
  }, []);

  // Keep activeCustomerIndex inside valid boundaries
  useEffect(() => {
    if (activeCustomerIndex >= customers.length) {
      setActiveCustomerIndex(Math.max(0, customers.length - 1));
    }
  }, [customers.length, activeCustomerIndex]);

  const activeCustomer = customers[activeCustomerIndex] || customers[0];

  // Fetch executive's active previous WBC offers when Customer has Previous WBC = YES
  useEffect(() => {
    if (activeCustomer?.previousWbc === "Yes") {
      const execCode = activeCustomer.salesRep || "101";
      console.log(`[Frontend Previous WBC] Fetching active offers for executiveCode: "${execCode}"`);
      fetchWbcOffers(execCode);
    }
  }, [activeCustomer?.previousWbc, activeCustomer?.salesRep, fetchWbcOffers]);

  // Autofocus the Customer Name SearchDropdown button when a new customer is added
  useEffect(() => {
    if (shouldFocusName) {
      const timer = setTimeout(() => {
        const container = document.getElementById("customer-name-dropdown-container");
        const button = container?.querySelector("button");
        if (button) {
          button.focus();
        }
        setShouldFocusName(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldFocusName, activeCustomerIndex]);

  const showGst = offerStream === "IWS" || offerStream === "CAS" || offerStream === "CASN";
  const isGstMandatory = offerStream === "CAS" || offerStream === "CASN";

  const handleCustomerFieldChange = (index: number, field: keyof Customer, value: any) => {
    const updated = customers.map((c, i) => {
      if (i === index) {
        let updatedCust = { ...c, [field]: value };
        if (field === "name") {
          const customer = availableCustomers.find((cust: any) => (cust.name || cust.customer_name) === value);
          if (customer) {
            const code = customer.customerCode || customer.jdeCode || customer.id || '';
            const fieldMap: Partial<Customer> = {
              customerNumber: code,
              state: customer.state || '',
              segment: customer.segment || '',
              subSegment: customer.subSegment || '',
              jdeCode: customer.jdeCode || customer.customerCode || '',
              salesRep: customer.salesRep || customer.executive || '',
              salesArea: customer.salesArea || '',
              address: customer.address || '',
              distributorName: customer.distributorName || '',
              currentCustomerType: customer.customerType || '',
              keyAccount: customer.keyAccount || '',
              gstNumber: customer.gstNumber || '',
            };
            updatedCust = {
              ...updatedCust,
              ...fieldMap,
              previousWbcOffer: "",
            };

            // Trigger Previous Contract lookup automatically with all available identifiers
            const lookupPayload = {
              customerCode: code || customer.jdeCode || customer.customerCode || undefined,
              custId: customer.customerNumber || undefined,
              executiveCode: customer.salesRep || customer.executive || undefined,
              customerName: customer.name || undefined,
            };
            if ((lookupPayload.customerCode || lookupPayload.customerName || lookupPayload.executiveCode) && onSelectPreviousOfferDetails) {
              api.lookupPreviousOffer(lookupPayload)
                .then((res) => {
                  if (res?.success && res.hasPreviousOffer && res.previousOffer) {
                    const prev = res.previousOffer;
                    const execName = prev.executiveName || prev.executive_name || prev.bp_sales_rep_text || prev.executiveCode || prev.executive_code;
                    const st = prev.state || prev.cust_state;
                    if (execName || st) {
                      handleCustomerFieldChange(index, "salesRep", execName || updatedCust.salesRep);
                      if (st) handleCustomerFieldChange(index, "state", st);
                    }
                    onSelectPreviousOfferDetails(prev);
                  }
                })
                .catch(console.error);
            }
          } else {
            updatedCust = {
              ...updatedCust,
              customerNumber: "",
              state: "",
              segment: "",
              subSegment: "",
              jdeCode: "",
              salesRep: "",
              salesArea: "",
              address: "",
              distributorName: "",
              previousWbc: "No",
              previousWbcOffer: "",
            };
          }
        }
        return updatedCust;
      }
      return c;
    });
    onChange(updated);
  };

  const handleSelectWbcOffer = async (index: number, selectedLabel: string) => {
    handleCustomerFieldChange(index, "previousWbcOffer", selectedLabel);

    const matched = wbcOffers.find(
      (item) =>
        `${item.customerName} (${item.offerCode})` === selectedLabel ||
        item.offerCode === selectedLabel ||
        String(item.offerId) === selectedLabel
    );

    if (matched) {
      console.log(`[Frontend Previous WBC Selected]: Loading performance for offerId: ${matched.offerId}`);
      const details = await fetchWbcOfferDetails(matched.offerId);
      if (details && onSelectPreviousOfferDetails) {
        console.log(`[Frontend Performance Loaded]: Populating form state with performance details:`, details);
        onSelectPreviousOfferDetails(details);
      }
    }
  };


  const handleAddCustomer = () => {
    const firstCust = customers[0] || {};
    const newCustomer: Customer = {
      name: "",
      newExistingCustomer: firstCust.newExistingCustomer || "Existing Customer",
      currentCustomerType: firstCust.currentCustomerType || "Wholesale Dealer",
      proposedCustomerType: firstCust.proposedCustomerType || "Direct Key Account",
      distributorName: "",
      customerNumber: "",
      keyAccount: firstCust.keyAccount || "No",
      state: "",
      segment: "",
      subSegment: "",
      jdeCode: "",
      salesRep: "",
      salesArea: "",
      address: "",
      previousWbc: "No",
      previousWbcOffer: "",
      gstNumber: "",
    };
    const updated = [...customers, newCustomer];
    onChange(updated);
    setActiveCustomerIndex(updated.length - 1);
    setShouldFocusName(true);
  };

  const handleRemoveCustomer = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;

    if (confirm(`Are you sure you want to remove Customer ${index + 1}?`)) {
      const updated = customers.filter((_, i) => i !== index);
      onChange(updated);

      if (activeCustomerIndex === index) {
        setActiveCustomerIndex(index - 1);
      } else if (activeCustomerIndex > index) {
        setActiveCustomerIndex(activeCustomerIndex - 1);
      }
    }
  };

  const getCustomerValidationState = (customer: Customer, index: number) => {
    const hasNameErr = !(customer.name || "").trim();
    const hasWbcErr = customer.previousWbc === "Yes" && !(customer.previousWbcOffer || "").trim();
    const hasGstErr = isGstMandatory && !(customer.gstNumber || "").trim();

    const isInvalid = hasNameErr || hasWbcErr || hasGstErr;

    if (isInvalid) {
      if (touched || ((customer.name || "").trim() !== "" && (hasWbcErr || hasGstErr))) {
        let errorMsg = "Validation Error";
        if (hasNameErr) errorMsg = "Customer Name Missing";
        else if (hasGstErr) errorMsg = "GST Missing";
        else if (hasWbcErr) errorMsg = "Previous WBC Offer Missing";
        return { status: "error", message: errorMsg };
      } else {
        return { status: "incomplete", message: "Not Configured" };
      }
    }

    return { status: "completed", message: "Complete" };
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full text-brand-dark animate-[fadeIn_0.2s_ease-out]">
      {/* LEFT PANEL: CUSTOMERS LIST */}
      <div className="w-full md:w-[35%] lg:w-[30%] shrink-0 flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-brand-gray uppercase tracking-wider">Customers</h3>
          <span className="text-[10px] font-semibold text-brand-gray bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full select-none">
            {customers.length} {customers.length === 1 ? "Customer" : "Customers"}
          </span>
        </div>

        {/* MOBILE LAYOUT: Horizontal scrollable tab list */}
        <div className="flex md:hidden flex-row gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x snap-mandatory">
          {customers.map((customer, index) => {
            const isActive = index === activeCustomerIndex;
            const { status, message } = getCustomerValidationState(customer, index);
            const displayName = (customer.name || "").trim() || "Not Configured";

            return (
              <div
                key={index}
                onClick={() => setActiveCustomerIndex(index)}
                className={`shrink-0 w-52 snap-align-start relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-24 select-none
                  ${isActive ? "border-primary bg-primary/[0.02] shadow-sm" : "border-gray-200 bg-white"}
                `}
              >
                <div className="pr-6">
                  <span className="text-[9px] font-bold text-brand-gray uppercase tracking-wider block mb-0.5">
                    Customer {index + 1}
                  </span>
                  <h4 className={`text-xs font-bold truncate ${(customer.name || "").trim() ? "text-brand-dark" : "text-brand-gray/60 italic"}`}>
                    {displayName}
                  </h4>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCustomer(index, e)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-brand-gray hover:text-red-600 hover:bg-red-50 border border-transparent transition duration-150"
                    title={`Remove Customer ${index + 1}`}
                  >
                    <Trash2 size={12} className="shrink-0" />
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  {status === "completed" && (
                    <>
                      <div className="bg-emerald-500 text-white rounded-full p-0.5 flex items-center justify-center shrink-0">
                        <Check size={8} className="stroke-[3]" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600">
                        Complete
                      </span>
                    </>
                  )}
                  {status === "incomplete" && (
                    <>
                      <div className="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center shrink-0" />
                      <span className="text-[9px] font-bold text-gray-500">
                        Not Configured
                      </span>
                    </>
                  )}
                  {status === "error" && (
                    <>
                      <div className="text-red-500 shrink-0">
                        <AlertCircle size={12} className="fill-red-50 stroke-red-500 stroke-[2.5]" />
                      </div>
                      <span className="text-[9px] font-bold text-red-600 truncate max-w-[130px]">
                        {message}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddCustomer}
            className="shrink-0 w-32 snap-align-start flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-dashed border-primary bg-primary/[0.01] text-primary hover:bg-primary/[0.04] font-semibold text-xs tracking-wide transition-all h-24 duration-200"
          >
            <Plus size={14} />
            <span>Add Customer</span>
          </button>
        </div>

        {/* TABLET / DESKTOP LAYOUT: Vertical card list */}
        <div className="hidden md:flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 thin-scroll">
          {customers.map((customer, index) => {
            const isActive = index === activeCustomerIndex;
            const { status, message } = getCustomerValidationState(customer, index);
            const displayName = (customer.name || "").trim() || "Not Configured";
            const displayState = customer.state || "—";
            const displaySegment = customer.segment || "—";

            return (
              <div
                key={index}
                onClick={() => setActiveCustomerIndex(index)}
                className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-32 select-none
                  ${isActive ? "border-primary bg-primary/[0.01] shadow-xs" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"}
                `}
              >
                <div className="pr-8">
                  <span className="text-[10px] font-bold text-brand-gray uppercase tracking-wider block mb-1">
                    Customer {index + 1}
                  </span>
                  <h4 className={`text-xs font-bold truncate leading-snug ${(customer.name || "").trim() ? "text-brand-dark" : "text-brand-gray/60 italic"}`}>
                    {displayName}
                  </h4>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCustomer(index, e)}
                    className="absolute top-3.5 right-3.5 p-1 rounded-md text-brand-gray hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition duration-150"
                    title={`Remove Customer ${index + 1}`}
                  >
                    <Trash2 size={14} className="shrink-0" />
                  </button>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-4 text-[10px] text-brand-gray font-medium">
                    <div>
                      <span className="text-gray-400 font-normal">State:</span> {displayState}
                    </div>
                    <div className="truncate max-w-[120px]">
                      <span className="text-gray-400 font-normal">Segment:</span> {displaySegment}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {status === "completed" && (
                      <>
                        <div className="bg-emerald-500 text-white rounded-full p-0.5 flex items-center justify-center shrink-0">
                          <Check size={10} className="stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">
                          Complete
                        </span>
                      </>
                    )}
                    {status === "incomplete" && (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0" />
                        <span className="text-[10px] font-bold text-gray-500">
                          Not Configured
                        </span>
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <div className="text-red-500 shrink-0">
                          <AlertCircle size={14} className="fill-red-50 stroke-red-500 stroke-[2.5]" />
                        </div>
                        <span className="text-[10px] font-bold text-red-600">
                          {message}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Add Customer Button */}
        <button
          type="button"
          onClick={handleAddCustomer}
          className="hidden md:flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-primary text-primary hover:bg-primary/5 font-semibold text-xs tracking-wide transition-all duration-200"
        >
          <Plus size={14} /> Add Customer
        </button>
      </div>

      {/* RIGHT PANEL: SELECTED CUSTOMER DETAILS */}
      <div className="flex-1 md:w-[65%] lg:w-[70%]">
        {activeCustomer ? (
          <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Customer Details</h3>
              <p className="text-xs text-brand-gray mt-0.5 font-medium">
                Configure details for Customer {activeCustomerIndex + 1}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* COLUMN 1 */}
              <div className="space-y-4">
                <div id="customer-name-dropdown-container">
                  <SearchDropdown
                    label={`Customer Name`}
                    placeholder={`Select Customer ${activeCustomerIndex + 1}...`}
                    options={availableCustomers.map(c => c.name || c.customer_name || "")}
                    value={activeCustomer.name || ""}
                    onChange={(val) => handleCustomerFieldChange(activeCustomerIndex, "name", val)}
                    error={errors[`customer_${activeCustomerIndex}_name`]}
                    required
                  />
                </div>

                <SearchDropdown
                  label="Customer / Distributor Name"
                  placeholder="Search Distributor..."
                  options={Array.from(new Set(availableCustomers.map(c => c.distributorName || c.distributor_name).filter(Boolean)))}
                  value={activeCustomer.distributorName || ""}
                  onChange={(val) => handleCustomerFieldChange(activeCustomerIndex, "distributorName", val)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Customer Turfview No</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.customerNumber || ""} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Current Customer Type</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.currentCustomerType || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Proposed Customer Type</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.proposedCustomerType || ""} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Key Account</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.keyAccount || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">State</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.state || ""} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Segment</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.segment || ""} />
                  </div>
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Sub Segment</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.subSegment || ""} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Customer / Distributor JDE Code</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.jdeCode || ""} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">BP Sales Rep</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.salesRep || ""} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-xs font-semibold text-brand-gray">Sales Area</label>
                      <AutoBadge />
                    </div>
                    <Input disabled readOnly value={activeCustomer.salesArea || ""} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="text-xs font-semibold text-brand-gray">Customer Address</label>
                    <AutoBadge />
                  </div>
                  <Input disabled readOnly value={activeCustomer.address || ""} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-brand-gray mb-2 block">
                      Customer has Previous WBC <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4 py-1.5">
                      <label className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer">
                        <input
                          type="radio"
                          name={`previousWbc_${activeCustomerIndex}`}
                          value="No"
                          checked={activeCustomer.previousWbc === "No"}
                          onChange={(e) => handleCustomerFieldChange(activeCustomerIndex, "previousWbc", e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        />
                        No
                      </label>
                      <label className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer">
                        <input
                          type="radio"
                          name={`previousWbc_${activeCustomerIndex}`}
                          value="Yes"
                          checked={activeCustomer.previousWbc === "Yes"}
                          onChange={(e) => handleCustomerFieldChange(activeCustomerIndex, "previousWbc", e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                        />
                        Yes
                      </label>
                    </div>
                  </div>

                  <div>
                    {activeCustomer.previousWbc === "Yes" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-brand-gray block">
                          Previous WBC Offer <span className="text-red-500">*</span>
                        </label>

                        {isLoadingList ? (
                          <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-brand-gray">
                            <Loader2 size={14} className="animate-spin text-primary shrink-0" />
                            <span>Loading Previous WBC Offers...</span>
                          </div>
                        ) : listError ? (
                          <div className="flex items-center justify-between p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                            <span className="truncate max-w-[150px]">{listError}</span>
                            <button
                              type="button"
                              onClick={() => fetchWbcOffers(activeCustomer.salesRep || "101")}
                              className="flex items-center gap-1 font-bold hover:underline text-red-800 shrink-0"
                            >
                              <RefreshCw size={12} /> Retry
                            </button>
                          </div>
                        ) : wbcOffers.length === 0 ? (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
                            No Previous WBC Offers Found
                          </div>
                        ) : (
                          <SearchDropdown
                            label=""
                            placeholder="Select Previous WBC Offer..."
                            options={wbcOffers.map((o) => `${o.customerName} (${o.offerCode})`)}
                            value={activeCustomer.previousWbcOffer || ""}
                            onChange={(val) => handleSelectWbcOffer(activeCustomerIndex, val)}
                            error={errors[`customer_${activeCustomerIndex}_previousWbcOffer`]}
                            required
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {showGst && (
                  <div className="animate-[slideDown_0.2s_ease-out]">
                    <Input
                      label={`GST Number${isGstMandatory ? " *" : ""}`}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      value={activeCustomer.gstNumber || ""}
                      onChange={(e) => handleCustomerFieldChange(activeCustomerIndex, "gstNumber", e.target.value)}
                      error={errors[`customer_${activeCustomerIndex}_gstNumber`]}
                      required={isGstMandatory}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-250 rounded-xl p-8 text-center text-brand-gray font-medium text-xs">
            Please select or add a customer to see their details.
          </div>
        )}
      </div>
    </div>
  );
}
