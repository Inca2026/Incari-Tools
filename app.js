// Real-time Configuration Mapping Array Object
function updateThemeJSON() {
    const configData = {
        incari_client_version: "26.3",
        meta: {
            profile_title: document.getElementById("text-title").value,
            last_compiled_timestamp: Date.now()
        },
        styles: {
            background_hex: document.getElementById("color-bg").value,
            surface_hex: document.getElementById("color-surface").value,
            accent_primary: document.getElementById("color-accent").value,
            accent_secondary: document.getElementById("color-purple").value,
            text_default: document.getElementById("color-text").value
        }
    };

    // Output live structural data string directly into client field box
    document.getElementById("json-output").value = JSON.stringify(configData, null, 4);
}

function copyConfigToClipboard() {
    const copyText = document.getElementById("json-output");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // Mobile compliance constraint safety target

    navigator.clipboard.writeText(copyText.value).then(() => {
        const toast = document.getElementById("toast");
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    });
}

// Initial engine activation frame sequence
document.addEventListener("DOMContentLoaded", updateThemeJSON);
