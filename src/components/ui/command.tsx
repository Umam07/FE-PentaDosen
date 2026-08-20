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
      "flex h-full w-full flex-col overflow-hidden rounded-3xl bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark",
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
    scale: 0.96,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
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
                className="fixed inset-0 z-[101] bg-canvas-dark/60 backdrop-blur-xs"
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
                  "fixed left-1/2 top-[20%] z-[102] -translate-x-1/2 -translate-y-0",
                  "overflow-hidden",
                  "w-[92vw] max-w-2xl",
                  "rounded-3xl",
                  "bg-surface-light/98 dark:bg-surface-dark/98 backdrop-blur-2xl",
                  "border border-hairline-light dark:border-hairline-dark",
                  "shadow-2xl",
                  "outline-none"
                )}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Command
                  className={cn(
                    "[&_[cmdk-group-heading]]:px-4",
                    "[&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-1.5",
                    "[&_[cmdk-group-heading]]:font-bold",
                    "[&_[cmdk-group-heading]]:text-[10px]",
                    "[&_[cmdk-group-heading]]:uppercase",
                    "[&_[cmdk-group-heading]]:tracking-wider",
                    "[&_[cmdk-group-heading]]:text-muted dark:[&_[cmdk-group-heading]]:text-on-dark-muted",
                    "[&_[cmdk-group]]:px-2",
                    "[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5",
                    "[&_[cmdk-input]]:h-16",
                    "[&_[cmdk-item]]:px-3.5 [&_[cmdk-item]]:py-3",
                    "[&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4"
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
    className="flex items-center gap-3 border-b border-hairline-light dark:border-hairline-dark px-4.5"
    cmdk-input-wrapper=""
  >
    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted shrink-0">
      <Search className="h-4 w-4" />
    </div>
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-16 w-full rounded-md bg-transparent py-3",
        "text-sm font-medium outline-none",
        "placeholder:text-muted dark:placeholder:text-on-dark-muted",
        "text-ink-heading dark:text-on-dark",
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
      "max-h-[460px] overflow-y-auto overflow-x-hidden p-2 pb-4 custom-scrollbar",
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
    className="flex flex-col items-center justify-center py-12 gap-2 text-muted dark:text-on-dark-muted"
    {...props}
  >
    <div className="w-12 h-12 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center mb-1">
      <Search className="w-5 h-5 opacity-40" />
    </div>
    <span className="text-xs font-bold text-ink-heading dark:text-on-dark">Hasil tidak ditemukan</span>
    <span className="text-[11px] text-muted dark:text-on-dark-muted">Coba kata kunci pencarian yang lain</span>
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
      "overflow-hidden p-1 text-ink-heading dark:text-on-dark",
      "[&_[cmdk-group-heading]]:px-3",
      "[&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5",
      "[&_[cmdk-group-heading]]:text-[10px]",
      "[&_[cmdk-group-heading]]:font-bold",
      "[&_[cmdk-group-heading]]:uppercase",
      "[&_[cmdk-group-heading]]:tracking-wider",
      "[&_[cmdk-group-heading]]:text-muted dark:[&_[cmdk-group-heading]]:text-on-dark-muted",
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
      "-mx-1 my-1.5 h-px bg-hairline-light dark:bg-hairline-dark",
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
      "relative flex cursor-pointer select-none items-center rounded-xl px-3.5 py-3 gap-3",
      "text-xs sm:text-sm font-semibold text-body dark:text-on-dark-soft",
      "outline-none transition-all duration-150",
      "data-[selected='true']:bg-surface-light-raised dark:data-[selected='true']:bg-surface-dark-elevated",
      "data-[selected='true']:text-ink-heading dark:data-[selected='true']:text-on-dark",
      "before:absolute before:left-0 before:inset-y-2 before:w-[3px] before:rounded-full before:bg-transparent before:transition-colors",
      "data-[selected='true']:before:bg-accent dark:data-[selected='true']:before:bg-accent-on-dark",
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
        "text-[10px] font-mono font-semibold",
        "px-2 py-0.5 rounded-md",
        "bg-surface-light dark:bg-surface-dark-elevated",
        "text-muted dark:text-on-dark-muted",
        "border border-hairline-light dark:border-hairline-dark",
        "shadow-2xs",
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

