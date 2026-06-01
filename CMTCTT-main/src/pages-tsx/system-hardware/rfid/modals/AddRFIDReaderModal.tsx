import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { ReaderFormFields } from "../components/ReaderFormFields";
import type { RFIDReader, ReaderFormValues } from "../types";

// ── Validation ────────────────────────────────────────────────────────────────

const validationSchema = Yup.object().shape({
  macAddress:      Yup.string().required("RFID Reader Mac Address is required"),
  ipAddress:       Yup.string().required("RFID Reader IP Address is required"),
  displayName:     Yup.string().required("RFID Reader Display Name is required"),
  mqttTopic:       Yup.string().required("MQTT Topic is required"),
  serialNumber:    Yup.string().required("RFID Reader Serial Number is required"),
  firmwareVersion: Yup.string(),
  status:          Yup.string().required("Status is required"),
});

const initialValues: ReaderFormValues = {
  macAddress: "", ipAddress: "", displayName: "",
  mqttTopic: "", serialNumber: "", firmwareVersion: "", status: "",
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddRFIDReaderModalProps {
  onClose: () => void;
  onAdd:   (reader: RFIDReader) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AddRFIDReaderModal({ onClose, onAdd }: AddRFIDReaderModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 10); return () => clearTimeout(t); }, []);

  const handleSubmit = (values: ReaderFormValues) => {
    onAdd({
      id:              `r${Date.now()}`,
      no:              0,
      displayName:     values.displayName,
      macAddress:      values.macAddress,
      ipAddress:       values.ipAddress,
      serialNumber:    values.serialNumber,
      firmwareVersion: values.firmwareVersion,
      status:          values.status as "Active" | "Inactive",
      armStatus:       "Disarm",
    });
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
              <h2 className="text-base font-bold text-gray-900">Add New RFID Reader</h2>
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
          {(formik) => (
            <Form className="flex flex-col flex-1 overflow-hidden">

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <ReaderFormFields formik={formik} />
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
