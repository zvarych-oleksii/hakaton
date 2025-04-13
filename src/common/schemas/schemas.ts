import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  lat: z.preprocess(
      (val) => Number(val),
      z.number().min(-90, "Latitude must be at least -90").max(90, "Latitude must be at most 90")
  ),
  lng: z.preprocess(
      (val) => Number(val),
      z.number().min(-180, "Longitude must be at least -180").max(180, "Longitude must be at most 180")
  ),
  type: z.enum(["education", "enjoy", "interesting"], {
    errorMap: () => ({ message: "Please select a valid location type" }),
  }),
  description: z.string().min(5, "Description is too short").optional(),
  factors: z.array(z.object({ value: z.string().min(1, "Factor is required") })).optional()
});

export type LocationData = z.infer<typeof locationSchema>;