"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

// Framer-motion variants
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: -12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 30,
      mass: 0.8,
      // stagger children slightly
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    filter: "blur(3px)",
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const CommandDialog = ({ children, open, onOpenChange }: CommandDialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Animated backdrop */}
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[101] bg-black/50 backdrop-blur-sm"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </DialogPrimitive.Overlay>

            {/* Animated modal */}
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={cn(
                  // Position
                  "fixed left-1/2 top-[22%] z-[102] -translate-x-1/2 -translate-y-0",
                  // Layout
                  "overflow-hidden",
                  // Sizing — wider
                  "w-[92vw] max-w-3xl",
                  // Shape
                  "rounded-2xl",
                  // Glass-morphism background
                  "bg-white/96 dark:bg-zinc-950/96 backdrop-blur-2xl",
                  // Border
                  "border border-gray-100/80 dark:border-zinc-800/60",
                  // Premium layered shadow
                  "shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18),0_4px_24px_-4px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.03)]",
                  "dark:shadow-[0_32px_80px_-12px_rgba(0,0,0,0.75),0_4px_24px_-4px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]",
                  // Focus ring
                  "outline-none"
                )}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Top gradient accent bar */}
                <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-primary-500/60 to-transparent pointer-events-none z-10" />

                <Command
                  className={cn(
                    // Group heading — lebih besar
                    "[&_[cmdk-group-heading]]:px-4",
                    "[&_[cmdk-group-heading]]:pt-5 [&_[cmdk-group-heading]]:pb-2",
                    "[&_[cmdk-group-heading]]:font-black",
                    "[&_[cmdk-group-heading]]:text-[11px]",
                    "[&_[cmdk-group-heading]]:uppercase",
                    "[&_[cmdk-group-heading]]:tracking-[0.18em]",
                    "[&_[cmdk-group-heading]]:text-gray-400/80 dark:[&_[cmdk-group-heading]]:text-zinc-500",
                    // Group wrapper
                    "[&_[cmdk-group]]:px-2",
                    // Input wrapper icon — lebih besar
                    "[&_[cmdk-input-wrapper]_svg]:h-6 [&_[cmdk-input-wrapper]_svg]:w-6",
                    // Input height — lebih tinggi
                    "[&_[cmdk-input]]:h-20",
                    // Item spacing — lebih longgar
                    "[&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-4",
                    // Item icon size — lebih besar
                    "[&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
                  )}
                >
                  {children}
                </Command>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center gap-4 border-b border-gray-100/80 dark:border-zinc-800/80 px-5"
    cmdk-input-wrapper=""
  >
    {/* Styled search icon — lebih besar */}
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10 shrink-0">
      <Search className="h-5 w-5 text-primary-500 dark:text-primary-400" />
    </div>
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-20 w-full rounded-md bg-transparent py-4",
        "text-base font-medium outline-none",
        "placeholder:text-gray-400/70 dark:placeholder:text-zinc-500",
        "text-gray-900 dark:text-zinc-100",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      // Taller list area
      "max-h-[540px] overflow-y-auto overflow-x-hidden",
      "p-3 pb-5",
      className
    )}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="flex flex-col items-center justify-center py-14 gap-3 text-gray-400 dark:text-zinc-600"
    {...props}
  >
    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-zinc-900 flex items-center justify-center mb-1 shadow-inner">
      <Search className="w-7 h-7 opacity-40" />
    </div>
    <span className="text-sm font-black uppercase tracking-[0.15em]">Tidak ditemukan</span>
    <span className="text-xs text-gray-300 dark:text-zinc-700 font-medium">Coba kata kunci lain</span>
  </CommandPrimitive.Empty>
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1",
      "text-gray-900 dark:text-zinc-100",
      "[&_[cmdk-group-heading]]:px-3",
      "[&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-2",
      "[&_[cmdk-group-heading]]:text-[11px]",
      "[&_[cmdk-group-heading]]:font-black",
      "[&_[cmdk-group-heading]]:uppercase",
      "[&_[cmdk-group-heading]]:tracking-[0.18em]",
      "[&_[cmdk-group-heading]]:text-gray-400/80 dark:[&_[cmdk-group-heading]]:text-zinc-500",
      className
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1.5 h-px",
      "bg-gradient-to-r from-transparent via-gray-100 to-transparent",
      "dark:via-zinc-800",
      className
    )}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      // Base layout — lebih longgar
      "relative flex cursor-pointer select-none items-center rounded-xl px-4 py-3.5 gap-4",
      // Typography — lebih besar
      "text-sm font-semibold text-gray-700 dark:text-zinc-300",
      // Transition
      "outline-none transition-all duration-150",
      // Selected: gradient background
      "data-[selected='true']:bg-gradient-to-r",
      "data-[selected='true']:from-primary-50 data-[selected='true']:to-primary-50/30",
      "dark:data-[selected='true']:from-zinc-800/80 dark:data-[selected='true']:to-zinc-800/30",
      "data-[selected='true']:text-primary-700 dark:data-[selected='true']:text-zinc-100",
      // Left accent bar on selected
      "before:absolute before:left-0 before:inset-y-2.5 before:w-[3px] before:rounded-full before:bg-transparent before:transition-colors",
      "data-[selected='true']:before:bg-primary-500",
      // Disabled
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto shrink-0",
        "text-[10px] font-black tracking-widest uppercase",
        "px-2.5 py-1 rounded-md",
        "bg-gray-100 dark:bg-zinc-800/80",
        "text-gray-400 dark:text-zinc-500",
        "border border-gray-200/80 dark:border-zinc-700/60",
        "shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
