import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(req: Request) {
  try {
    const { appName } = await req.json();
    if (!appName || typeof appName !== "string") {
      return NextResponse.json({ error: "App name is required" }, { status: 400 });
    }

    const lower = appName.toLowerCase().trim();

    // 1. Web App Mapping
    const webApps: Record<string, string> = {
      youtube: "https://www.youtube.com",
      google: "https://www.google.com",
      github: "https://www.github.com",
      gmail: "https://mail.google.com",
      whatsapp: "https://web.whatsapp.com",
      spotify: "https://open.spotify.com",
      chatgpt: "https://chat.openai.com",
      gemini: "https://gemini.google.com",
      maps: "https://maps.google.com",
      twitter: "https://x.com",
      x: "https://x.com",
      reddit: "https://www.reddit.com",
      netflix: "https://www.netflix.com",
    };

    for (const [key, url] of Object.entries(webApps)) {
      if (lower.includes(key)) {
        return NextResponse.json({ success: true, type: "web", target: appName, url });
      }
    }

    // 2. Windows Local Desktop App Launchers
    let desktopCommand = "";
    if (lower.includes("calc")) desktopCommand = "calc";
    else if (lower.includes("notepad")) desktopCommand = "notepad";
    else if (lower.includes("paint")) desktopCommand = "mspaint";
    else if (lower.includes("explorer") || lower.includes("file")) desktopCommand = "explorer";
    else if (lower.includes("cmd") || lower.includes("terminal") || lower.includes("command")) desktopCommand = "start cmd";
    else if (lower.includes("chrome")) desktopCommand = "start chrome";
    else if (lower.includes("edge")) desktopCommand = "start msedge";
    else if (lower.includes("code") || lower.includes("vs code")) desktopCommand = "code";

    if (desktopCommand) {
      exec(desktopCommand, (error) => {
        if (error) console.error("Desktop app launch warning:", error);
      });
      return NextResponse.json({
        success: true,
        type: "desktop",
        target: appName,
        commandExecuted: desktopCommand,
      });
    }

    // 3. Fallback: Search / Open Google search for unknown apps
    const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(appName)}`;
    return NextResponse.json({ success: true, type: "search", target: appName, url: fallbackUrl });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to launch application", details: err.message }, { status: 500 });
  }
}
