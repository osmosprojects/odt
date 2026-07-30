"use client";

import React from "react";
import Input from "../ui/Input";
import SearchDropdown from "../ui/SearchDropdown";
import { Plus, Trash2 } from "lucide-react";

export interface CustomerDataProps {
  offerStream?: string;
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
  [key: string]: any;
}

export interface CustomerDataSectionProps {
  data?: CustomerDataProps;
  offerStream?: string;
  customers?: CustomerDataProps[];
  errors?: Record<string, string>;
  onChange?: (field: string | any, value?: any) => void;
  touched?: boolean | Record<string, boolean>;
}

const customerNameOptions = [
  "Anand Distributors Pvt Ltd",
  "Bhawani Oils & Lubricants",
  "Dynamic Fleet Services Ltd",
  "Mahavir Automotive Outlets",
  "Western Transport Corp",
];

const distributorNameOptions = [
  "Anand Logistics West",
  "Bhawani Distribution Pune",
  "Western Regional Depo",
  "Gujarat Stockist Pvt Ltd",
];

const wbcOfferOptions = [
  "WBC-2025-091 - Monsoon Fleet Base",
  "WBC-2025-042 - Western Region Growth",
  "WBC-2024-813 - Heavy Commercial Payout",
];

const AutoBadge = () => (
  <span className="text-[9px] font-semibold text-brand-gray bg-gray-100 border border-gray-200 px-1 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
    Auto-populated
  </span>
);

export default function CustomerDataSection({
  data: dataProp,
  offerStream: offerStreamProp,
  customers: customersProp,
  errors = {},
  onChange,
}: CustomerDataSectionProps) {
  const data: CustomerDataProps = dataProp || (customersProp && customersProp[0]) || {
    offerStream: offerStreamProp || "",
    newExistingCustomer: "New",
    currentCustomerType: "Direct",
    proposedCustomerType: "Direct",
    customerNames: [""],
    distributorName: "",
    customerNumber: "",
    keyAccount: "",
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

  const effectiveStream = data.offerStream || offerStreamProp || "";
  const isPreviousWbcYes = data.previousWbc === "Yes";

  // GST visibility & mandatory rules based on Offer Stream
  const showGst = effectiveStream === "IWS" || effectiveStream === "CAS" || effectiveStream === "CASN";
  const isGstMandatory = effectiveStream === "CAS" || effectiveStream === "CASN";

  const triggerChange = (field: string, value: any) => {
    if (!onChange) return;
    if (customersProp) {
      const updated = [...customersProp];
      const current = updated[0] ? { ...updated[0] } : { ...data };
      current[field] = value;
      updated[0] = current;
      onChange(updated);
    } else {
      onChange(field, value);
    }
  };

  const handleCustomerNameChange = (index: number, val: string) => {
    const updated = [...(data.customerNames || [""])];
    updated[index] = val;
    triggerChange("customerNames", updated);
  };

  const handleAddCustomer = () => {
    triggerChange("customerNames", [...(data.customerNames || [""]), ""]);
  };

  const handleRemoveCustomer = (index: number) => {
    const updated = (data.customerNames || [""]).filter((_, i) => i !== index);
    triggerChange("customerNames", updated.length > 0 ? updated : [""]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-[fadeIn_0.2s_ease-out]">
      {/* COLUMN 1 */}
      <div className="space-y-4">
        {/* Radio - read only from master */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-semibold text-brand-gray">New / Existing Customer</label>
            <AutoBadge />
          </div>
          <Input disabled readOnly value={data.newExistingCustomer} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Current Customer Type</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.currentCustomerType} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Proposed Customer Type</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.proposedCustomerType} />
          </div>
        </div>

        {/* Customer names row list */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-brand-gray block">
            Customer Name(s) *
          </label>
          {(data.customerNames || [""]).map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <SearchDropdown
                  placeholder={`Select Customer ${index + 1}...`}
                  options={customerNameOptions}
                  value={name}
                  onChange={(val) => handleCustomerNameChange(index, val)}
                  error={errors[`customerName_${index}`]}
                  required
                />
              </div>
              {data.customerNames && data.customerNames.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCustomer(index)}
                  className="p-2 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-brand-gray hover:text-brand-red rounded-lg transition"
                  title="Remove customer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCustomer}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition pt-1"
          >
            <Plus size={14} /> Add Customer
          </button>
        </div>

        <SearchDropdown
          label="Customer / Distributor Name"
          placeholder="Search Distributor..."
          options={distributorNameOptions}
          value={data.distributorName || ""}
          onChange={(val) => triggerChange("distributorName", val)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Customer Turfview Number</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.customerNumber || ""} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Key Account</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.keyAccount || ""} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">State</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.state || ""} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Segment</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.segment || ""} />
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
            <Input disabled readOnly value={data.subSegment || ""} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Customer / Distributor JDE Code</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.jdeCode || ""} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">BP Sales Rep</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.salesRep || ""} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-semibold text-brand-gray">Sales Area</label>
              <AutoBadge />
            </div>
            <Input disabled readOnly value={data.salesArea || ""} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-semibold text-brand-gray">Customer Address</label>
            <AutoBadge />
          </div>
          <Input disabled readOnly value={data.address || ""} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-brand-gray mb-2 block">
              Customer has Previous WBC *
            </label>
            <div className="flex items-center gap-4 py-1.5">
              <label className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer">
                <input
                  type="radio"
                  name="previousWbc"
                  value="No"
                  checked={data.previousWbc === "No"}
                  onChange={(e) => triggerChange("previousWbc", e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                No
              </label>
              <label className="flex items-center gap-2 text-sm text-brand-dark font-medium cursor-pointer">
                <input
                  type="radio"
                  name="previousWbc"
                  value="Yes"
                  checked={data.previousWbc === "Yes"}
                  onChange={(e) => triggerChange("previousWbc", e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                Yes
              </label>
            </div>
          </div>

          <div>
            {isPreviousWbcYes && (
              <SearchDropdown
                label="Previous WBC Offer *"
                placeholder="Search previous offer..."
                options={wbcOfferOptions}
                value={data.previousWbcOffer || ""}
                onChange={(val) => triggerChange("previousWbcOffer", val)}
                error={errors.previousWbcOffer}
                required
              />
            )}
          </div>
        </div>

        {/* GST Rules Conditional Field */}
        {showGst && (
          <div className="animate-[slideDown_0.2s_ease-out]">
            <Input
              label={`GST Number${isGstMandatory ? " *" : ""}`}
              placeholder="e.g. 27AAAAA1111A1Z1"
              value={data.gstNumber || ""}
              onChange={(e) => triggerChange("gstNumber", e.target.value)}
              error={errors.gstNumber}
              required={isGstMandatory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
