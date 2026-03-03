import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Drawer({
	className,
	bodyClassname,
	isRounded = true,
	containerPadding = '6',
	isHeightScreen = false,
	size,
	children,
	open,
	onClose,
	title,
	subline,
	footer=null
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
							} fixed md:inset-y-0 bottom-0 md:right-0 flex max-w-full `}>
							<DialogPanel
								transition
								className={`pointer-events-auto transform transition duration-500 ease-in-out max-md:data-[closed]:translate-y-full md:data-[closed]:translate-x-full sm:duration-700 overflow-hidden w-screen ${
									size ?? "md:max-w-2xl"
								} ${className ?? ""}`}
								// style={{width:size?size:'100%'}}
							>
								<div
									className={`flex h-full w-full flex-col bg-white ${
										isRounded ? "rounded-[28px]" : "rounded-none"
									} md:rounded-none shadow-xl`}>
									<div className="px-10 py-4 w-full border-b">
										<div className="flex items-center justify-between">
											<div>
												{title ? (
													<div className="text-h5 text-text font-heading">
														{typeof title === "string" ? (
															<DialogTitle>{title}</DialogTitle>
														) : (
															title
														)}
													</div>
												) : (
													<div />
												)}
												{subline ? (
													<p className="text-gray-800 text-bodyMd font-body capitalize">
														{subline}
													</p>
												) : null}
											</div>
											<div>
												<button
													type="button"
													onClick={() => onClose(false)}
													className="bg-primitive-25 text-gray-800 p-2 rounded-full">
													<XMarkIcon className="size-4" />
												</button>
											</div>
										</div>
									</div>
									<div
										className={`relative flex-1 overflow-y-auto px-${containerPadding} pt-${containerPadding} w-full ${
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
