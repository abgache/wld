# WLD V1  
-# The best open-source website tracker/logger for your website.  

## 1- Received data  
Every time someones open your website, it will send you theses datas throught your webhook:  
> **IP :** ``1.1.1.1``  
> **Heure :** XX/XX/XXXX XX:XX:XX  
> **Source :** https://example.com  
> **Pays :** US  
> **Ville :** New York  
> **ASN :** 000000  
> **Organisation :** organization  
> **User-Agent :** Mozilla/X.X (Windows NT X.X; Win64; x64) AppleWebKit/XXX.XX (KHTML, like Gecko) Chrome/XXX.X.X.X Safari/XXX.XX  
> **Platform :** platfrom  
> **OS :** platform  
> **Device :** platform  
> **Browser :** Chrome  
> **Timezone :** Etc/GMT-0  
> **GPU :** ANGLE (NVIDIA, NVIDIA GeForce GTX 970 (0x000013C2) Direct3D11 vs_5_0 ps_5_0, D3D11)  
> **Langue :** en-US  
> **Cores :** 8  
> **RAM (GB) :** 32  
> **Screen :** 1920x1080  
> **Viewport :** 1920x945  
> **Platform Id :** Unknown

### Platform Identifiers
Platfrom identifiers are used to help you know from where the connection is, add ``?src=YOUR_PLATFORM`` at the end of the link.  
Some are premade like:  
> [Tiktok](https://tiktok.com/) : ``tk``  
> [Instagram](https://instagram.com/) : ``ig``  
> [Discord](https://discord.com/) : ``dc``  
> [Youtube](https://youtube.com/) : ``yt``  
> [X](https://x.com/) : ``x``  
> [Facebook](https://facebook.com/) : ``fb``  
> [Reddit](https://reddit.com/) : ``rd``  
> [SnapChat](https://snapchat.com/) : ``sc``  
> [Telegram](https://web.telegram.org/) : ``tg``  
> [WhatsApp](https://web.whatsapp.com/) : ``wa``  
> [Github](https://github.com/) : ``gh``  
> [Pinterest](https://pinterest.com/) : ``pt``  
> [LinkedIn](https://linkedin.com/) : ``ln``  

Example: if you add ``?src=tk`` you will see :  
**Source Link :** [Tiktok](https://tiktok.com/)  
You can add custom ones, it will send directly the id.  
Example: if you add ``?src=CUSTOM`` you will see :  
**Source Link :** ``CUSTOM``  

## 2- Rate limit & Webhook safety  
Every IP has a limit of 1 message per hour, it stops webhook spammers by sending them 429 errors (Rate limit), its only default is that it will not send the data twice if someone reloads the page (_Is it really a default?_).  
Your webhook is only placed in your cloudflare worker's code, which you can put in private.  
## 3- How to use it?  
### 1- Create a cloudflare account/worker
Go to [Cloudflare](https://dash.cloudflare.com/), create an account or connect to your account, create a new Hello World worker call it data.your_username.workers.dev and paste the ``worker.js`` into it and change the discord webhook to yours.  
After that create a new Worker KV, name it logs and create a biding in your data worker to this KV (<!> If you do not call it ``LOGS``, the script will NOT work!).  
And after that click on deploy.  
### 2- Add the tracker to your website
Add this HTML bloc in the ``<head>`` part of your website:  
```html
 <script>
    (async () => {
      try {
          const params = new URLSearchParams(window.location.search);
        const deviceInfo = {platform: navigator.platform,
                            userAgent: navigator.userAgent,
                            language: navigator.language,
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            cores: navigator.hardwareConcurrency || "Unknown",
                            memoryGB: navigator.deviceMemory || "Unknown",
                            screenResolution: `${screen.width}x${screen.height}`,
                            source_deviceInfo: params.get("src") || "Unknown",
                            viewport: `${window.innerWidth}x${window.innerHeight}`,
                            gpu: (() => {
                              try {
                                const canvas = document.createElement("canvas");
                                const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                                if (!gl) return "Unknown";
                                const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                                return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown";
                              } catch { return "Unknown"; }
                            })()
    };

    await fetch("https://data.your_cloudflare_username.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": "SECRET"
      },
      body: JSON.stringify({ source: window.location.hostname, deviceInfo })
    });
  } catch (err) {
    console.error("Erreur en envoyant l'activité :", err);
  }
})();
</script>
```
And do not forget to change the worker's URL to yours!  

# 4- Disclaimer / Legal notice

> [!WARNING]
> Disclaimer
> WLD (Website Logger for Discord) is provided for educational and administrative purposes only.
> his project allows website owners to monitor activity on their own websites by collecting technical information from visitors.

By using this software, you agree that:

You are solely responsible for how you use this project.

You will only deploy it on websites that you own or have permission to monitor.

You will respect all applicable privacy laws and regulations (such as GDPR, CCPA, or local data protection laws).

You will inform visitors that technical information may be collected when accessing your website.

The developer of WLD does not take responsibility for any misuse of this software, including but not limited to:

Unauthorized tracking

Privacy violations

Illegal data collection

Abuse of logged information

All responsibility for the use, storage, and processing of collected data lies with the user deploying the software.

---

## If you have any trouble, problem or complain using WLD, feel free to contact via a github issue or via my [discord](https://discord.com/users/1342450649714917397).  