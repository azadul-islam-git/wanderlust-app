"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Playfair_Display } from "next/font/google";
import { Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const playfair = Playfair_Display({ subsets: ["latin"] });

const categories = [
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
];

const initialForm = {
  name: "",
  country: "",
  category: "beach",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

type FormState = typeof initialForm;
type FieldName = keyof FormState;
type Errors = Partial<Record<FieldName, string>>;

/** Filled input style shared by Input, Textarea, and SelectTrigger. */
const fieldBox =
  "h-9 rounded-md border border-transparent bg-slate-50 px-3 focus-visible:bg-white";

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

function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="font-semibold text-neutral-900">
        {label}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function AddDestinationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: FieldName, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSuccess(null);
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
    setIsSubmitting(true);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:8000/add-destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add destination");
      }

      console.log(data);
      setForm(initialForm);
      setSuccess("Travel package added successfully!");
    } catch (error) {
      console.error("Error adding destination:", error);
      setSuccess("Failed to add travel package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    setForm(initialForm);
    setErrors({});
    setSuccess(null);
  }

  return (
    <main className="min-h-screen bg-white px-4 pt-8 pb-16">
      <h1 className={`${playfair.className} text-4xl text-neutral-900`}>
        Add New Travel Package
      </h1>

      <Card className="mx-auto mt-10 w-full max-w-lg py-6 shadow-sm">
        <CardContent className="px-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField
              label="Destination Name"
              htmlFor="name"
              error={errors.name}
            >
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Bali Paradise"
                aria-invalid={errors.name ? true : undefined}
                className={fieldBox}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Country"
                htmlFor="country"
                error={errors.country}
              >
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleInputChange}
                  placeholder="Indonesia"
                  aria-invalid={errors.country ? true : undefined}
                  className={fieldBox}
                />
              </FormField>

              <FormField label="Category" htmlFor="category">
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    updateField("category", value == null ? "" : String(value))
                  }
                >
                  <SelectTrigger
                    id="category"
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
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Price (USD)"
                htmlFor="price"
                error={errors.price}
              >
                <Input
                  id="price"
                  name="price"
                  inputMode="decimal"
                  value={form.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 1299"
                  aria-invalid={errors.price ? true : undefined}
                  className={fieldBox}
                />
              </FormField>

              <FormField
                label="Duration"
                htmlFor="duration"
                error={errors.duration}
              >
                <Input
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 7 Days/6 Nights"
                  aria-invalid={errors.duration ? true : undefined}
                  className={fieldBox}
                />
              </FormField>
            </div>

            <FormField
              label="Departure Date"
              htmlFor="departureDate"
              error={errors.departureDate}
            >
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                value={form.departureDate}
                onChange={handleInputChange}
                aria-invalid={errors.departureDate ? true : undefined}
                className={cn(
                  fieldBox,
                  !form.departureDate &&
                    "[&::-webkit-datetime-edit]:text-neutral-400",
                )}
              />
            </FormField>

            <FormField
              label="Image URL"
              htmlFor="imageUrl"
              error={errors.imageUrl}
            >
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                inputMode="url"
                value={form.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                aria-invalid={errors.imageUrl ? true : undefined}
                className={fieldBox}
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description}
            >
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe the travel experience..."
                aria-invalid={errors.description ? true : undefined}
                className="min-h-24 rounded-md border border-transparent bg-slate-50 px-3 py-2 focus-visible:bg-white"
              />
            </FormField>

            {success ? (
              <p
                role="status"
                className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              >
                {success}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-red-200 bg-white text-red-500 hover:bg-red-50"
              >
                <Trash2 aria-hidden />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                <Save aria-hidden />
                {isSubmitting ? "Adding…" : "Add Travel Package"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
