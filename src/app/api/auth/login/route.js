// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import {
  sendLoginNotification,
  getClientDetails,
} from "../../../../lib/email";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const clientDetails = getClientDetails(request);

    // Check credentials
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "8570088978";
    const validPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "GlTsSd@EagleEyes8570@";

    if (username !== validUsername || password !== validPassword) {
      // Send failed login notification
      sendLoginNotification({
        success: false,
        ...clientDetails,
      });

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

    const user = {
      id: 1,
      username,
      role: "admin",
      loginTime: new Date().toISOString(),
    };

    // Send success notification (don't await to avoid delays)
    sendLoginNotification({
      success: true,
      ...clientDetails,
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
