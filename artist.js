// artist.js (global SDK)
const uploadBtn = document.getElementById('uploadBtn');
const artName = document.getElementById('artName');
const artDesc = document.getElementById('artDesc');
const artPrice = document.getElementById('artPrice');
const artCustom = document.getElementById('artCustom');
const artImage = document.getElementById('artImage');
const uploadStatus = document.getElementById('uploadStatus');
const artistList = document.getElementById('artistList');

let currentUser = null;
window._auth.onAuthStateChanged(user=>{
  if(user){
    currentUser = user;
    loadMyArtworks();
  } else {
    // redirect to home
    location.href='index.html';
  }
});

uploadBtn.addEventListener('click', async ()=>{
  if(!currentUser) return alert('Login first');
  const name = artName.value.trim();
  const desc = artDesc.value.trim();
  const price = parseFloat(artPrice.value) || 0;
  const custom = artCustom.value.trim();
  const file = artImage.files[0];
  if(!name || !file) return alert('Name and image required');
  try{
    uploadStatus.innerText = 'Uploading image...';
    const filePath = `artworks_images/${currentUser.uid}_${Date.now()}_${file.name}`;
    const snap = await window._storage.ref(filePath).put(file);
    const url = await snap.ref.getDownloadURL();
    uploadStatus.innerText = 'Saving metadata...';
    await window._db.collection('artworks').add({
      name, desc, price, custom, imageUrl: url, ownerUid: currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    uploadStatus.innerText = 'Uploaded!';
    artName.value=''; artDesc.value=''; artPrice.value=''; artCustom.value=''; artImage.value='';
    loadMyArtworks();
  }catch(err){
    uploadStatus.innerText = 'Error: '+err.message;
  }
});

async function loadMyArtworks(){
  artistList.innerHTML = '';
  const q = await window._db.collection('artworks').where('ownerUid','==',currentUser.uid).orderBy('createdAt','desc').get();
  q.forEach(doc=>{
    const d = doc.data();
    const el = document.createElement('div'); el.className='art-card';
    el.innerHTML = `<img src="${d.imageUrl}" alt=""><h4>${escapeHtml(d.name)}</h4><p>₹${d.price}</p><p>${escapeHtml(d.desc)}</p>`;
    artistList.appendChild(el);
  });
}

function escapeHtml(s){return s? s.replaceAll('<','&lt;').replaceAll('>','&gt;') : '';}