import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { bookings } from "@/data/mock";
import {
  operators,
  armskokePersonnelOperators,
  assignmentTypes,
  baseStations,
  baseStationBookings,
} from "@/data/systemHardware";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { SectionCard } from "./components/SectionCard";
import { FieldDropdown } from "./components/FieldDropdown";
import { RightPanel } from "./components/RightPanel";
import { CoursewareModal } from "./modals/CoursewareModal";
import { INITIAL_FORM_VALUES } from "./constants";
import type { AssignmentSource, CreateAssignmentFormValues } from "./types";

const assignmentSchema = Yup.object().shape({
  operator: Yup.string().required("Operator is required"),
  personnelOperator: Yup.string().required("Armskote Personnel is required"),
  assignmentType: Yup.string().required("Assignment Type is required"),
  baseStation: Yup.string().required("Base Station is required"),
  bookingIds: Yup.array().of(Yup.string()),
});

function extractTimeStr(bookingTime: string): string {
  if (!bookingTime) return "";
  const m = bookingTime.match(
    /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*(\(.*?\))/i
  );
  if (m) return `${m[1].trim()}-${m[2].trim()} ${m[3]}`;
  const parts = bookingTime.split("\n");
  return (parts[parts.length - 1] || "").trim();
}

interface InnerFormProps {
  onNavigate?: (path: string) => void;
}

function InnerForm({ onNavigate }: InnerFormProps) {
  const { values, setFieldValue } = useFormikContext<CreateAssignmentFormValues>();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showCoursewareModal, setShowCoursewareModal] = useState(false);
  const [preSelectedBooking, setPreSelectedBooking] = useState<any>(null);
  const [coursewareConfirmed, setCoursewareConfirmed] = useState(false);
  const [assignmentSource, setAssignmentSource] = useState<AssignmentSource>({ type: "create" });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let bookingId = searchParams.get("bookingId");
    let fromBooking = searchParams.get("fromBooking");

    if (!bookingId) {
      const hash = window.location.hash;
      const bookingIdMatch = hash.match(/bookingId=([^&]+)/);
      if (bookingIdMatch) bookingId = bookingIdMatch[1];
      const fromBookingMatch = hash.match(/fromBooking=([^&]+)/);
      if (fromBookingMatch) fromBooking = fromBookingMatch[1];
    }

    if (bookingId) {
      const booking = bookings.find((b) => b.id === bookingId);
      if (booking) {
        if (fromBooking && fromBooking === "true") {
          setAssignmentSource({ type: "booking", bookingData: booking });
          const assignmentTypeFromSection =
            booking.sectionType === "Standalone" ? "Single Booking" : "";
          const baseStationFromBooking = booking.assignedStations?.[0] || "";
          setFieldValue("assignmentType", assignmentTypeFromSection);
          setFieldValue("baseStation", baseStationFromBooking);
          setFieldValue("bookingIds", [booking.id]);
          setPreSelectedBooking(booking);
          setShowCoursewareModal(true);
        } else {
          setPreSelectedBooking(booking);
          setShowCoursewareModal(true);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLocked = coursewareConfirmed || assignmentSource.type === "booking";

  const availableBookings: string[] = coursewareConfirmed
    ? [preSelectedBooking?.id].filter(Boolean)
    : values.baseStation
      ? baseStationBookings[values.baseStation] || []
      : [];

  const isFormValid = !!(
    values.operator &&
    values.personnelOperator &&
    values.assignmentType &&
    values.baseStation
  );

  const handleCoursewareConfirm = () => {
    if (preSelectedBooking) {
      setFieldValue("bookingIds", [preSelectedBooking.id]);
      setCoursewareConfirmed(true);
      setShowCoursewareModal(false);
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    if (isLocked && (dropdown === "assignmentType" || dropdown === "baseStation")) return;
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownSelect = (field: string, value: string) => {
    if (field === "baseStation") {
      setFieldValue(field, value);
      setFieldValue("bookingIds", []);
    } else {
      setFieldValue(field, value);
    }
    setOpenDropdown(null);
  };

  const toggleBooking = (bookingId: string) => {
    const current: string[] = values.bookingIds;
    const next = current.includes(bookingId)
      ? current.filter((id) => id !== bookingId)
      : [...current, bookingId];
    setFieldValue("bookingIds", next);
  };

  return (
    <>
      {showCoursewareModal && (
        <CoursewareModal
          preSelectedBooking={preSelectedBooking}
          onConfirm={handleCoursewareConfirm}
          onClose={() => {
            setShowCoursewareModal(false);
            setPreSelectedBooking(null);
          }}
        />
      )}

      <Form
        className="flex-1 overflow-auto bg-gray-50"
        onClick={() => setOpenDropdown(null)}
      >
        {/* Top nav bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => onNavigate?.("/system-hardware/assignment-list")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
              <ArrowLeft size={14} />
              Assignments
            </button>
            <span className="text-gray-300 select-none">›</span>
            <span className="text-gray-900 font-semibold">New Assignment</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              onClick={() => onNavigate?.("/system-hardware/assignment-list")}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!isFormValid}
              onClick={() => {
                if (isFormValid) {
                  onNavigate?.(`/system-hardware/issue-assets?baseStation=${values.baseStation}&bookingIds=${values.bookingIds.join(",")}`);
                }
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors w-auto",
                isFormValid
                  ? "bg-red-800 text-white hover:bg-red-900 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              Create Assignment <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* Page body */}
        <div className="p-6" onClick={(e) => e.stopPropagation()}>
          <div
            className={cn(
              "flex gap-6 items-start",
              assignmentSource.type !== "booking" && "max-w-2xl mx-auto"
            )}
          >
            {/* Left: form */}
            <div className="w-1/2 min-w-0 space-y-3">
              {/* Title */}
              <div>
                <h1 className="text-xl font-semibold text-brand-primary">New Assignment</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Complete all required fields to create and issue an assignment.
                </p>
              </div>

              {/* 1. Personnel */}
              <SectionCard title="Personnel">
                <div className="grid grid-cols-2 gap-3">
                  <FieldDropdown
                    id="operator"
                    label="Operator"
                    value={values.operator}
                    placeholder="Select operator"
                    options={operators}
                    openDropdown={openDropdown}
                    onToggle={handleDropdownToggle}
                    onSelect={handleDropdownSelect}
                  />
                  <FieldDropdown
                    id="personnelOperator"
                    label="Armskote Personnel"
                    value={values.personnelOperator}
                    placeholder="Select personnel"
                    options={armskokePersonnelOperators}
                    openDropdown={openDropdown}
                    onToggle={handleDropdownToggle}
                    onSelect={handleDropdownSelect}
                  />
                </div>
              </SectionCard>

              {/* 2. Assignment Configuration */}
              <SectionCard title="Assignment Configuration">
                <div className="grid grid-cols-2 gap-3">
                  <FieldDropdown
                    id="assignmentType"
                    label="Assignment Type"
                    value={values.assignmentType}
                    placeholder="Select type"
                    options={assignmentTypes}
                    locked={isLocked}
                    openDropdown={openDropdown}
                    onToggle={handleDropdownToggle}
                    onSelect={handleDropdownSelect}
                  />
                  <FieldDropdown
                    id="baseStation"
                    label="Base Station"
                    value={values.baseStation}
                    placeholder="Select station"
                    options={baseStations}
                    locked={isLocked}
                    openDropdown={openDropdown}
                    onToggle={handleDropdownToggle}
                    onSelect={handleDropdownSelect}
                  />
                </div>
              </SectionCard>

              {/* 3. Booking */}
              <SectionCard title="Booking">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      Booking ID(s)
                      {assignmentSource.type !== "booking" && (
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded normal-case tracking-normal">
                          Optional
                        </span>
                      )}
                      {assignmentSource.type === "booking" && (
                        <span className="text-red-500 normal-case">*</span>
                      )}
                    </label>
                    {values.bookingIds.length > 0 && !isLocked && (
                      <span className="text-xs text-gray-400">
                        {values.bookingIds.length} selected
                      </span>
                    )}
                  </div>

                  {/* From booking — show locked booking card */}
                  {assignmentSource.type === "booking" && assignmentSource.bookingData ? (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-800 text-white">
                      <div className="w-2 h-2 rounded-full bg-white/70 mt-1.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm leading-snug">
                          {assignmentSource.bookingData.program}
                        </p>
                        <p className="text-xs text-red-200 mt-0.5">
                          {assignmentSource.bookingData.bookingId}
                        </p>
                        <p className="text-xs text-red-200 mt-0.5">
                          {assignmentSource.bookingData.bookingDate} &middot;{" "}
                          {extractTimeStr(assignmentSource.bookingData.bookingTime)}
                        </p>
                      </div>
                    </div>
                  ) : availableBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        {values.baseStation
                          ? "No bookings for this station"
                          : "No base station selected"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {values.baseStation
                          ? "No upcoming bookings found. You may proceed without selecting a booking."
                          : "Select a base station above to see available bookings, or proceed without one."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {availableBookings.map((bookingId) => {
                        const booking = bookings.find((b) => b.id === bookingId);
                        const isChecked = values.bookingIds.includes(bookingId);
                        return (
                          <label
                            key={bookingId}
                            className={cn(
                              "flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors",
                              isChecked
                                ? "bg-red-50 border-red-200"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() => toggleBooking(bookingId)}
                              disabled={coursewareConfirmed}
                              size={16}
                            />
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "text-sm font-medium leading-snug",
                                  isChecked ? "text-red-900" : "text-gray-800"
                                )}
                              >
                                {booking?.program || bookingId}
                              </p>
                              {booking && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {booking.bookingId} &middot; {booking.bookingDate}
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Right: booking summary panel */}
            {assignmentSource.type === "booking" && (
              <RightPanel
                bookingData={assignmentSource.bookingData}
                extractTimeStr={extractTimeStr}
              />
            )}
          </div>
        </div>
      </Form>
    </>
  );
}

export function CreateAssignment({ onNavigate }: { onNavigate?: (path: string) => void }) {
  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={assignmentSchema}
      onSubmit={() => {}}
    >
      <InnerForm onNavigate={onNavigate} />
    </Formik>
  );
}
