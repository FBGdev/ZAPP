  AOS.init();
    
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

    //SUPABASE
    const supabaseUrl = 'https://necenbpitqhjjekatnxr.supabase.co'; // Substitua pela sua Project URL
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2VuYnBpdHFoampla2F0bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTAxOTYsImV4cCI6MjA3MzIyNjE5Nn0.lIJTxEPAqd-afrydfe0tsPFzyqlIHuhKvM_7FIGxYAg'; // Substitua pela sua anon public key
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // LOGIN/LOGOUT E USUÁRIO 
async function carregarUsuarioLogado() {
  // Recupera usuário logado
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  const authArea = document.getElementById("auth-area");
  const nomeTopo = document.getElementById("nome-usuario-topo");

  if (userError || !user) {
    console.warn("Nenhum usuário autenticado");
    authArea.innerHTML = `
      <a href="login.html" class="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">Entrar</a>
      <a href="signup.html" class="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white">Cadastrar</a>
    `;
    if (nomeTopo) nomeTopo.textContent = "";
    return;
  }

  // Busca nome na tabela 'usuarios'
  const { data, error } = await supabase
    .from("usuarios")
    .select("nome")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar usuário:", error);
  }

  const nome = data?.nome || user.email; // fallback para email

  // Mostra nome no topo
  if (nomeTopo) nomeTopo.textContent = `Bem-vindo, ${nome}!`;

  // Troca botões para "Sair"
  authArea.innerHTML = `
    <span class="text-red me-2">Olá, ${nome}</span>
    <button class="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600" onclick="logout()">Sair</button>
  `;
}

window.logout = async function () {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao sair:", error);
      return;
    }
    window.location.href = "login.html";
  };
  

// Executa ao carregar a página
carregarUsuarioLogado();