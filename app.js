// ══════════════════════════════════════════════════════════════════════
// FREEGROUNDS // TACTICAL MAYHEM — REBEL CYBER WEB ENGINE
// ══════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
    // ──────────────────────────────────────────────────────────────────
    // 1. Interactive Ballistics & Armor Damage Calculator
    // ──────────────────────────────────────────────────────────────────
    const weaponSelect = document.getElementById("weaponSelect");
    const hitboxSelect = document.getElementById("hitboxSelect");
    const armorSelect = document.getElementById("armorSelect");

    const hpDamageVal = document.getElementById("hpDamageVal");
    const hpRemainingVal = document.getElementById("hpRemainingVal");
    const armorDamageVal = document.getElementById("armorDamageVal");
    const armorRemainingVal = document.getElementById("armorRemainingVal");
    const lethalVerdictVal = document.getElementById("lethalVerdictVal");
    const lethalNoteVal = document.getElementById("lethalNoteVal");

    const weaponData = {
        ak: { name: "AK-74M", baseDmg: 34 },
        m4: { name: "M4A1", baseDmg: 30 },
        sniper: { name: "Sniper", baseDmg: 110 },
        shotgun: { name: "Shotgun", baseDmg: 120 },
        smg: { name: "Vector 9mm", baseDmg: 22 }
    };

    function calculateDamage() {
        if (!weaponSelect || !hitboxSelect || !armorSelect) return;

        const wKey = weaponSelect.value;
        const hitbox = hitboxSelect.value;
        const hasArmor = armorSelect.value === "vest";

        const base = weaponData[wKey] ? weaponData[wKey].baseDmg : 30;
        let totalDmg = base;

        if (hitbox === "head") {
            totalDmg = base * 2.5; // Headshot multiplier
        } else if (hitbox === "legs") {
            totalDmg = base * 0.85; // Leg shot slight dampening
        }

        let hpDmg = totalDmg;
        let armorDmg = 0;
        let maxArmor = 100;
        let maxHp = 100;

        if (hasArmor && hitbox === "chest") {
            // Tactical Armor absorbs 75% of body damage
            armorDmg = totalDmg * 0.75;
            hpDmg = totalDmg * 0.25;
        } else if (hasArmor && hitbox === "head") {
            // Helmets take partial, but high lethal damage
            armorDmg = totalDmg * 0.35;
            hpDmg = totalDmg * 0.65;
        }

        hpDmg = Math.round(hpDmg * 10) / 10;
        armorDmg = Math.round(armorDmg * 10) / 10;

        const remainingHp = Math.max(0, Math.round((maxHp - hpDmg) * 10) / 10);
        const remainingArmor = hasArmor ? Math.max(0, Math.round((maxArmor - armorDmg) * 10) / 10) : 0;

        if (hpDamageVal) hpDamageVal.innerText = `${hpDmg} HP`;
        if (hpRemainingVal) hpRemainingVal.innerText = `Rest-HP: ${remainingHp} / 100`;

        if (armorDamageVal) armorDamageVal.innerText = `${armorDmg} AP`;
        if (armorRemainingVal) {
            armorRemainingVal.innerText = hasArmor ? `Rest-Weste: ${remainingArmor} / 100` : `Keine Weste getragen`;
        }

        if (lethalVerdictVal && lethalNoteVal) {
            if (remainingHp <= 0) {
                lethalVerdictVal.innerText = "FATALER K.O. (1-Hit Kill)";
                lethalVerdictVal.className = "res-val";
                lethalVerdictVal.style.color = "#ef4444";
                lethalNoteVal.innerText = "Kritischer Kopftreffer oder massiver Nahkampfschaden. Ziel neutralisiert.";
            } else {
                const shotsToKill = Math.ceil(maxHp / hpDmg);
                lethalVerdictVal.innerText = `ÜBERLEBT (${shotsToKill} Treffer nötig)`;
                lethalVerdictVal.className = "res-val bright-green";
                lethalVerdictVal.style.color = "#00ff66";
                lethalNoteVal.innerText = hasArmor && hitbox === "chest"
                    ? "Schutzweste absorbiert 75% des Rumpfschadens. Ziel übersteht den Treffer."
                    : "Ziel übersteht den Einzeltreffer.";
            }
        }

    }

    if (weaponSelect) weaponSelect.addEventListener("change", calculateDamage);
    if (hitboxSelect) hitboxSelect.addEventListener("change", calculateDamage);
    if (armorSelect) armorSelect.addEventListener("change", calculateDamage);
    calculateDamage();

    // ──────────────────────────────────────────────────────────────────
    // 2. Interactive Dev & Community CLI Terminal
    // ──────────────────────────────────────────────────────────────────
    const terminalLog = document.getElementById("terminalLog");
    const terminalInput = document.getElementById("terminalInput");
    const btnSendTerminal = document.getElementById("btnSendTerminal");

    const terminalCommands = {
        help: "📜 Befehle: <code>about</code>, <code>specs</code>, <code>modes</code>, <code>server</code>, <code>roadmap</code>, <code>community</code>, <code>download</code>, <code>clear</code>",
        about: "⚡ TACTICAL MAYHEM: Unabhängiger Standalone 5v5 Hardcore Taktik-Shooter mit Ingame-Cyber-OS & Physik. DRM-frei & 100% kostenlos.",
        specs: "💻 HARDWARE: Min: Win 10/11 (64-Bit), 8 GB RAM, GTX 960 / RX 470 • Rec: 16 GB RAM, GTX 1060 / RX 580.",
        modes: "🎮 EINSATZSZENARIEN: [1] 5v5 Taktischer Bomben-Einsatz • [2] Prop Hunt & Täuschung • [3] Physics Sandbox & Konstruktion.",
        server: "🌐 MULTIPLAYER: Integrierter Server Browser, LAN & Direct-IP Host. Vollständig dezentral.",
        roadmap: "🗺️ ROADMAP: Neue CQB-Karten, erweiterte Waffen-Anbauten, optimierter Net-Code und Community-Workshop-Support.",
        community: "🤝 COMMUNITY: Schließe dich unserer Indie-Community auf Discord an für Playtests, Feedback und Lobbysuche.",
        download: "⬇️ Download gestartet: 'FreeGrounds_v1.0.4.zip' wird geladen."
    };

    function appendTerminalMsg(sender, text, color = "green") {
        if (!terminalLog) return;
        const msg = document.createElement("div");
        msg.className = "chat-msg";
        const time = new Date().toLocaleTimeString();
        msg.innerHTML = `
            <span class="chat-time">[${time}]</span>
            <span class="chat-user ${color}">${sender}:</span>
            <span class="chat-text">${text}</span>
        `;
        terminalLog.appendChild(msg);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    function handleTerminalExec() {
        if (!terminalInput) return;
        const raw = terminalInput.value.trim();
        if (!raw) return;

        appendTerminalMsg("dev@mayhem", raw, "olive");
        terminalInput.value = "";

        const cmd = raw.toLowerCase();

        if (cmd === "clear") {
            terminalLog.innerHTML = `
                <div class="chat-msg">
                    <span class="chat-time">[${new Date().toLocaleTimeString()}]</span>
                    <span class="chat-user green">SYSTEM:</span>
                    <span class="chat-text">Terminal geleert. Bereit für Eingaben. (Tippe <code>help</code>)</span>
                </div>
            `;
            return;
        }

        setTimeout(() => {
            if (terminalCommands[cmd]) {
                appendTerminalMsg("BUNKER_KERNEL", terminalCommands[cmd], "gold");
                if (cmd === "download") {
                    const dlBtn = document.getElementById("btnHeroDownload");
                    if (dlBtn) dlBtn.click();
                }
            } else {
                appendTerminalMsg("BUNKER_KERNEL", `Befehl unbekannt: '${raw}'. Tippe <code>help</code> für Befehlsübersicht.`, "green");
            }
        }, 150);
    }




    if (btnSendTerminal) btnSendTerminal.addEventListener("click", handleTerminalExec);
    if (terminalInput) {
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleTerminalExec();
        });
    }

    // ──────────────────────────────────────────────────────────────────
    // 3. FAQ Accordion Handler
    // ──────────────────────────────────────────────────────────────────
    document.querySelectorAll(".faq-question").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("active"));
            if (!isOpen) {
                item.classList.add("active");
            }
        });
    });

    // ──────────────────────────────────────────────────────────────────
    // 4. Smooth Anchor Scrolling
    // ──────────────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId !== "#") {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    targetElem.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });
});

