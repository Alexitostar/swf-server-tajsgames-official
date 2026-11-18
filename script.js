const input = document.getElementById("pass");
const goDownload = document.getElementById("go-download");
let isBlocked = false;

if (input && goDownload) {
    input.addEventListener("input", function() {
        if (isBlocked) return;
        if (input.value.trim() === "securitywcps0390tg.com") {
            goDownload.click();
        }
    });
}

function triggerBlock(reason, ip, org) {
    isBlocked = true;
    sessionStorage.setItem("block_reason", reason);
    sessionStorage.setItem("block_ip", ip || "Oculta");
    sessionStorage.setItem("block_org", org || "Desconocido");
    window.location.href = "vpnoretcblock.html";
}

async function checkSecurity() {
    // Evitar bloqueo si lo abres localmente en tu PC
    if (location.protocol === "file:" || location.hostname === "localhost" || location.hostname.startsWith("192.168.")) {
        return;
    }

    if (!navigator.onLine) {
        triggerBlock("Sin conexión o Intranet", "Local", "Offline");
        return;
    }

    try {
        // API principal gratuita y sin límite estricto (ipwho.is)
        const res = await fetch("https://ipwho.is");
        const data = await res.json();

        if (!data.success) {
            triggerBlock("Consulta de IP bloqueada por VPN", "Desconocida", "Bloqueado");
            return;
        }

        const browserTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const ipTZ = data.timezone ? data.timezone.id : "";
        const orgText = ((data.connection ? data.connection.org : "") + " " + (data.connection ? data.connection.isp : "")).toLowerCase();

        // Palabras clave de VPNs, Proxies y Centros de Datos
        const vpnKeywords = /vpn|proxy|tor|mullvad|nord|express|proton|surfshark|windscribe|cyberghost|private|pia|warp|cloudflare|digitalocean|linode|ovh|hetzner|vultr|amazon|aws|google|microsoft|azure|oracle|choopa|datacamp|m247|leaseweb|hostinger|contabo/;

        // 1. Si el proveedor es un servidor o VPN conocida
        if (vpnKeywords.test(orgText)) {
            triggerBlock("VPN o Servidor detectado", data.ip, orgText);
            return;
        }

        // 2. Si la zona horaria de la IP no coincide con la zona horaria del dispositivo
        if (browserTZ && ipTZ && browserTZ !== ipTZ) {
            triggerBlock("Diferencia de zona horaria (VPN activa)", data.ip, orgText);
            return;
        }

    } catch (e) {
        // Si la VPN o extensión bloquea la API de seguridad, activar alarma
        triggerBlock("Red protegida o bloqueo de API detectado", "Oculta", "Firewall/VPN");
    }
}

checkSecurity();
