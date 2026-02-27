export default function handler(req, res) {
    // Pastikan hanya menerima POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Gunakan metode POST' });
    }

    const { code, type, style } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: "Kode kosong!" });
    }

    try {
        let hasil = `/* Encrypted by GalangHost Backend */\n`;

        if (type === 'html') {
            if (style === 'hex') {
                let hex = Buffer.from(code).toString('hex').replace(/(..)/g, '%$1');
                hasil += `<script>document.write(unescape('${hex}'))</script>`;
            } else {
                let b64 = Buffer.from(code).toString('base64');
                hasil += `<script>document.write(decodeURIComponent(escape(atob('${b64}'))))</script>`;
            }
        } 
        else if (type === 'js') {
            let b64js = Buffer.from(code).toString('base64');
            hasil += `eval(atob("${b64js}"));`;
        }
        else if (type === 'css') {
            let b64css = Buffer.from(code).toString('base64');
            hasil += `(function(){var s=document.createElement('style');s.innerHTML=atob('${b64css}');document.head.appendChild(s);})();`;
        }

        // INI KUNCINYA: Respon harus JSON dengan status 200
        res.status(200).json({ 
            success: true, 
            result: hasil 
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
}
