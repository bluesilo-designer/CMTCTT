import { useRef, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Modal } from "@/components/modal-1";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { assetCategories } from "@/data/systemHardware";
import { STATUS_OPTIONS } from "../constants";
const validationSchema = Yup.object().shape({
    assetType: Yup.string().trim().required("Asset Type is required"),
    code: Yup.string().trim().required("Asset Type Code is required"),
    assetCategory: Yup.string(),
    status: Yup.string(),
});
const initialValues = {
    assetType: "",
    assetCategory: "",
    code: "",
    status: "",
};
// Named component so useEffect inside Formik render is valid
function AddAssetTypeForm({ onClose, onAdd, }) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const categoryRef = useRef(null);
    const statusRef = useRef(null);
    useEffect(() => {
        function handleClick(e) {
            if (categoryRef.current && !categoryRef.current.contains(e.target))
                setCategoryOpen(false);
            if (statusRef.current && !statusRef.current.contains(e.target))
                setStatusOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    const categoryOptions = assetCategories.map((c) => c.assetCategory);
    const handleSubmit = (values, { setSubmitting }) => {
        onAdd({
            id: `at-${Date.now()}`,
            no: 0,
            assetType: values.assetType,
            assetCategory: values.assetCategory,
            code: values.code,
            status: (values.status || "Active"),
            createdBy: "Admin",
            createdByRole: "System-Admin",
            lastUpdatedOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        });
        setSubmitting(false);
        onClose();
    };
    return (<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ errors, touched, values, setFieldValue }) => (<Form>
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-500"/>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Add New Asset Type</h2>
              <p className="text-sm text-gray-500 mt-0.5">Please fill all the information.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Asset Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Type <span className="text-brand-primary">*</span>
              </label>
              <Field name="assetType" type="text" placeholder="Enter asset type (e.g, SAR21, etc)" className={cn("w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary", touched.assetType && errors.assetType ? "border-red-500" : "border-gray-200")}/>
              {touched.assetType && errors.assetType && (<p className="mt-1 text-xs text-red-500">{errors.assetType}</p>)}
            </div>

            {/* Asset Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Category <span className="text-brand-primary">*</span>
              </label>
              <div className="relative" ref={categoryRef}>
                <button type="button" onClick={() => setCategoryOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white">
                  <span className={values.assetCategory ? "text-gray-800" : "text-gray-400"}>
                    {values.assetCategory || "Select asset category"}
                  </span>
                  <ChevronDown size={14} className={cn("text-gray-400 transition-transform", categoryOpen && "rotate-180")}/>
                </button>
                {categoryOpen && (<div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {categoryOptions.map((opt) => (<button key={opt} type="button" onClick={() => { setFieldValue("assetCategory", opt); setCategoryOpen(false); }} className={cn("w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors", values.assetCategory === opt ? "text-brand-primary font-medium" : "text-gray-700")}>
                        {opt}
                      </button>))}
                  </div>)}
              </div>
            </div>

            {/* Asset Type Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset Type Code <span className="text-brand-primary">*</span>
              </label>
              <Field name="code" type="text" placeholder="Enter asset type code (e.g, WPN, etc)" className={cn("w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary", touched.code && errors.code ? "border-red-500" : "border-gray-200")}/>
              {touched.code && errors.code && (<p className="mt-1 text-xs text-red-500">{errors.code}</p>)}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-brand-primary">*</span>
              </label>
              <div className="relative" ref={statusRef}>
                <button type="button" onClick={() => setStatusOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white">
                  <span className={values.status ? "text-gray-800" : "text-gray-400"}>
                    {values.status || "Select status"}
                  </span>
                  <ChevronDown size={14} className={cn("text-gray-400 transition-transform", statusOpen && "rotate-180")}/>
                </button>
                {statusOpen && (<div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {STATUS_OPTIONS.map((opt) => (<button key={opt} type="button" onClick={() => { setFieldValue("status", opt); setStatusOpen(false); }} className={cn("w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors", values.status === opt ? "text-brand-primary font-medium" : "text-gray-700")}>
                        {opt}
                      </button>))}
                  </div>)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-8">
            <Button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors">
              Confirm
            </Button>
          </div>
        </Form>)}
    </Formik>);
}
export function AddAssetTypeModal({ onClose, onAdd }) {
    return (<Modal open={true} onClose={onClose} isUseX={false}>
      <AddAssetTypeForm onClose={onClose} onAdd={onAdd}/>
    </Modal>);
}
