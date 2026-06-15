```javascript
export async function onRequestPost(context) {

const body =
await context.request.json();

const { nama, usia, tema } = body;

const prompt = `
Anda adalah pendongeng anak profesional.

Nama Anak: ${nama}
Usia Anak: ${usia}
Tema Cerita: ${tema}

Buat dongeng sekitar 500 kata.

Ketentuan:
- Nama anak menjadi tokoh utama.
- Bahasa sederhana.
- Mengandung pesan moral.
- Tidak menakutkan.
- Berikan judul menarik.
`;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${context.env.GEMINI_API_KEY}`,
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({
contents:[
{
parts:[
{
text:prompt
}
]
}
]
})
}
);

const data =
await response.json();

const cerita =
data?.candidates?.[0]?.content?.parts?.[0]?.text ||
"Gagal membuat dongeng";

return Response.json({
cerita
});

}
```
