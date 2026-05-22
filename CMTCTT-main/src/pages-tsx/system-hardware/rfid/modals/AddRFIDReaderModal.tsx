import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/modal-1";
import { Button } from "@/components/button";
import { ReaderFormFields } from "../components/ReaderFormFields";
import type { RFIDReader, ReaderFormValues } from "../types";

const validationSchema = Yup.object().shape({
  macAddress: Yup.string().required("RFID Reader Mac Address is required"),
  ipAddress: Yup.string().required("RFID Reader IP Address is required"),
  displayName: Yup.string().required("RFID Reader Display Name is required"),
  mqttTopic: Yup.string().required("MQTT Topic is required"),
  serialNumber: Yup.string().required("RFID Reader Serial Number is required"),
  firmwareVersion: Yup.string(),
  status: Yup.string().required("Status is required"),
});

const initialValues: ReaderFormValues = {
  macAddress: "",
  ipAddress: "",
  displayName: "",
  mqttTopic: "",
  serialNumber: "",
  firmwareVersion: "",
  status: "",
};

interface AddRFIDReaderModalProps {
  onClose: () => void;
  onAdd: (reader: RFIDReader) => void;
}

export function AddRFIDReaderModal({ onClose, onAdd }: AddRFIDReaderModalProps) {
  const handleSubmit = (values: ReaderFormValues) => {
    onAdd({
      id: `r${Date.now()}`,
      no: 0,
      displayName: values.displayName,
      macAddress: values.macAddress,
      ipAddress: values.ipAddress,
      serialNumber: values.serialNumber,
      firmwareVersion: values.firmwareVersion,
      status: values.status as "Active" | "Inactive",
      armStatus: "Disarm",
    });
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} isUseX={false} width={480}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add New RFID Reader</h2>
                <p className="text-sm text-gray-500 mt-0.5">Please fill all the information.</p>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <ReaderFormFields formik={formik} />
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
              >
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
