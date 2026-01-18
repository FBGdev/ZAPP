import { supabase, utils, MESSAGES } from "./config.js";

//SUPABASE
const supabaseUrl = "https://necenbpitqhjjekatnxr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2VuYnBpdHFoampla2F0bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTAxOTYsImV4cCI6MjA3MzIyNjE5Nn0.lIJTxEPAqd-afrydfe0tsPFzyqlIHuhKvM_7FIGxYAg";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Alternar visibilidade da senha
window.togglePassword = function (fieldId) {
  const field = document.getElementById(fieldId);
  const eyeIcon =
    fieldId === "password"
      ? document.getElementById("eyeIcon")
      : document.getElementById("eyeIcon2");

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

// Função principal de cadastro
window.handleSignup = async function () {
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

  await createAccount();
};

// Criar conta
async function createAccount() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validações
  if (!nome || !email || !telefone || !password || !confirmPassword) {
    showMessage("Preencha todos os campos.", "error");
    return;
  }

  if (!isValidName(nome)) {
    showMessage("Nome deve ter pelo menos 2 caracteres.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Por favor, insira um email válido.", "error");
    return;
  }

  const formattedPhone = formatPhoneNumber(telefone);
  if (!isValidPhone(formattedPhone)) {
    showMessage("Número de telefone inválido.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("A senha deve ter pelo menos 6 caracteres.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("As senhas não coincidem.", "error");
    return;
  }

  showLoading(true);
  updateSignupButton("Criando conta...");

  try {
    // Obter token do captcha
    const captchaToken = hcaptcha.getResponse();

    // Criar conta com email e senha
    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            display_name: nome,
            phone: formattedPhone,
          },
          captchaToken: captchaToken,
        },
      }
    );

    if (signupError) throw signupError;

    if (signupData.user) {
      // Criar perfil na tabela de usuários
      try {
        const { error: usuarioError } = await supabase.from("usuarios").insert({
          id: signupData.user.id,
          nome: nome,
          email: email,
          telefone: formattedPhone,
        });

        if (usuarioError) {
          console.warn("Erro ao criar perfil do usuário:", usuarioError);
          
        }
      } catch (usuarioError) {
        console.warn("Erro ao inserir na tabela usuarios:", usuarioError);
      }

      showMessage(
        "Conta criada com sucesso! Verifique seu email para confirmar.",
        "success"
      );

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    }
  } catch (error) {
    console.error("Erro no cadastro:", error);
    showMessage("Erro: " + traduzirErroSupabase(error.message), "error");
  } finally {
    showLoading(false);
  }
}

// Funções auxiliares
function showLoading(show) {
  const loading = document.getElementById("loading");
  const signupBtn = document.getElementById("signupBtn");

  if (show) {
    loading.classList.remove("hidden");
    signupBtn.disabled = true;
    signupBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    loading.classList.add("hidden");
    signupBtn.disabled = false;
    signupBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function updateSignupButton(text) {
  document.getElementById("signupBtnText").textContent = text;
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

function isValidName(name) {
  return name && name.trim().length >= 2;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+55\d{10,11}$/;
  return phoneRegex.test(phone);
}

function formatPhoneNumber(phone) {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");

  // Adiciona código do país se não tiver
  if (cleaned.length === 11) {
    return "+55" + cleaned;
  } else if (cleaned.length === 10) {
    return "+55" + cleaned;
  }

  return "+55" + cleaned;
}

function traduzirErroSupabase(message) {
  if (message.includes("User already registered")) {
    return "Este email já está cadastrado.";
  }
  if (message.includes("Password should be at least 6 characters")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (message.includes("Invalid phone number")) {
    return "Número de telefone inválido.";
  }
  if (message.includes("Too many requests")) {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  if (message.includes("Invalid email")) {
    return "Email inválido.";
  }
  return message;
}

// Formatação automática do telefone
document.getElementById("telefone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length <= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    if (value.length < 14) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
  }

  e.target.value = value;
});

// Validação em tempo real das senhas
document
  .getElementById("confirmPassword")
  .addEventListener("input", function (e) {
    const password = document.getElementById("password").value;
    const confirmPassword = e.target.value;

    if (confirmPassword && password !== confirmPassword) {
      e.target.classList.add("ring-red-500");
    } else {
      e.target.classList.remove("ring-red-500");
    }
  });

// Permitir cadastro com Enter
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleSignup();
  }
});
