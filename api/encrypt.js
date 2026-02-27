export default function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { code, type, style } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: "No code provided" });
    }

    try {
        let hasil = `/* Securely Encrypted by GalangHost Backend */\n`;

        if (type === 'html') {
            if (style === 'hex') {
                // Logika Hexadecimal di Server
                let hex = Buffer.from(code).toString('hex').replace(/(..)/g, '%$1');
                hasil += `<script>document.write(unescape('${hex}'))</script>`;
            } else {
                // Logika Unicode/Base64 di Server
                let b64 = Buffer.from(code).toString('base64');
                hasil += `<script>document.write(decodeURIComponent(escape(atob('${b64}'))))</script>`;
            }
        } 
        else if (type === 'js') {
            // JS Enc: Base64 Obfuscation
            let b64js = Buffer.from(code).toString('base64');
            hasil += `eval(atob("${b64js}"));`;
        }
        else if (type === 'css') {
            // CSS Obfuscation via JS Injector
            let b64css = Buffer.from(code).toString('base64');
            hasil += `(function(){var s=document.createElement('style');s.innerHTML=atob('${b64css}');document.head.appendChild(s);})();`;
        }

        // Kirim hasil balik ke frontend
        res.status(200).json({ success: true, result: hasil });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
}
