// index.js (global SDK)
const email = document.getElementById('email');
const password = document.getElementById('password');
const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('signinBtn');
const googleBtn = document.getElementById('googleBtn');
const status = document.getElementById('status');

let selectedRole = null;
document.getElementById('artistRoleBtn').addEventListener('click',()=>{ selectedRole='artist'; status.innerText='Role: Artist'; });
document.getElementById('buyerRoleBtn').addEventListener('click',()=>{ selectedRole='buyer'; status.innerText='Role: Buyer'; });

signupBtn.addEventListener('click', async ()=>{
  if(!selectedRole) return alert('Choose role first');
  const e=email.value.trim(), p=password.value;
  if(!e||!p) return alert('Enter email & password');
  try{
    const cred = await window._auth.createUserWithEmailAndPassword(e,p);
    // store role in Firestore users collection
    await window._db.collection('users').doc(cred.user.uid).set({email:e,role:selectedRole,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    // redirect to dashboard
    if(selectedRole==='artist') location.href='artist-dashboard.html';
    else location.href='buyer-dashboard.html';
  }catch(err){ alert(err.message); }
});

signinBtn.addEventListener('click', async ()=>{
  if(!selectedRole) return alert('Choose role first');
  const e=email.value.trim(), p=password.value;
  try{
    const cred = await window._auth.signInWithEmailAndPassword(e,p);
    // Optionally check role in Firestore; skip and redirect based on selectedRole
    if(selectedRole==='artist') location.href='artist-dashboard.html';
    else location.href='buyer-dashboard.html';
  }catch(err){ alert(err.message); }
});

googleBtn.addEventListener('click', async ()=>{
  if(!selectedRole) return alert('Choose role first');
  const provider = new firebase.auth.GoogleAuthProvider();
  try{
    const res = await window._auth.signInWithPopup(provider);
    const uid = res.user.uid;
    // write role if new
    const userDoc = await window._db.collection('users').doc(uid).get();
    if(!userDoc.exists){
      await window._db.collection('users').doc(uid).set({email:res.user.email, role:selectedRole, createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    }
    if(selectedRole==='artist') location.href='artist-dashboard.html'; else location.href='buyer-dashboard.html';
  }catch(err){ alert(err.message); }
});