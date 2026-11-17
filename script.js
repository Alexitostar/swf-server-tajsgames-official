const input = document.getElementById("pass");

if (input) {
    input.addEventListener("input", function () {
        if (input.value === "securitywcps0390tg.com") {
            sessionStorage.setItem("tajs_auth_ok", "true");
            input.value = "";
            window.location.href = "downloadswf.html";
        }
    });
}

async function checkSecurity() {
    if (window.location.protocol === "file:") {
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) return;
        const data = await res.json();

        const org = (data.org || "").toLowerCase();
        const vpnKeywords = [
            "nordvpn", "expressvpn", "mullvad", "protonvpn", "surfshark",
            "cyberghost", "private internet access", "tor exit", "digitalocean",
            "vultr", "linode", "hetzner", "ovh"
        ];

        const isVpn = vpnKeywords.some(keyword => org.includes(keyword));

        if (isVpn) {
            sessionStorage.setItem("tajs_block_reason", "VPN / Proxy / Hosting comercial detectado");
            sessionStorage.setItem("tajs_ip_data", JSON.stringify(data));
            window.location.href = "vpnoretcblock.html";
        }
    } catch (e) {
        // Ignorar errores de red o límites de consultas
    }
}

checkSecurity();
