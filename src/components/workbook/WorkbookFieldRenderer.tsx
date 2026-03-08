import { WorkbookField } from "@/data/workbooks";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  field: WorkbookField;
  value: any;
  onChange: (value: any) => void;
}

export function WorkbookFieldRenderer({ field, value, onChange }: Props) {
  switch (field.type) {
    case "textarea":
      return (
        <div className="space-y-2">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[120px] bg-background border-border focus:border-primary"
          />
        </div>
      );

    case "text":
      return (
        <div className="space-y-2">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="bg-background border-border focus:border-primary"
          />
        </div>
      );

    case "currency":
      return (
        <div className="space-y-2">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-body">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || "0.00"}
              className="pl-7 bg-background border-border"
            />
          </div>
        </div>
      );

    case "percentage":
      return (
        <div className="space-y-2">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || "0"}
              className="pr-8 bg-background border-border"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-body">%</span>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-3">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {field.options?.map((option) => {
              const checked = Array.isArray(value) ? value.includes(option) : false;
              return (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/5 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(c) => {
                      const arr = Array.isArray(value) ? [...value] : [];
                      if (c) arr.push(option);
                      else {
                        const idx = arr.indexOf(option);
                        if (idx >= 0) arr.splice(idx, 1);
                      }
                      onChange(arr);
                    }}
                  />
                  <span className="text-sm font-body text-foreground">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-3">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <RadioGroup value={value || ""} onValueChange={onChange} className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent/5 cursor-pointer transition-colors"
              >
                <RadioGroupItem value={option} />
                <span className="text-sm font-body text-foreground">{option}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      );

    case "date":
      return (
        <div className="space-y-2">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="bg-background border-border"
          />
        </div>
      );

    case "slider":
      return (
        <div className="space-y-3">
          <Label className="font-body text-foreground font-medium">{field.label}</Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-body w-4">1</span>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[value || 5]}
              onValueChange={([v]) => onChange(v)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground font-body w-6">10</span>
          </div>
          <div className="text-center">
            <span className="inline-block bg-primary/10 text-primary font-display font-bold text-lg px-4 py-1 rounded-xl">
              {value || 5}
            </span>
          </div>
        </div>
      );

    case "repeating":
      return <RepeatingField field={field} value={value} onChange={onChange} />;

    default:
      return null;
  }
}

function RepeatingField({ field, value, onChange }: Props) {
  const rows: Record<string, any>[] = Array.isArray(value) ? value : [];

  const addRow = () => {
    const empty: Record<string, any> = {};
    field.columns?.forEach((col) => (empty[col.id] = ""));
    onChange([...rows, empty]);
  };

  const updateRow = (rowIdx: number, colId: string, val: any) => {
    const updated = rows.map((row, i) => (i === rowIdx ? { ...row, [colId]: val } : row));
    onChange(updated);
  };

  const removeRow = (rowIdx: number) => {
    onChange(rows.filter((_, i) => i !== rowIdx));
  };

  return (
    <div className="space-y-3">
      <Label className="font-body text-foreground font-medium">{field.label}</Label>
      <div className="space-y-3">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide">
                Entry {rowIdx + 1}
              </span>
              <Button variant="ghost" size="icon" onClick={() => removeRow(rowIdx)} className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field.columns?.map((col) => (
                <WorkbookFieldRenderer
                  key={col.id}
                  field={col}
                  value={row[col.id]}
                  onChange={(v) => updateRow(rowIdx, col.id, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addRow} className="gap-2">
        <Plus className="h-4 w-4" /> Add Entry
      </Button>
    </div>
  );
}
