import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CheckboxFieldProps = {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  error?: string;
  className?: string;
  description?: string;
};

export function CheckboxField({
  id,
  label,
  value,
  onChange,
  required,
  error,
  className,
  description,
}: CheckboxFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start space-x-2">
        <Checkbox
          id={id}
          checked={value}
          onCheckedChange={(checked) => onChange(!!checked)}
          className={error ? "border-destructive" : ""}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-desc` : undefined}
        />
        <div className="space-y-1">
          <Label
            htmlFor={id}
            className="font-normal cursor-pointer leading-none"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {description && (
            <p id={`${id}-desc`} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}






