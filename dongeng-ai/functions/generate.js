export async function onRequestPost(context) {
  try {
    // 1. Menerima data dari frontend (HTML)
    const body = await context.request.json();
    const { nama, usia, tema } = body;

    // 2. Validasi input
    if (!nama || !usia || !tema) {
      return Response.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 3. Membuat prompt yang terstruktur
    const prompt = `
      Anda adalah pendongeng anak profesional.
      Nama Anak: ${nama}
      Usia Anak: ${usia}
      Tema Cerita: ${tema}
      
      Buat dongeng yang menarik, sekitar 300-500 kata. 
      Ketentuan:
      - Nama anak menjadi tokoh utama.
      - Gunakan bahasa Indonesia yang santun, ceria, dan mudah dimengerti anak usia ${usia} tahun.
      - Mengandung pesan moral yang membangun karakter.
      - Cerita harus positif dan tidak menakutkan.
      - Berikan judul yang menarik di baris pertama.
    `;

    // 4. Menghubungi API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${context.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7, 
          }
        })
      }
    );

    const data = await response.json();

    // 5. Mengambil teks dari hasil AI
    const cerita = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal membuat dongeng";

    return Response.json({ cerita });

  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { cerita: "Maaf, imajinasi AI sedang beristirahat. Silakan coba lagi sebentar lagi ya!" },
      { status: 500 }
    );
  }
}
