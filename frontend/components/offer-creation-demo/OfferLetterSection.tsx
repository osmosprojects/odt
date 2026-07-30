"use client";

import React, { useState, useRef } from "react";
import { FormData } from "@/lib/offer-demo/types";
import { Printer, FileText, Edit, Check } from "lucide-react";
import TermsEditor from "./TermsEditor";

interface OfferLetterSectionProps {
  formData: FormData;
}

export default function OfferLetterSection({ formData }: OfferLetterSectionProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Default Terms and Conditions loaded from state constants
  const [clauses, setClauses] = useState<string[]>([
    "Please sign and return the duplicate copy of this letter as a token of your acceptance of the terms above.",
    "We value our association and look forward to a mutually prosperous partnership.",
    "All price rebates are subject to volume audit and quarterly reconciliation."
  ]);
  
  const [sectionHeading, setSectionHeading] = useState("2. TERMS & CONDITIONS");

  const handlePrint = () => {
    const printContent = printAreaRef.current?.innerHTML;
    if (printContent) {
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Castrol B2B Commercial Offer Letter</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                  border-bottom: 2px solid #005A2B;
                  padding-bottom: 20px;
                }
                .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #005A2B;
                }
                .doc-title {
                  font-size: 18px;
                  font-weight: bold;
                  margin-top: 15px;
                  text-transform: uppercase;
                  color: #333;
                }
                .details-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 10px;
                  margin: 20px 0;
                  font-size: 13px;
                }
                .detail-label {
                  font-weight: bold;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 20px 0;
                  font-size: 13px;
                }
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f5f5f5;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 50px;
                  font-size: 12px;
                  border-top: 1px solid #ddd;
                  padding-top: 15px;
                }
                .signatures {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 60px;
                  font-size: 13px;
                }
                .sig-box {
                  text-align: center;
                  width: 200px;
                  border-top: 1px solid #333;
                  padding-top: 5px;
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        win.document.close();
        win.print();
      }
    }
  };

  const customerName = formData.selectedCustomer?.name || "[Customer Name]";
  const jdeCode = formData.selectedCustomer?.jdeCode || "[JDE Code]";
  const address = formData.selectedCustomer?.address || "[Customer Address]";
  const state = formData.selectedCustomer?.state || "[State]";
  const salesRep = formData.selectedCustomer?.salesRep || "[Sales Representative]";

  return (
    <div className="space-y-4">
      {/* Header bar with Action buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 p-3.5 bg-gray-50 border border-gray-150 rounded-xl">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary shrink-0" />
          <span className="text-xs font-semibold text-brand-dark">
            Castrol B2B Commercial Offer Letter (Dynamic Preview)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-brand-dark text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            {isEditing ? (
              <>
                <Check size={14} className="text-primary" /> Done Editing
              </>
            ) : (
              <>
                <Edit size={14} /> Edit Terms &amp; Conditions
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            <Printer size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Edit Terms form if active */}
      {isEditing && (
        <div className="animate-[fadeIn_0.2s_ease-out]">
          <TermsEditor
            clauses={clauses}
            onChangeClauses={setClauses}
            sectionHeading={sectionHeading}
            onChangeHeading={setSectionHeading}
          />
        </div>
      )}

      {/* Preview container */}
      <div className="border border-gray-200 rounded-xl bg-white p-6 sm:p-8 max-h-[500px] overflow-y-auto thin-scroll shadow-inner">
        <div ref={printAreaRef} className="text-xs text-brand-dark space-y-4 font-sans leading-relaxed">
          {/* Letterhead */}
          <div className="border-b border-primary/20 pb-4 text-center">
            <h2 className="text-base font-black text-primary uppercase tracking-wider">Castrol India Limited</h2>
            <p className="text-[10px] text-brand-gray font-medium">Technopolis Knowledge Park, Mahakali Caves Road, Andheri (East), Mumbai 400093</p>
          </div>

          {/* Metadata */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-bold">To,</p>
              <p className="font-bold text-brand-dark">{customerName}</p>
              <p className="text-brand-gray font-medium">{address}</p>
              <p className="text-brand-gray font-medium">State: {state}</p>
              <p className="text-brand-gray font-medium">JDE Code: {jdeCode}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">Date: {new Date().toLocaleDateString("en-IN")}</p>
              <p className="font-bold">Reference: OC-2026-0847</p>
              <p className="text-brand-gray font-medium">Stream: {formData.offerStream}</p>
            </div>
          </div>

          {/* Subject */}
          <div className="font-bold border-y border-gray-100 py-2">
            Subject: Commercial Agreement for Lubricants Supply &amp; Volume Incentives
          </div>

          {/* Body */}
          <p>Dear Sir/Madam,</p>
          <p>
            We are pleased to outline the commercial terms under our <strong>{formData.offerCreationType}</strong> program for the supply of Castrol Lubricants. 
            This agreement is proposed for a term of <strong>{formData.investmentTerm} Months</strong> commencing on <strong>{formData.startDate || "[Start Date]"}</strong>.
          </p>

          <p className="font-bold">1. Volume Commitments &amp; Investments:</p>
          <p>
            Under this contract, you commit to a minimum volume of <strong>{(Number(formData.totalVolumeCommitment) || 0).toLocaleString()} Litres</strong> over the {formData.investmentTerm}-month duration. 
            Subject to this commitment, Castrol India will deploy an investment value of <strong>₹{(Number(formData.totalAdditionalLoan) || 0).toLocaleString()}</strong> 
            (consisting of ₹{(Number(formData.additionalCashLoan) || 0).toLocaleString()} Cash Loan/AR and ₹{(Number(formData.additionalEquipmentLoan) || 0).toLocaleString()} Equipment Loan). 
            This investment will be amortized at a rate of <strong>₹{formData.amortizationRatePerLitre}/Litre</strong> on actual purchases.
          </p>

          {/* SKU Table */}
          {formData.selectedSkus.length > 0 && (
            <div>
              <p className="font-bold mb-1.5">2. SKU Level Rebates and Incentives:</p>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-1.5 font-bold text-left">SKU Code</th>
                    <th className="border border-gray-200 p-1.5 font-bold text-left">SKU Name</th>
                    <th className="border border-gray-200 p-1.5 font-bold text-right">Commitment Vol</th>
                    <th className="border border-gray-200 p-1.5 font-bold text-right">Rebate (₹/L)</th>
                    <th className="border border-gray-200 p-1.5 font-bold text-right">Mix Inc (₹/L)</th>
                    <th className="border border-gray-200 p-1.5 font-bold text-right">Prod Inc (₹/L)</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.selectedSkus.map((sku) => (
                    <tr key={sku.id}>
                      <td className="border border-gray-200 p-1.5">{sku.skuCode}</td>
                      <td className="border border-gray-200 p-1.5">{sku.skuName}</td>
                      <td className="border border-gray-200 p-1.5 text-right">{(Number(sku.contractVolume) || 0).toLocaleString()} L</td>
                      <td className="border border-gray-200 p-1.5 text-right">₹{sku.skuRebate}</td>
                      <td className="border border-gray-200 p-1.5 text-right">₹{sku.mixIncentive}</td>
                      <td className="border border-gray-200 p-1.5 text-right">₹{sku.productTargetIncentive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Credit and security */}
          <p className="font-bold">3. Credit Terms &amp; Security:</p>
          <p>
            The commercial terms are backed by a credit limit of <strong>₹{(Number(formData.tradingCreditLimit) || 0).toLocaleString()}</strong> with credit payment terms of <strong>{formData.creditTerm} Days</strong>. 
            A bank guarantee of <strong>₹{(Number(formData.bgAmount) || 0).toLocaleString()}</strong> is required to secure the advance release.
          </p>

          <p className="font-bold">4. Secondary Transport Costs:</p>
          <p>
            Under this contract, a base secondary transport cost of <strong>₹{formData.secondaryTransportCost}/Litre</strong> is applicable for deliveries, which will be reconciled quarterly.
          </p>

          {/* Terms & Conditions Section (Redesigned with editable clauses) */}
          <div className="pt-2">
            <h4 className="font-extrabold text-[#005A2B] uppercase border-b border-[#005A2B] pb-1 mb-2">
              {sectionHeading}
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 font-semibold text-brand-gray">
              {clauses.map((clause, idx) => (
                <li 
                  key={idx} 
                  dangerouslySetInnerHTML={{ __html: clause }} 
                />
              ))}
            </ol>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between gap-8 flex-wrap">
            <div className="w-48 border-t border-brand-dark pt-1.5 text-center font-bold">
              For Castrol India Limited
              <p className="text-[10px] font-normal text-brand-gray mt-4">{salesRep}</p>
            </div>
            <div className="w-48 border-t border-brand-dark pt-1.5 text-center font-bold">
              Accepted by Partner
              <p className="text-[10px] font-normal text-brand-gray mt-4 font-bold">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
