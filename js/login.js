/* ==========================================================================
   LOGIN.JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const tabs = document.querySelectorAll('.login-tabs button');
  const loginPane = document.getElementById('loginPane');
  const signupPane = document.getElementById('signupPane');
  const switchCta = document.getElementById('switchCta');

  function setTab(name){
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    loginPane.style.display = name === 'login' ? 'block' : 'none';
    signupPane.style.display = name === 'signup' ? 'block' : 'none';
    switchCta.innerHTML = name === 'login'
      ? 'New here? <a href="#" id="switchToSignup">Create an account</a>'
      : 'Already have an account? <a href="#" id="switchToLogin">Log in</a>';
    bindSwitchLink();
  }
  function bindSwitchLink(){
    const s2 = document.getElementById('switchToSignup');
    const s1 = document.getElementById('switchToLogin');
    s2 && s2.addEventListener('click', (e) => { e.preventDefault(); setTab('signup'); });
    s1 && s1.addEventListener('click', (e) => { e.preventDefault(); setTab('login'); });
  }
  tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.tab)));
  bindSwitchLink();

  /* ---------------- Show / hide password ---------------- */
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
  });

  /* ---------------- Validation helpers ---------------- */
  function isValidIdentifier(v){
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobile = /^\d{10}$/;
    return email.test(v.trim()) || mobile.test(v.trim().replace(/\s/g,''));
  }
  function setError(group, hasError){
    group.classList.toggle('error', hasError);
  }

  /* ---------------- Login form ---------------- */
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('loginId').value;
    const passVal = document.getElementById('loginPass').value;
    const idGroup = document.getElementById('loginIdGroup');
    const passGroup = document.getElementById('loginPassGroup');
    let valid = true;
    if (!isValidIdentifier(idVal)){ setError(idGroup, true); valid = false; } else setError(idGroup, false);
    if (passVal.length < 6){ setError(passGroup, true); valid = false; } else setError(passGroup, false);
    if (!valid) return;
    showToast('Login successful! Redirecting…');
    setTimeout(() => window.location.href = 'index.html', 1200);
  });

  /* ---------------- Signup form ---------------- */
  const signupForm = document.getElementById('signupForm');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameGroup = document.getElementById('suName').closest('.field-group');
    const emailGroup = document.getElementById('suEmail').closest('.field-group');
    const passGroup = document.getElementById('suPass').closest('.field-group');
    let valid = true;
    if (!document.getElementById('suName').value.trim()){ setError(nameGroup, true); valid = false; } else setError(nameGroup, false);
    if (!isValidIdentifier(document.getElementById('suEmail').value)){ setError(emailGroup, true); valid = false; } else setError(emailGroup, false);
    if (document.getElementById('suPass').value.length < 6){ setError(passGroup, true); valid = false; } else setError(passGroup, false);
    if (!valid) return;
    showToast('Account created! Redirecting…');
    setTimeout(() => window.location.href = 'index.html', 1200);
  });

  /* ---------------- Social buttons (demo) ---------------- */
  document.getElementById('googleBtn').addEventListener('click', () => showToast('Google sign-in is not connected in this demo.', 'warn'));
  document.getElementById('facebookBtn').addEventListener('click', () => showToast('Facebook sign-in is not connected in this demo.', 'warn'));
  document.getElementById('forgotLink').addEventListener('click', (e) => { e.preventDefault(); showToast('Password reset link sent (demo).'); });

});
