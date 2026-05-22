import { useRef, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Modal } from "@/components/modal-1";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, RFID_LOCATION_OPTIONS, BASE_STATION_OPTIONS, GROUP_KEY_OPTIONS, GROUP_GPO_OPTIONS, } from "../constants";
const validationSchema = Yup.object().shape({
    portNumber: Yup.string().trim().required("Antenna Port Number is required"),
    antenna: Yup.string().trim().required("Antenna is required"),
    rfidLocation: Yup.string(),
    baseStation: Yup.string(),
    groupKey: Yup.string(),
    groupGpo: Yup.string(),
    status: Yup.string(),
});
const initialValues = {
    portNumber: "",
    antenna: "",
    rfidLocation: "",
    baseStation: "",
    groupKey: "",
    groupGpo: "",
    status: "",
};
// Named component to allow useEffect for dropdown outside-click handling inside Formik render
function AddAntennaForm({ onClose }) {
    const [rfidOpen, setRfidOpen] = useState(false);
    const [stationOpen, setStationOpen] = useState(false);
    const [groupKeyOpen, setGroupKeyOpen] = useState(false);
    const [groupGpoOpen, setGroupGpoOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const rfidRef = useRef(null);
    const stationRef = useRef(null);
    const groupKeyRef = useRef(null);
    const groupGpoRef = useRef(null);
    const statusRef = useRef(null);
    useEffect(() => {
        function handleClick(e) {
            if (rfidRef.current && !rfidRef.current.contains(e.target))
                setRfidOpen(false);
            if (stationRef.current && !stationRef.current.contains(e.target))
                setStationOpen(false);
            if (groupKeyRef.current && !groupKeyRef.current.contains(e.target))
                setGroupKeyOpen(false);
            if (groupGpoRef.current && !groupGpoRef.current.contains(e.target))
                setGroupGpoOpen(false);
            if (statusRef.current && !statusRef.current.contains(e.target))
                setStatusOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    const handleSubmit = (_values, { setSubmitting }) => {
        setSubmitting(false);
        onClose();
    };
    return (<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ errors, touched, values, setFieldValue }) => {
            const DropdownField = ({ label, required, fieldName, placeholder, open, setOpen, options, dropRef, }) => (<div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-brand-primary">*</span>}
            </label>
            <div className="relative" ref={dropRef}>
              <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white">
                <span className={values[fieldName] ? "text-gray-800" : "text-gray-400"}>
                  {values[fieldName] || placeholder}
                </span>
                <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")}/>
              </button>
              {open && (<div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {options.map((opt) => (<button key={opt} type="button" onClick={() => { setFieldValue(fieldName, opt); setOpen(false); }} className={cn("w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors", values[fieldName] === opt ? "text-brand-primary font-medium" : "text-gray-700")}>
                      {opt}
                    </button>))}
                </div>)}
            </div>
          </div>);
            return (<Form>
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-500"/>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add New Antenna</h2>
                <p className="text-sm text-gray-500 mt-0.5">Please fill all the information.</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Antenna Port Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antenna Port Number <span className="text-brand-primary">*</span>
                </label>
                <Field name="portNumber" type="text" placeholder="Enter antenna port number (e.g, JX3621390195, etc)" className={cn("w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary", touched.portNumber && errors.portNumber ? "border-red-500" : "border-gray-200")}/>
                {touched.portNumber && errors.portNumber && (<p className="mt-1 text-xs text-red-500">{errors.portNumber}</p>)}
              </div>

              {/* Antenna */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Antenna <span className="text-brand-primary">*</span>
                </label>
                <Field name="antenna" type="text" placeholder="Enter antenna (e.g, Antenna 1, etc)" className={cn("w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary", touched.antenna && errors.antenna ? "border-red-500" : "border-gray-200")}/>
                {touched.antenna && errors.antenna && (<p className="mt-1 text-xs text-red-500">{errors.antenna}</p>)}
              </div>

              <DropdownField label="RFID Reader Location" required fieldName="rfidLocation" placeholder="Select RFID reader location" open={rfidOpen} setOpen={setRfidOpen} dropRef={rfidRef} options={RFID_LOCATION_OPTIONS}/>

              <DropdownField label="Base Station" fieldName="baseStation" placeholder="Select station" open={stationOpen} setOpen={setStationOpen} dropRef={stationRef} options={BASE_STATION_OPTIONS}/>

              <DropdownField label="Group Key" fieldName="groupKey" placeholder="Select group key" open={groupKeyOpen} setOpen={setGroupKeyOpen} dropRef={groupKeyRef} options={GROUP_KEY_OPTIONS}/>

              <DropdownField label="Group GPO" fieldName="groupGpo" placeholder="Select group GPO" open={groupGpoOpen} setOpen={setGroupGpoOpen} dropRef={groupGpoRef} options={GROUP_GPO_OPTIONS}/>

              <DropdownField label="Status" required fieldName="status" placeholder="Select status" open={statusOpen} setOpen={setStatusOpen} dropRef={statusRef} options={STATUS_OPTIONS}/>
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
          </Form>);
        }}
    </Formik>);
}
export function AddAntennaModal({ onClose }) {
    return (<Modal open={true} onClose={onClose} isUseX={false}>
      <AddAntennaForm onClose={onClose}/>
    </Modal>);
}
