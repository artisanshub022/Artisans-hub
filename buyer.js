// buyers.js (global SDK)
const artList = document.getElementById('artList');
window._auth.onAuthStateChanged(user=>{
  // optionally allow anonymous browsing without login; don't redirect
  loadAllArtworks();
});

async function loadAllArtworks(){
  artList.innerHTML = '';
  const q = await window._db.collection('artworks').orderBy('createdAt','desc').get();
  q.forEach(doc=>{
    const d = doc.data();
    const card = document.createElement('div'); card.className='art-card';
    card.innerHTML = `<img src="${d.imageUrl}" alt=""><h4>${escapeHtml(d.name)}</h4><p>₹${d.price}</p><p>${escapeHtml(d.desc)}</p><button class="btn buy">Buy</button>`;
    const buyBtn = card.querySelector('.buy');
    buyBtn.addEventListener('click', ()=>{ alert('Demo buy clicked — integrate payment gateway later.'); });
    artList.appendChild(card);
  });
}
function escapeHtml(s){return s? s.replaceAll('<','&lt;').replaceAll('>','&gt;') : '';}