import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import { LogoIcon } from "../../shared-components/LogoIcon";

export default function FullWidthDrawer({
	className,
	bodyClassname,
	isRounded = true,
	isHeightScreen = false,
	size,
	children,
	open,
	onClose,
	title = '',
	subline,
	footer=null,
	fullWidth = false
}) {
	return (
		<>
			<Dialog open={open} onClose={onClose} className="relative z-50">
				<div className="fixed inset-0" style={{background: "#00000040"}} />
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div
							className={`pointer-events-none md:h-full ${
								isHeightScreen ? "h-screen" : "max-md:max-h-[80%]"
							} fixed md:inset-y-0 bottom-0 md:right-0 flex ${fullWidth ? "w-full" : "max-w-2xl"}  `}>
							<DialogPanel
								transition
								className={`pointer-events-auto transform transition duration-500 ease-in-out max-md:data-[closed]:translate-y-full md:data-[closed]:translate-x-full sm:duration-700 overflow-hidden w-screen`}
								// style={{width:size?size:'100%'}}
							>
								<div
									className={`flex h-full w-full flex-col bg-white ${
										isRounded ? "rounded-[28px]" : "rounded-none"
									} md:rounded-none shadow-xl`}>
									<div className="px-4 py-4 sm:px-6 w-full border-b">
										
										<div className="flex items-center justify-between">
											<div className="flex justify-start items-center gap-4 w-full">
												{/* <LogoIcon className="h-10 w-auto" /> */}
												<span className="h-8 bg-gray-600 w-[1.5px]"></span>
												<h4 className="text-bodyMdMedium text-gray-800 font-body capitalize">{title}</h4>
											</div>
											<div>
												<button
													type="button"
													onClick={() => onClose(false)}
													className="bg-primitive-25 text-gray-800 p-2 rounded-full">
													<XMarkIcon className="size-4" />
												</button>
												{/* <Button type="button" variant="secondary" size="md" onClick={() => onClose(false)} >
													<p className="flex flex-row justify-center items-center gap-2">
														<XMarkIcon className="size-6 font-medium" />
														<span>Close</span>
													</p>
												</Button> */}
											</div>
										</div>
									</div>
									<div
										className={`relative flex-1 overflow-y-auto w-full ${
											bodyClassname ?? ""
										}`}>
										{children}
									</div>
									{footer}
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	);
}
