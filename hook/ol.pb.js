//Ollama Hook
routerAdd("POST", "/api/tanya-ai", (c) => {
    const data = $apis.requestInfo(c).data;
    const prompt = data.prompt;

    if (!prompt) {
        return c.json(400, { "error": "Prompt tidak boleh kosong" });
    }

    try {
        const response = $http.send({
            url: "",
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
