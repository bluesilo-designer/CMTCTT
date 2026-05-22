import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  children: React.ReactNode | ((props: { contentRef: React.RefObject<HTMLDivElement | null> }) => React.ReactNode);
  open: boolean;
  onClose?: () => void;
  width?: string | number;
  title?: string;
  isUseX?: boolean;
}

const noop = () => {};

export const Modal = ({
  children,
  open,
  onClose = noop,
  width,
  title,
  isUseX = true,
}: ModalProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          ref={contentRef}
          style={{ width: width || "500px", maxWidth: "95vw" }}
          className={cn(
            "fixed left-[50%] top-[50%] z-[100000] translate-x-[-50%] translate-y-[-50%]",
            "bg-white rounded-xl shadow-lg p-6 focus:outline-none"
          )}
        >
          {title ? (
            <Dialog.Title className="text-xl font-semibold text-[#101828] mb-6">
              {title}
            </Dialog.Title>
          ) : (
            <Dialog.Title className="sr-only">Modal</Dialog.Title>
          )}
          
          <Dialog.Description className="sr-only">
            {title ? `${title} dialog` : "Dialog content"}
          </Dialog.Description>

          {isUseX && (
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                className="absolute top-[24px] right-[24px] cursor-pointer z-50 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={24} />
              </button>
            </Dialog.Close>
          )}

          <div className="relative">
            {typeof children === "function" ? children({ contentRef }) : children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
