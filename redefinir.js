import { supabase, utils, MESSAGES } from "./config.js";

//SUPABASE
const supabaseUrl = "https://necenbpitqhjjekatnxr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2VuYnBpdHFoampla2F0bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTAxOTYsImV4cCI6MjA3MzIyNjE5Nn0.lIJTxEPAqd-afrydfe0tsPFzyqlIHuhKvM_7FIGxYAg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

window.sendPasswordReset = async function () {
  const email = document.getElementById("resetEmail").value;
  const message = document.getElementById("message");
  const loading = document.getElementById("loading");
  const resetBtn = document.getElementById("resetBtn");

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

  // Validação básica
  if (!email) {
    showMessage("Por favor, insira seu email.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Por favor, insira um email válido.", "error");
    return;
  }

  // Mostrar loading
  loading.classList.remove("hidden");
  resetBtn.disabled = true;
  resetBtn.classList.add("opacity-50", "cursor-not-allowed");

  try {
    // Obter token do captcha
    const captchaToken = hcaptcha.getResponse();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password.html",
      captchaToken: captchaToken,
    });

    if (error) {
      throw error;
    }

    showMessage(
      "Link de redefinição enviado para seu email! Verifique sua caixa de entrada.",
      "success"
    );

    // Limpar campo após sucesso
    document.getElementById("resetEmail").value = "";
  } catch (error) {
    console.error("Erro ao enviar reset:", error);
    showMessage("Erro: " + traduzirErroSupabase(error.message), "error");
  } finally {
    // Esconder loading
    loading.classList.add("hidden");
    resetBtn.disabled = false;
    resetBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
};

function showMessage(text, type) {
  const message = document.getElementById("message");
  message.textContent = text;

  // Remover classes anteriores
  message.classList.remove("text-red-400", "text-green-400");

  // Adicionar classe baseada no tipo
  if (type === "error") {
    message.classList.add("text-red-400");
  } else if (type === "success") {
    message.classList.add("text-green-400");
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function traduzirErroSupabase(message) {
  if (message.includes("Invalid email")) {
    return "Email inválido.";
  }
  if (message.includes("User not found")) {
    return "Usuário não encontrado.";
  }
  if (message.includes("Too many requests")) {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  return message;
}

// Permitir envio com Enter
document
  .getElementById("resetEmail")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendPasswordReset();
    }
  });
