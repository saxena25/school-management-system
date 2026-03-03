import clsx from "clsx";

export default function Container({className, ...props}) {
	return (
		<div
			className={clsx("mx-auto w-full max-w-[1400px] px-0 md:px-6", className)}
			{...props}
		></div>
	);
}
