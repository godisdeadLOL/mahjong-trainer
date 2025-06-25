type TooltipText = {
	children: any
	tooltip: string
}

export const TooltipText = ({ tooltip, children }: TooltipText) => {
	return (
		<span class="relative select-none underline group">
			{children}
			<div class="hidden text-center group-hover:block group-active:block absolute left-[50%] top-0 px-4 py-2 bg-background-elevate border-1 border-border rounded-xl -translate-y-[105%] -translate-x-[50%]">
				{tooltip}
			</div>
		</span>
	)
}
