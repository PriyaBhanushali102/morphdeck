import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const AlertDialogContext = React.createContext({});

const AlertDialog = ({ open, onOpenChange, children }) => (
  <AlertDialogContext.Provider value={{ open, onOpenChange }}>
    {children}
  </AlertDialogContext.Provider>
);

const AlertDialogTrigger = ({ children, asChild }) => {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: () => onOpenChange(true) });
  }
  return <button onClick={() => onOpenChange(true)}>{children}</button>;
};

const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(AlertDialogContext);

  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative z-10 grid w-full max-w-lg gap-4 border border-border bg-background p-6 shadow-xl rounded-xl mx-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
});
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-left", className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2", className)}
    {...props}
  />
);

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground flex items-center gap-2", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = React.forwardRef(({ className, onClick, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        "border border-border bg-background text-foreground hover:bg-muted",
        "focus:outline-none focus:ring-2 focus:ring-border",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    >
      {children}
    </button>
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};