const input = document.getElementById("pass");
let isBlocked = false;

if (input) {
    input.addEventListener("input", function() {
        if (isBlocked) return;
        if (input.value.trim() === "securitywcps0390tg.com") {
            const link = document.createElement("a");
            link.href = "juego.swf";
            link.setAttribute("download", "juego.swf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            input.value = "";
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
            window.location.href = "vpnoretcblock.html";
        }
    } catch (e) {}
}

checkSecurity();
