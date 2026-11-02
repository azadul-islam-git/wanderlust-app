"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type EditableDestination = {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const categories = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
];

/** Filled input style shared by Input, Textarea, and SelectTrigger. */
const fieldBox =
  "h-9 rounded-md border border-transparent bg-slate-50 px-3 focus-visible:bg-white";

type FormState = Omit<EditableDestination, "_id">;
type FieldName = keyof FormState;
type Errors = Partial<Record<FieldName, string>>;

function isPositiveNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateForm(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Destination name is required";
  if (!form.country.trim()) errors.country = "Country is required";
  if (!form.price.trim()) {
    errors.price = "Price is required";
  } else if (!isPositiveNumber(form.price.trim())) {
    errors.price = "Enter a valid price";
  }
  if (!form.duration.trim()) errors.duration = "Duration is required";
  if (!form.departureDate) errors.departureDate = "Departure date is required";
  if (!form.description.trim()) errors.description = "Description is required";
  if (form.imageUrl.trim() && !isValidHttpUrl(form.imageUrl.trim())) {
    errors.imageUrl = "Enter a valid URL";
  }
  return errors;
}

export function EditDestination({
  id,
  destination,
}: {
  id: string;
  destination: EditableDestination;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: destination.name,
    country: destination.country,
    category: destination.category,
    price: destination.price,
    duration: destination.duration,
    departureDate: destination.departureDate,
    imageUrl: destination.imageUrl,
    description: destination.description,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField(name: FieldName, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    updateField(event.target.name as FieldName, event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`http://localhost:8000/destination/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`PATCH failed (${res.status})`);
      setOpen(false);
      // Re-run the server component so the page shows the updated values.
      router.refresh();
    } catch {
      setSaveError("Couldn't save your changes. Is the backend running?");
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      // Reset to the latest server values when closing without saving.
      setForm({
        name: destination.name,
        country: destination.country,
        category: destination.category,
        price: destination.price,
        duration: destination.duration,
        departureDate: destination.departureDate,
        imageUrl: destination.imageUrl,
        description: destination.description,
      });
      setErrors({});
      setSaveError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-neutral-200 bg-white">
            <Pencil className="size-4" aria-hidden />
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Travel Package</DialogTitle>
          <DialogDescription>
            Make changes to the travel package details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="font-semibold text-neutral-900">
              Destination Name
            </Label>
            <Input
              id="edit-name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Bali Paradise"
              aria-invalid={errors.name ? true : undefined}
              className={fieldBox}
            />
            {errors.name ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="edit-country"
                className="font-semibold text-neutral-900"
              >
                Country
              </Label>
              <Input
                id="edit-country"
                name="country"
                value={form.country}
                onChange={handleInputChange}
                placeholder="Indonesia"
                aria-invalid={errors.country ? true : undefined}
                className={fieldBox}
              />
              {errors.country ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.country}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label className="font-semibold text-neutral-900">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  updateField("category", value == null ? "" : String(value))
                }
              >
                <SelectTrigger
                  aria-label="Category"
                  className={cn(fieldBox, "w-full data-[size=default]:h-9")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="edit-price"
                className="font-semibold text-neutral-900"
              >
                Price (USD)
              </Label>
              <Input
                id="edit-price"
                name="price"
                inputMode="decimal"
                value={form.price}
                onChange={handleInputChange}
                placeholder="e.g., 1299"
                aria-invalid={errors.price ? true : undefined}
                className={fieldBox}
              />
              {errors.price ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.price}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit-duration"
                className="font-semibold text-neutral-900"
              >
                Duration
              </Label>
              <Input
                id="edit-duration"
                name="duration"
                value={form.duration}
                onChange={handleInputChange}
                placeholder="e.g., 7 Days/6 Nights"
                aria-invalid={errors.duration ? true : undefined}
                className={fieldBox}
              />
              {errors.duration ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.duration}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-departureDate"
              className="font-semibold text-neutral-900"
            >
              Departure Date
            </Label>
            <Input
              id="edit-departureDate"
              name="departureDate"
              type="date"
              value={form.departureDate}
              onChange={handleInputChange}
              aria-invalid={errors.departureDate ? true : undefined}
              className={fieldBox}
            />
            {errors.departureDate ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.departureDate}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-imageUrl"
              className="font-semibold text-neutral-900"
            >
              Image URL
            </Label>
            <Input
              id="edit-imageUrl"
              name="imageUrl"
              type="url"
              inputMode="url"
              value={form.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              aria-invalid={errors.imageUrl ? true : undefined}
              className={fieldBox}
            />
            {errors.imageUrl ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.imageUrl}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-description"
              className="font-semibold text-neutral-900"
            >
              Description
            </Label>
            <Textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Describe the travel experience..."
              aria-invalid={errors.description ? true : undefined}
              className="min-h-24 rounded-md border border-transparent bg-slate-50 px-3 py-2 focus-visible:bg-white"
            />
            {errors.description ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.description}
              </p>
            ) : null}
          </div>

          {saveError ? (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {saveError}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-200 bg-white text-red-500 hover:bg-red-50"
                >
                  <Trash2 aria-hidden />
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-cyan-600 text-white hover:bg-cyan-700"
            >
              <Save aria-hidden />
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
