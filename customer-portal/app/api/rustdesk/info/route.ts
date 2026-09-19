import { NextResponse } from "next/server";

// This route handles /api/rustdesk/info — mirrors /api/rustdesk for compatibility
export async function GET() {
  const serverHost = process.env.RUSTDESK_SERVER_HOST || "";
  const publicKey = process.env.RUSTDESK_PUBLIC_KEY || "";
  const configured = !!(serverHost && publicKey);

  return NextResponse.json({
    serverHost,
    publicKey,
    idPort: 21116,
    relayPort: 21117,
    downloadUrl: "https://github.com/rustdesk/rustdesk/releases/latest",
    configured,
  });
}
