/**
 * ==========================================================================
 * LONTARA TECH — AUTHENTICATION ENGINE (WITH SWEETALERT)
 * Lokasi: js/auth.js
 * ==========================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBTCodMO2Nya0KucIGooCotQD-Aa3UzE0c",
  authDomain: "lontara-e562e.firebaseapp.com",
  projectId: "lontara-e562e",
  storageBucket: "lontara-e562e.firebasestorage.app",
  messagingSenderId: "955288117210",
  appId: "1:955288117210:web:0b96dac548d5185bf32ae3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const LontaraAuth = {
  init() {
    console.log("Lontara Auth Engine: Active");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL };
        if (window.LontaraState) window.LontaraState.setUser(userData);
        this.updateUI(userData);
      } else {
        if (window.LontaraState) window.LontaraState.logout();
        this.updateUI(null);
      }
    });

    this.attachGlobalListeners();
  },

  async loginWithGoogle() {
    try {
      const authBtn = document.getElementById("auth-btn");
      if (authBtn) authBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
      
      await signInWithPopup(auth, provider);
      
      if (window.location.hash === "#keranjang" && typeof renderCartPage === "function") {
          renderCartPage(); 
      }
    } catch (error) {
      console.error("Gagal Login:", error.message);
      Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Autentikasi digagalkan atau diblokir.' });
      this.updateUI(null);
    }
  },

  async logout() {
    try {
      await signOut(auth);
      window.location.hash = "beranda";
      // Notifikasi Logout
      Swal.fire({
        icon: 'info',
        title: 'Berhasil Keluar',
        text: 'Sampai jumpa kembali di Lontara!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Gagal Logout:", error.message);
    }
  },

  updateUI(user) {
    const authBtn = document.getElementById("auth-btn");
    if (!authBtn) return;

    if (user) {
      const nameOrEmail = user.displayName || user.email;
      const defaultPhoto = `https://ui-avatars.com/api/?name=${nameOrEmail}&background=00b8a9&color=fff&rounded=true`;
      const photo = user.photoURL || defaultPhoto;

      authBtn.innerHTML = `<img src="${photo}" alt="Profile" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent);">`;
      authBtn.title = `Profil: ${nameOrEmail}`;
      authBtn.onclick = (e) => { e.preventDefault(); window.location.hash = "profil"; };
    } else {
      authBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
      authBtn.title = "Login / Daftar Akun";
      authBtn.onclick = (e) => { e.preventDefault(); window.location.hash = "login"; };
    }
  },

  attachGlobalListeners() {
    document.body.addEventListener("click", (e) => {
      if (e.target.closest(".btn-login-google")) { e.preventDefault(); this.loginWithGoogle(); }
      if (e.target.closest(".btn-logout")) { e.preventDefault(); this.logout(); }
    });

    document.body.addEventListener("submit", async (e) => {
      
      // === LOGIKA REGISTER ===
      if (e.target.id === "register-form") {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const btnRegister = e.target.querySelector('button[type="submit"]');
        
        if (password !== confirmPassword) {
          Swal.fire({ icon: 'warning', title: 'Oops!', text: 'Konfirmasi password tidak cocok.' });
          return;
        }

        if (btnRegister) { btnRegister.innerText = "Mendaftarkan..."; btnRegister.disabled = true; }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await sendEmailVerification(userCredential.user);

          // Notifikasi Sukses Register
          Swal.fire({
            icon: 'success',
            title: 'Pendaftaran Berhasil!',
            text: 'Silakan cek email Anda untuk verifikasi akun.',
            confirmButtonColor: '#1d4ed8' // Warna tombol menyesuaikan tema
          }).then(() => {
            window.location.hash = "login";
          });

        } catch (error) {
          console.error(error);
          Swal.fire({ icon: 'error', title: 'Gagal Mendaftar', text: error.message });
          if (btnRegister) { btnRegister.innerText = "Daftar Akun"; btnRegister.disabled = false; }
        }
      }

      // === LOGIKA LOGIN ===
      if (e.target.id === "login-form") {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const btnLogin = e.target.querySelector('button[type="submit"]');

        if (btnLogin) { btnLogin.innerText = "Memproses..."; btnLogin.disabled = true; }

        try {
          await signInWithEmailAndPassword(auth, email, password);
          
          // Notifikasi Sukses Login
          Swal.fire({
            icon: 'success',
            title: 'Login Berhasil!',
            text: 'Selamat datang di Lontara.',
            timer: 2000,
            showConfirmButton: false
          });
          
          window.location.hash = "beranda"; 
        } catch (error) {
          console.error(error);
          Swal.fire({ icon: 'error', title: 'Login Gagal', text: 'Email atau password Anda salah.' });
          if (btnLogin) { btnLogin.innerText = "Masuk ke Sistem"; btnLogin.disabled = false; }
        }
      }
      
    });
  }
};

window.LontaraAuth = LontaraAuth;
LontaraAuth.init();