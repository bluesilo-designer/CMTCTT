import { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { CheckCircle2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import {
  STATUS_OPTIONS,
  RFID_LOCATION_OPTIONS,
  BASE_STATION_OPTIONS,
  GROUP_KEY_OPTIONS,
  GROUP_GPO_OPTIONS,
} from "../constants";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AddAntennaModalProps {
  onClose: () => void;
}

interface FormValues {
  portNumber:   string;
  antenna:      string;
  rfidLocation: string;
  baseStation:  string;
  groupKey:     string;
  groupGpo:     string;
  status:       string;
}

// ── Validation ────────────────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  portNumber:   Yup.string().trim().required("Antenna Port Number is required"),
  antenna:      Yup.string().trim().required("Antenna is required"),
  rfidLocation: Yup.string(),
  baseStation:  Yup.string(),
  groupKey:     Yup.string(),
  groupGpo:     Yup.string(),
  status:       Yup.string(),
});

const initialValues: FormValues = {
  portNumber: "", antenna: "", rfidLocation: "",
  baseStation: "", groupKey: "", groupGpo: "", status: "",
};

// ── Reusable dropdown field ───────────────────────────────────────────────────

function DropdownField({
  label, required, placeholder, open, setOpen, options, dropRef, value, onSelect,
}: {
  label:     string;
  required?: boolean;
  placeholder: string;
  open:      boolean;
  setOpen:   (v: boolean) => void;
  options:   readonly string[];
  dropRef:   React.RefObject<HTMLDivElement | null>;
  value:     string;
  onSelect:  (opt: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-brand-primary">*</span>}
      </label>
      <div className="relative" ref={dropRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white"
        >
          <span className={value ? "text-gray-800" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onSelect(opt); setOpen(false); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                  value === opt ? "text-brand-primary font-medium" : "text-gray-700"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AddAntennaModal({ onClose }: AddAntennaModalProps) {
  const [rfidOpen,     setRfidOpen]     = useState(false);
  const [stationOpen,  setStationOpen]  = useState(false);
  const [groupKeyOpen, setGroupKeyOpen] = useState(false);
  const [groupGpoOpen, setGroupGpoOpen] = useState(false);
  const [statusOpen,   setStatusOpen]   = useState(false);
  const [mounted,      setMounted]      = useState(false);

  const rfidRef     = useRef<HTMLDivElement>(null);
  const stationRef  = useRef<HTMLDivElement>(null);
  const groupKeyRef = useRef<HTMLDivElement>(null);
  const groupGpoRef = useRef<HTMLDivElement>(null);
  const statusRef   = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rfidRef.current     && !rfidRef.current.contains(e.target     as Node)) setRfidOpen(false);
      if (stationRef.current  && !stationRef.current.contains(e.target  as Node)) setStationOpen(false);
      if (groupKeyRef.current && !groupKeyRef.current.contains(e.target as Node)) setGroupKeyOpen(false);
      if (groupGpoRef.current && !groupGpoRef.current.contains(e.target as Node)) setGroupGpoOpen(false);
      if (statusRef.current   && !statusRef.current.contains(e.target   as Node)) setStatusOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (_values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
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
              <h2 className="text-base font-bold text-gray-900">Add New Antenna</h2>
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

                {/* Antenna Port Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Antenna Port Number <span className="text-brand-primary">*</span>
                  </label>
                  <Field
                    name="portNumber"
                    type="text"
                    placeholder="Enter antenna port number (e.g, JX3621390195, etc)"
                    className={cn(
                      "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                      touched.portNumber && errors.portNumber ? "border-red-500" : "border-gray-200"
                    )}
                  />
                  {touched.portNumber && errors.portNumber && (
                    <p className="mt-1 text-xs text-red-500">{errors.portNumber}</p>
                  )}
                </div>

                {/* Antenna */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Antenna <span className="text-brand-primary">*</span>
                  </label>
                  <Field
                    name="antenna"
                    type="text"
                    placeholder="Enter antenna (e.g, Antenna 1, etc)"
                    className={cn(
                      "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                      touched.antenna && errors.antenna ? "border-red-500" : "border-gray-200"
                    )}
                  />
                  {touched.antenna && errors.antenna && (
                    <p className="mt-1 text-xs text-red-500">{errors.antenna}</p>
                  )}
                </div>

                <DropdownField
                  label="RFID Reader Location" required
                  placeholder="Select RFID reader location"
                  open={rfidOpen} setOpen={setRfidOpen} dropRef={rfidRef}
                  options={RFID_LOCATION_OPTIONS}
                  value={values.rfidLocation}
                  onSelect={(opt) => setFieldValue("rfidLocation", opt)}
                />

                <DropdownField
                  label="Base Station"
                  placeholder="Select station"
                  open={stationOpen} setOpen={setStationOpen} dropRef={stationRef}
                  options={BASE_STATION_OPTIONS}
                  value={values.baseStation}
                  onSelect={(opt) => setFieldValue("baseStation", opt)}
                />

                <DropdownField
                  label="Group Key"
                  placeholder="Select group key"
                  open={groupKeyOpen} setOpen={setGroupKeyOpen} dropRef={groupKeyRef}
                  options={GROUP_KEY_OPTIONS}
                  value={values.groupKey}
                  onSelect={(opt) => setFieldValue("groupKey", opt)}
                />

                <DropdownField
                  label="Group GPO"
                  placeholder="Select group GPO"
                  open={groupGpoOpen} setOpen={setGroupGpoOpen} dropRef={groupGpoRef}
                  options={GROUP_GPO_OPTIONS}
                  value={values.groupGpo}
                  onSelect={(opt) => setFieldValue("groupGpo", opt)}
                />

                <DropdownField
                  label="Status" required
                  placeholder="Select status"
                  open={statusOpen} setOpen={setStatusOpen} dropRef={statusRef}
                  options={STATUS_OPTIONS}
                  value={values.status}
                  onSelect={(opt) => setFieldValue("status", opt)}
                />

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
