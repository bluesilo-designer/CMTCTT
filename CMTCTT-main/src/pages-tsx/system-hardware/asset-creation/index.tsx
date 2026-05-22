import { useState } from "react";
import { ArrowLeft, ArrowRight, Package, Tag, Hash, Layers, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/button";
import { FormField } from "./components/FormField";
import { ASSET_CATEGORIES, ASSET_TYPES, SITES, STATUS_OPTIONS, INITIAL_FORM_VALUES } from "./constants";
import type { AssetCreationProps, AssetCreationFormValues } from "./types";

const AssetCreationSchema = Yup.object().shape({
  assetName: Yup.string().trim().required("Asset name is required"),
  assetCategory: Yup.string().required("Please select a category"),
  serialNumber: Yup.string().trim().required("Serial number is required"),
  assetType: Yup.string().required("Please select an asset type"),
});

const fieldCls = (error?: string) =>
  cn(
    "w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors",
    error ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white hover:border-gray-300"
  );

export function AssetCreation({ onNavigate }: AssetCreationProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = (values: AssetCreationFormValues) => {
    setSubmittedName(values.assetName);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-screen flex-col bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Asset Created!</h2>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{submittedName}</span> has been
              successfully added to the system.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setSubmitted(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 bg-white"
              >
                Add Another
              </Button>
              <Button
                type="button"
                onClick={() => onNavigate?.("/system-hardware/assets-list")}
                className="flex-1 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary/90"
              >
                Back to List
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={AssetCreationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="flex h-screen flex-col bg-gray-50 overflow-hidden">
          {/* Top header bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={() => onNavigate?.("/system-hardware/assets-list")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-sm font-semibold text-gray-800">Asset Creation</h1>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => onNavigate?.("/system-hardware/assets-list")}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 bg-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 shadow-sm"
              >
                <ArrowRight size={14} />
                Add Asset
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-5">

              {/* Page intro */}
              <div>
                <h2 className="text-xl font-semibold text-brand-primary">Create an asset</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Provide asset details to register a new asset in the system.
                </p>
              </div>

              {/* Section 1 — Asset Details */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Package size={14} className="text-brand-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700">Asset Details</h3>
                </div>

                <div className="p-5 grid grid-cols-2 gap-4">
                  <FormField
                    label="Asset"
                    required
                    error={touched.assetName ? errors.assetName : undefined}
                  >
                    <Field

                      name="assetName"
                      type="text"
                      placeholder="e.g. SAR21, LMG, etc."
                      className={fieldCls(touched.assetName ? errors.assetName : undefined)}
                    />
                  </FormField>

                  <FormField
                    label="Asset Category"
                    required
                    error={touched.assetCategory ? errors.assetCategory : undefined}
                  >
                    <Field
                      as="select"
                      name="assetCategory"
                      className={fieldCls(touched.assetCategory ? errors.assetCategory : undefined)}
                    >
                      <option value="">Select asset category</option>
                      {ASSET_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Field>
                  </FormField>

                  <FormField
                    label="Asset Serial Number"
                    required
                    error={touched.serialNumber ? errors.serialNumber : undefined}
                  >
                    <Field

                      name="serialNumber"
                      type="text"
                      placeholder="Enter asset serial number"
                      className={fieldCls(touched.serialNumber ? errors.serialNumber : undefined)}
                    />
                  </FormField>

                  <FormField
                    label="Asset Type"
                    required
                    error={touched.assetType ? errors.assetType : undefined}
                  >
                    <Field
                      as="select"
                      name="assetType"
                      className={fieldCls(touched.assetType ? errors.assetType : undefined)}
                    >
                      <option value="">Select asset type</option>
                      {ASSET_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Field>
                  </FormField>
                </div>
              </div>

              {/* Section 2 — Hardware Info */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Tag size={14} className="text-blue-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700">Hardware Info</h3>
                </div>

                <div className="p-5 grid grid-cols-2 gap-4">
                  <FormField label="Asset Tag ID">
                    <div className="relative">
                      <Hash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
  
                        name="assetTagId"
                        type="text"
                        placeholder="e.g. 260427-SAR21003"
                        className={cn(fieldCls(), "pl-8")}
                      />
                    </div>
                  </FormField>

                  <FormField label="Initial Status">
                    <Field
                      as="select"
                      name="status"
                      className={fieldCls()}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Field>
                  </FormField>

                  <FormField label="Site / Location">
                    <div className="relative">
                      <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
                        as="select"
                        name="site"
                        className={cn(fieldCls(), "pl-8")}
                      >
                        <option value="">Select site</option>
                        {SITES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Field>
                    </div>
                  </FormField>

                  <FormField label="Number of Layers">
                    <div className="relative">
                      <Layers size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Field
  
                        name="layers"
                        type="number"
                        min={1}
                        placeholder="e.g. 1"
                        className={cn(fieldCls(), "pl-8")}
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Section 3 — Remarks */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                    <AlertCircle size={14} className="text-amber-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700">Remarks</h3>
                  <span className="text-xs text-gray-400 ml-1">(optional)</span>
                </div>

                <div className="p-5">
                  <Field
                    as="textarea"
                    name="remarks"
                    rows={3}
                    placeholder="Any additional notes about this asset..."
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary hover:border-gray-300 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Required note */}
              <p className="text-xs text-gray-400 text-right pb-2">
                Fields marked with <span className="text-brand-primary font-semibold">*</span> are required
              </p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
