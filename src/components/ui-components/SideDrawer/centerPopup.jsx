import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
// import { ClockIcon, CloseIcon } from "../../icons";

export default function CenterDrawer({ open, onClose, children }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Centered container */}
        <div className="fixed inset-0 flex items-center justify-center">
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            
            <Dialog.Panel className="w-full max-w-3xl rounded-md bg-white shadow-xl border-2 border-primary-meadow relative">
              {/* <Dialog.Title className="text-lg font-semibold">
                Center Drawer
              </Dialog.Title> */}
              <button onClick={()=> onClose(false) } className="absolute -top-10 -right-10">Close</button>

              <div className="relative overflow-auto rounded-md">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
