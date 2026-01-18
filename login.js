import { supabase, utils, MESSAGES } from "./config.js";

let currentTab = "email";

// email e telefone
window.switchTab = function (tab) {
  currentTab = tab;
  const emailTab = document.getElementById("emailTab");
  const phoneTab = document.getElementById("phoneTab");
  const emailLogin = document.getElementById("emailLogin");
  const phoneLogin = document.getElementById("phoneLogin");

  if (tab === "email") {
    emailTab.className = emailTab.className.replace(
      "tab-inactive",
      "tab-active"
    );
    phoneTab.className = phoneTab.className.replace(
      "tab-active",
      "tab-inactive"
    );
    emailLogin.classList.remove("hidden");
    phoneLogin.classList.add("hidden");
  } else {
    phoneTab.className = phoneTab.className.replace(
      "tab-inactive",
      "tab-active"
    );
    emailTab.className = emailTab.className.replace(
      "tab-active",
      "tab-inactive"
    );
    phoneLogin.classList.remove("hidden");
    emailLogin.classList.add("hidden");
  }

  // Reset
  clearMessages();
  resetForm();
};

// Alternar visibilidade da senha
window.togglePassword = function (fieldId) {
  const field = document.getElementById(fieldId);
  const eyeIcon = document.getElementById("eyeIcon");

  if (field.type === "password") {
    field.type = "text";
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
    `;
  } else {
    field.type = "password";
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    `;
  }
};

// Função principal de login
window.handleLogin = async function () {
  // Verificar hCaptcha
  try {
    const captchaResponse = hcaptcha.getResponse();
    if (!captchaResponse) {
      showMessage("Por favor, complete o captcha.", "error");
      return;
    }
  } catch (error) {
    console.error("Erro no hCaptcha:", error);
    showMessage("Erro no sistema de segurança. Tente novamente.", "error");
    return;
  }

  // Apenas login por email implementado
  await loginWithEmail();
};

// Login com email
async function loginWithEmail() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Preencha todos os campos.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Por favor, insira um email válido.", "error");
    return;
  }

  showLoading(true);

  try {
    // Obter token do captcha
    const captchaToken = hcaptcha.getResponse();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      options: {
        captchaToken: captchaToken,
      },
    });

    if (error) throw error;

    showMessage("Login realizado com sucesso!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    console.error("Erro no login:", error);
    showMessage("Erro: " + traduzirErroSupabase(error.message), "error");
  } finally {
    showLoading(false);
  }
}

// Funções auxiliares
function showLoading(show) {
  const loading = document.getElementById("loading");
  const loginBtn = document.getElementById("loginBtn");

  if (show) {
    loading.classList.remove("hidden");
    loginBtn.disabled = true;
    loginBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    loading.classList.add("hidden");
    loginBtn.disabled = false;
    loginBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function updateLoginButton(text) {
  document.getElementById("loginBtnText").textContent = text;
}

function showMessage(text, type) {
  const message = document.getElementById("message");
  message.textContent = text;

  message.classList.remove("text-red-400", "text-green-400");

  if (type === "error") {
    message.classList.add("text-red-400");
  } else if (type === "success") {
    message.classList.add("text-green-400");
  }
}

function clearMessages() {
  document.getElementById("message").textContent = "";
}

function resetForm() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("smsCode").value = "";
  document.getElementById("smsCodeField").classList.add("hidden");
  isAwaitingSMS = false;
  updateLoginButton("Entrar");
  hcaptcha.reset();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function traduzirErroSupabase(message) {
  if (message.includes("Invalid login credentials")) {
    return "Email ou senha incorretos.";
  }
  if (message.includes("Email not confirmed")) {
    return "Email não confirmado. Verifique sua caixa de entrada.";
  }
  if (message.includes("Phone not confirmed")) {
    return "Telefone não confirmado.";
  }
  if (message.includes("Invalid phone number")) {
    return "Número de telefone inválido.";
  }
  if (message.includes("Too many requests")) {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  return message;
}

// Permitir login com Enter
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleLogin();
  }
});
