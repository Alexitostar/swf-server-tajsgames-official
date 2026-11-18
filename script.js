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

async function checkSecurity() {
    try {
        if (location.protocol === "file:" || location.hostname === "localhost" || location.hostname.startsWith("192.168.")) {
            return;
        }
        if (!navigator.onLine) {
            isBlocked = true;
            window.location.href = "vpnoretcblock.html";
            return;
        }
        const res = await fetch("https://ipapi.co");
        const data = await res.json();
        const isHosting = /mullvad|nord|expressvpn|proton|tor-exit|digitalocean|linode|ovh|hetzner|vultr/i.test(data.org || "");
        if (isHosting) {
            isBlocked = true;
            sessionStorage.setItem("block_reason", "VPN o Proxy detectado");
            sessionStorage.setItem("block_ip", data.ip || "Desconocida");
            sessionStorage.setItem("block_org", data.org || "Desconocido");
            window.location.href = "vpnoretcblock.html";
        }
    } catch (e) {}
}

checkSecurity();
