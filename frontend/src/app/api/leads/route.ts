import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
  interest: z.string().default("Complete Platform"),
  message: z.string().optional(),
  source: z.string().optional().default("Landing Page"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // In a production setup, this would save to a database table or forward to CRM/webhook.
    // For now, we log the qualified lead and return a structured success response.
    console.log("[Appnix Inbound Lead Received]", {
      ...validatedData,
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json({
      success: true,
      message: "Your demo request has been received! Our solutions team will contact you shortly.",
      data: {
        id: `lead_${Date.now()}`,
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("[Lead Submission Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit demo request. Please try again or email support@appnix.com",
      },
      { status: 500 }
    );
  }
}
