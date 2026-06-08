// pb_hooks/main.pb.js

// ==========================================
// 1. Endpoint API AI Ollama
// ==========================================
routerAdd("POST", "/api/tanya-ai", (c) => {
    const data = $apis.requestInfo(c).data;
    const prompt = data.prompt;

    if (!prompt) {
        return c.json(400, { "error": "Prompt tidak boleh kosong" });
    }

    try {
        const response = $http.send({
            url: "http://192.168.8.125:11434/api/generate", 
            method: "POST",
            body: JSON.stringify({
                model: "qwen2.5:7b", 
                prompt: "Kamu adalah asisten e-arsip cerdas. Jawab dengan bahasa Indonesia yang profesional namun ramah. Berikut pertanyaan user: " + prompt,
                stream: false
            }),
            headers: { "Content-Type": "application/json" }
        });

        if (response.statusCode !== 200) {
            return c.json(response.statusCode, { "error": "Ollama mengembalikan error status: " + response.statusCode });
        }

        const resBody = JSON.parse(response.raw);
        return c.json(200, {
            "reply": resBody.response
        });

    } catch (e) {
        return c.json(500, { "error": "Gagal terhubung ke Ollama: " + e.message });
    }
}, $apis.requireRecordAuth());


// ==========================================
// 2. Endpoint Khusus Reset Password (Bypass oldPassword)
// ==========================================
routerAdd("POST", "/api/admin/reset-password", (c) => {
    const data = $apis.requestInfo(c).data;
    const targetUserId = data.targetUserId;
    const newPassword = data.newPassword;
    const currentUser = c.get("authRecord");
    const userRole = currentUser ? currentUser.get("role") : "";
    
    if (userRole !== "Petugas Arsip" && userRole !== "Kepala Sekolah") {
        throw new ForbiddenError("Akses ditolak! Hanya Petugas Arsip atau Kepala Sekolah yang dapat mereset password.");
    }

    if (!targetUserId || !newPassword) {
        throw new BadRequestError("ID User dan Password Baru tidak boleh kosong.");
    }

    try {
        const record = $app.dao().findRecordById("users", targetUserId);

        record.setPassword(newPassword);

        $app.dao().saveRecord(record);

        return c.json(200, { "message": "Password berhasil direset" });
    } catch (err) {
        throw new BadRequestError("Gagal mereset password: " + err.message);
    }
}, $apis.requireRecordAuth("users"));


// ==========================================
// 3. Hook Verifikasi reCAPTCHA saat Login
// ==========================================
onRecordAuthWithPasswordRequest((e) => {
    const captchaToken = e.httpContext.request().header.get("X-Captcha-Token");

    if (!captchaToken) {
        throw new BadRequestError("Token Captcha tidak ditemukan. Silakan centang captcha terlebih dahulu.");
    }

    const secretKey = "6LcVspwsAAAAANZEdXbrRN9cOrsPZL_noTlzj3563"; 

    const res = $http.send({
        url: "https://www.google.com/recaptcha/api/siteverify",
        method: "POST",
        body: "secret=" + secretKey + "&response=" + captchaToken,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const data = res.json();

    if (!data.success) {
        throw new BadRequestError("Verifikasi Captcha gagal. Terdeteksi sebagai bot.");
    }

}, "users");