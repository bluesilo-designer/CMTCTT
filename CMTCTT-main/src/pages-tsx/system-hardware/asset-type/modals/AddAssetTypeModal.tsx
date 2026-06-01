import { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { CheckCircle2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { assetCategories } from "@/data/systemHardware";
import type { AssetTypeData } from "../types";
import { STATUS_OPTIONS } from "../constants";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddAssetTypeModalProps {
  onClose: () => void;
  onAdd:   (t: AssetTypeData) => void;
}

interface FormValues {
  assetType:     string;
  assetCategory: string;
  code:          string;
  status:        string;
}

// ── Validation ────────────────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  assetType: Yup.string().trim().required("Asset Type is required"),
  code:      Yup.string().trim().required("Asset Type Code is required"),
  assetCategory: Yup.string(),
  status:        Yup.string(),
});

const initialValues: FormValues = { assetType: "", assetCategory: "", code: "", status: "" };

// ── Component ─────────────────────────────────────────────────────────────────

export function AddAssetTypeModal({ onClose, onAdd }: AddAssetTypeModalProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen,   setStatusOpen]   = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const statusRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (statusRef.current   && !statusRef.current.contains(e.target as Node))   setStatusOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const categoryOptions = assetCategories.map((c) => c.assetCategory);

  const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    onAdd({
      id:            `at-${Date.now()}`,
      no:            0,
      assetType:     values.assetType,
      assetCategory: values.assetCategory,
      code:          values.code,
      status:        (values.status || "Active") as "Active" | "Inactive",
      createdBy:     "Admin",
      createdByRole: "System-Admin",
      lastUpdatedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      }),
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-40 transition-opacity duration-200",
          mounted ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[480px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300",
          mounted ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Add New Asset Type</h2>
              <p className="text-xs text-gray-500 mt-0.5">Please fill all the information.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="flex flex-col flex-1 overflow-hidden">

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                {/* Asset Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Type <span className="text-brand-primary">*</span>
                  </label>
                  <Field
                    name="assetType"
                    type="text"
                    placeholder="Enter asset type (e.g, SAR21, etc)"
                    className={cn(
                      "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                      touched.assetType && errors.assetType ? "border-red-500" : "border-gray-200"
                    )}
                  />
                  {touched.assetType && errors.assetType && (
                    <p className="mt-1 text-xs text-red-500">{errors.assetType}</p>
                  )}
                </div>

                {/* Asset Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Category <span className="text-brand-primary">*</span>
                  </label>
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      onClick={() => setCategoryOpen(o => !o)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
                    >
                      <span className={values.assetCategory ? "text-gray-800" : "text-gray-400"}>
                        {values.assetCategory || "Select asset category"}
                      </span>
                      <ChevronDown size={14} className={cn("text-gray-400 transition-transform", categoryOpen && "rotate-180")} />
                    </button>
                    {categoryOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {categoryOptions.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setFieldValue("assetCategory", opt); setCategoryOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                              values.assetCategory === opt ? "text-brand-primary font-medium" : "text-gray-700"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Asset Type Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Type Code <span className="text-brand-primary">*</span>
                  </label>
                  <Field
                    name="code"
                    type="text"
                    placeholder="Enter asset type code (e.g, WPN, etc)"
                    className={cn(
                      "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                      touched.code && errors.code ? "border-red-500" : "border-gray-200"
                    )}
                  />
                  {touched.code && errors.code && (
                    <p className="mt-1 text-xs text-red-500">{errors.code}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-brand-primary">*</span>
                  </label>
                  <div className="relative" ref={statusRef}>
                    <button
                      type="button"
                      onClick={() => setStatusOpen(o => !o)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
                    >
                      <span className={values.status ? "text-gray-800" : "text-gray-400"}>
                        {values.status || "Select status"}
                      </span>
                      <ChevronDown size={14} className={cn("text-gray-400 transition-transform", statusOpen && "rotate-180")} />
                    </button>
                    {statusOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                        {STATUS_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setFieldValue("status", opt); setStatusOpen(false); }}
                            className={cn(
                              "w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                              values.status === opt ? "text-brand-primary font-medium" : "text-gray-700"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white justify-center"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-2.5 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors justify-center"
                >
                  Confirm
                </Button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
