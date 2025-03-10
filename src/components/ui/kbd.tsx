import * as React from "react"

import { cn } from "@/lib/utils"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => {
    return (
        <kbd
            className={cn(
                "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
                className,
            )}
            {...props}
            ref={ref}
        />
    )
})
Kbd.displayName = "Kbd"

export { Kbd }

