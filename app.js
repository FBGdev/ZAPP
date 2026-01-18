import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseUrl = "https://necenbpitqhjjekatnxr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lY2VuYnBpdHFoampla2F0bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTAxOTYsImV4cCI6MjA3MzIyNjE5Nn0.lIJTxEPAqd-afrydfe0tsPFzyqlIHuhKvM_7FIGxYAg";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let usuarioLogado = null;
let carrinho = [];

//  MENU 
async function carregarMenu() {
  const { data: produtos, error } = await supabase
    .from("produtos")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    console.error("Erro ao carregar produtos:", error);
    return;
  }

  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "";

  produtos.forEach((item) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition";

    const esgotado = item.estoque <= 0;

    card.innerHTML = `
      <img src="${item.img}" class="w-32 h-32 object-cover rounded mb-2" alt="${
      item.nome
    }">
      <h3 class="text-lg font-bold">${item.nome}</h3>
      <p class="text-gray-600 mb-2">R$ ${item.preco.toFixed(2)}</p>
      <p class="text-sm ${esgotado ? "text-red-600" : "text-green-600"} mb-2">
        ${esgotado ? "Esgotado" : `Em estoque: ${item.estoque}`}
      </p>
      <button class="text-red-600 text-sm underline mb-2" onclick='mostrarDescricaoCompleta(${JSON.stringify(
        item
      )})'>
        Ver descrição
      </button>
      <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" 
        ${
          esgotado
            ? "disabled"
            : `onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})"`
        }>
        ${esgotado ? "Indisponível" : "Adicionar"}
      </button>
    `;

    menuDiv.appendChild(card);
  });
}

//  CARRINHO 
window.adicionarAoCarrinho = async function (nome, preco) {
  // consulta estoque e imagem no banco
  const { data: produto, error } = await supabase
    .from("produtos")
    .select("estoque, img")
    .eq("nome", nome)
    .single();

  if (error) {
    console.error("Erro ao buscar produto:", error);
    alert("Erro ao verificar estoque!");
    return;
  }

  if (!produto || produto.estoque <= 0) {
    mostrarMensagem("Produto indisponível", "Este produto está esgotado!");
    return;
  }

  const existente = carrinho.find((item) => item.nome === nome);
  if (existente) {
    if (existente.qtd + 1 > produto.estoque) {
      mostrarMensagem(
        "Estoque insuficiente",
        "Não há quantidade suficiente em estoque."
      );
      return;
    }
    existente.qtd += 1;
  } else {
    carrinho.push({ nome, preco, qtd: 1, observacao: "", img: produto.img });
  }

  atualizarCarrinhoUI();
};

window.removerDoCarrinho = function (nome) {
  carrinho = carrinho.filter((item) => item.nome !== nome);
  atualizarCarrinhoUI();
};

function atualizarCarrinhoUI() {
  const divItens = document.getElementById("carrinho-itens");
  const contador = document.getElementById("contador-carrinho");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  divItens.innerHTML = "";

  let subtotal = 0;

  carrinho.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "border-b pb-4";

    div.innerHTML = `
      <div class="flex items-center gap-4">
        <!-- Imagem do produto (genérica se não tiver no banco) -->
        <img src="${item.img || "https://via.placeholder.com/60"}" 
             alt="${item.nome}" 
             class="w-16 h-16 rounded object-cover">

        <div class="flex-1">
          <h3 class="font-semibold text-gray-800">${item.nome}</h3>
          <p class="text-sm text-gray-500">R$ ${item.preco.toFixed(2)}</p>
          
          <div class="flex items-center gap-2 mt-2">
            <button onclick="alterarQuantidade('${item.nome}', -1)" 
              class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center">−</button>
            <span class="px-2">${item.qtd}</span>
            <button onclick="alterarQuantidade('${item.nome}', 1)" 
              class="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center">+</button>
            <button onclick="removerDoCarrinho('${item.nome}')" 
              class="ml-auto text-red-500 hover:text-red-700">Excluir</button>
          </div>
        </div>
      </div>
      
      <!-- Observação -->
      <div class="mt-2">
        <input type="text" value="${item.observacao}" 
          placeholder="Observação (ex: sem cebola)" 
          class="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          oninput="atualizarObservacao(${index}, this.value)" />
      </div>
    `;

    divItens.appendChild(div);
    subtotal += item.qtd * item.preco;
  });

  // Atualiza contador no ícone do carrinho
  contador.textContent = `(${carrinho.length})`;

  // Atualiza valores do resumo
  subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
}

window.atualizarObservacao = function (index, valor) {
  if (carrinho[index]) {
    carrinho[index].observacao = valor;
  }
};

document.getElementById("abrir-carrinho").addEventListener("click", () => {
  document.getElementById("modal-carrinho").classList.remove("hidden");
});
document.getElementById("fechar-modal").addEventListener("click", () => {
  document.getElementById("modal-carrinho").classList.add("hidden");
});

//  TROCO 
const pagamentoSelect = document.getElementById("pagamento");
const campoTroco = document.getElementById("campo-troco");

pagamentoSelect.addEventListener("change", () => {
  if (pagamentoSelect.value === "dinheiro") {
    campoTroco.classList.remove("hidden");
  } else {
    campoTroco.classList.add("hidden");
  }
});

//  CUPOM 
async function aplicarCupom(total, codigo) {
  if (!codigo) return total;

  const { data: cupom, error } = await supabase
    .from("cupons")
    .select("*")
    .eq("codigo", codigo)
    .eq("ativo", true)
    .maybeSingle();

  if (error) {
    console.error("Erro ao validar cupom:", error);
    return total;
  }

  if (!cupom) {
    mostrarMensagem("Cupom inválido", "Este cupom não existe ou está inativo.");
    return total;
  }

  if (cupom.tipo === "valor") {
    total -= cupom.desconto;
  } else if (cupom.tipo === "percentual") {
    total -= total * (cupom.desconto / 100);
  }

  if (total < 0) total = 0;
  return total;
}

//  FINALIZAR PEDIDO 
document
  .getElementById("finalizar-pedido")
  .addEventListener("click", async () => {
    if (!usuarioLogado) {
      mostrarMensagem(
        "Login necessário",
        "Você precisa estar logado para finalizar seu pedido. Faça login ou cadastre-se antes de continuar.",
        true
      );
      return;
    }

    const nome = document.getElementById("nome").value;
    const celular = document.getElementById("celular").value;
    const endereco = document.getElementById("endereco").value;
    const pagamento = document.getElementById("pagamento").value;
    const valorTroco = document.getElementById("valor-troco").value;
    const codigoCupom = document.getElementById("cupom")?.value.trim();

    if (!nome || !celular || !endereco || carrinho.length === 0) {
      mostrarMensagem(
        "Campos obrigatórios",
        "Preencha todos os campos e adicione ao menos um item ao pedido."
      );
      return;
    }

    let totalPedido = carrinho.reduce(
      (total, item) => total + item.qtd * item.preco,
      0
    );

    // aplicar cupom
    totalPedido = await aplicarCupom(totalPedido, codigoCupom);

    if (
      pagamento === "dinheiro" &&
      (!valorTroco || parseFloat(valorTroco) < totalPedido)
    ) {
      mostrarMensagem("Troco inválido", "Informe um valor de troco válido.");
      return;
    }

    const pedidoData = {
      nome,
      celular,
      endereco,
      pagamento,
      troco:
        pagamento === "dinheiro"
          ? valorTroco || "Não informado"
          : "Não necessário",
      total: parseFloat(totalPedido.toFixed(2)),
      email_usuario:
        (await supabase.auth.getUser()).data?.user?.email || "desconhecido",
      status: "pendente",
    };

    try {
      // Inserir pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([pedidoData])
        .select();

      if (pedidoError) throw pedidoError;

      const novoPedidoId = pedido[0].id;

      // Inserir itens
      const itensParaInserir = carrinho.map((item) => ({
        pedido_id: novoPedidoId,
        nome_item: item.nome,
        preco: item.preco,
        quantidade: item.qtd,
        observacao: item.observacao,
      }));

      const { error: itensError } = await supabase
        .from("pedido_itens")
        .insert(itensParaInserir);

      if (itensError) throw itensError;

      // Atualizar estoque
      for (const item of carrinho) {
        await supabase.rpc("decrementar_estoque", {
          nome_produto: item.nome,
          qtd: item.qtd,
        });
      }

      mostrarModalSucesso();

      carrinho = [];
      atualizarCarrinhoUI();
      document.getElementById("modal-carrinho").classList.add("hidden");
      document.getElementById("nome").value = "";
      document.getElementById("celular").value = "";
      document.getElementById("endereco").value = "";
      document.getElementById("pagamento").value = "pix";
      campoTroco.classList.add("hidden");
      document.getElementById("valor-troco").value = "";
      if (document.getElementById("cupom"))
        document.getElementById("cupom").value = "";
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      mostrarModalErro();
    }

    document.getElementById("pagamento").value = "pix";
    campoTroco.classList.add("hidden");
    document.getElementById("valor-troco").value = "";
  });

//modal de pedido
function mostrarModalSucesso() {
  const modal = document.getElementById("modal-sucesso");
  modal.classList.remove("hidden");

  document.getElementById("btn-ok").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

//modal de pediido
function mostrarModalErro() {
  const modal = document.getElementById("modal-erro");
  modal.classList.remove("hidden");

  document.getElementById("btn-erro").addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

//  QUANTIDADE 
window.alterarQuantidade = async function (nome, delta) {
  const item = carrinho.find((i) => i.nome === nome);
  if (!item) return;

  // Verifica estoque atual antes de aumentar
  if (delta > 0) {
    const { data: produto, error } = await supabase
      .from("produtos")
      .select("estoque")
      .eq("nome", nome)
      .single();

    if (error || !produto) {
      mostrarMensagem("Erro", "Não foi possível verificar o estoque.");
      return;
    }

    if (item.qtd + 1 > produto.estoque) {
      mostrarMensagem(
        "Estoque insuficiente",
        "Não há mais unidades disponíveis."
      );
      return;
    }
  }

  item.qtd += delta;
  if (item.qtd < 1) carrinho = carrinho.filter((i) => i.nome !== nome);

  atualizarCarrinhoUI();
};

//  DESCRIÇÃO PRODUTO 
window.mostrarDescricaoCompleta = function (produto) {
  const modal = document.getElementById("descricaoModal");
  const img = document.getElementById("modalImg");
  const titulo = document.getElementById("modalTitulo");
  const descricao = document.getElementById("modalDescricao");
  const preco = document.getElementById("modalPreco");
  const btnAdicionar = document.getElementById("modalBtnAdicionar");

  img.src = produto.img;
  titulo.textContent = produto.nome;
  descricao.textContent = produto.descricao;
  preco.textContent = `R$ ${produto.preco.toFixed(2).replace(".", ",")}`;

  btnAdicionar.onclick = function () {
    adicionarAoCarrinho(produto.nome, produto.preco);
    fecharModal();
  };

  modal.classList.remove("hidden");
};

window.fecharModal = function () {
  const modal = document.getElementById("descricaoModal");
  modal.classList.add("hidden");
};

// Função para aplicar cupom dentro do carrinho
window.aplicarCupomDireto = async function () {
  const codigoCupom = document.getElementById("cupom").value.trim();

  if (!codigoCupom) {
    alert("Digite um cupom!");
    return;
  }

  let subtotal = carrinho.reduce(
    (total, item) => total + item.qtd * item.preco,
    0
  );

  // chama função que você já tinha para aplicar cupom
  const totalComDesconto = await aplicarCupom(subtotal, codigoCupom);

  document.getElementById("total").textContent = `R$ ${totalComDesconto.toFixed(
    2
  )}`;
};

//modal generico para mensagens

function mostrarMensagem(titulo, texto, redirecionar = false) {
  const modal = document.getElementById("modal-msg");
  const tituloEl = document.getElementById("modal-msg-titulo");
  const textoEl = document.getElementById("modal-msg-texto");
  const btn = document.getElementById("modal-msg-btn");

  tituloEl.textContent = titulo;
  textoEl.textContent = texto;
  modal.classList.remove("hidden");

  btn.onclick = () => {
    modal.classList.add("hidden");

    // Se precisar redirecionar
    if (redirecionar) {
      window.location.href = "login.html"; 
    }
  };
}

// mascara de celular

document.getElementById("celular").addEventListener("input", function (e) {
  let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length <= 10) {
    // Formato fixo ou celular antigo
    e.target.value = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    // Formato celular novo
    e.target.value = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }
});

// MONITORAMENTO DE PEDIDO
const btnMonitorar = document.getElementById("btn-monitorar");
const modalMonitoramento = document.getElementById("modal-monitoramento");
const fecharMonitoramento = document.getElementById("fechar-monitoramento");
const listaMonitoramento = document.getElementById("monitoramento-lista");

btnMonitorar.addEventListener("click", async () => {
  if (!usuarioLogado) {
    mostrarMensagem(
      "Atenção",
      "Você precisa estar logado para acompanhar seus pedidos."
    );
    return;
  }

  modalMonitoramento.classList.remove("hidden");
  await carregarPedidosUsuario();

  function iniciarMonitoramentoRealtime(email) {
    supabase
      .channel("status_pedidos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos" },
        (payload) => {
          const pedido = payload.new;
          if (pedido && pedido.email_usuario === email) {
            atualizarStatusPedido(pedido);
          }
        }
      )
      .subscribe();
  }
});

fecharMonitoramento.addEventListener("click", () => {
  modalMonitoramento.classList.add("hidden");
});

async function carregarPedidosUsuario() {
  const { data: pedidos, error } = await supabase
    .from("pedidos")
    .select("id, status, total, criado_em")
    .eq("email_usuario", usuarioLogado.email)
    .order("criado_em", { ascending: false });

  if (error || !pedidos.length) {
    listaMonitoramento.innerHTML = "<p>Nenhum pedido encontrado.</p>";
    return;
  }

  listaMonitoramento.innerHTML = pedidos
    .map(
      (p) => `
      <div class="border rounded-lg p-3 bg-gray-50">
        <p><strong>ID:</strong> ${p.id}</p>
        <p><strong>Status:</strong> 
          <span id="status-${p.id}" class="text-blue-600 font-semibold">${
        p.status
      }</span>
        </p>
        <p><strong>Total:</strong> R$ ${p.total.toFixed(2)}</p>
        <p class="text-sm text-gray-500">${new Date(
          p.criado_em
        ).toLocaleString()}</p>
      </div>
    `
    )
    .join("");
}

function atualizarStatusPedido(pedido) {
  const statusEl = document.getElementById(`status-${pedido.id}`);
  if (statusEl) {
    statusEl.textContent = pedido.status;
    statusEl.classList.add("text-green-600", "font-bold");

    mostrarMensagem(
      "Atualização de pedido",
      `O pedido #${
        pedido.id
      } agora está com status: ${pedido.status.toUpperCase()}`
    );
  }
}

// Carrega o usuário autenticado logo ao iniciar
async function carregarUsuarioLogado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const authArea = document.getElementById("auth-area");
  const nomeTopo = document.getElementById("nome-usuario-topo");

  if (error || !user) {
    console.warn("Nenhum usuário autenticado");
    if (authArea) {
      authArea.innerHTML = `
        <a href="login.html" class="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">Entrar</a>
        <a href="signup.html" class="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition">Cadastrar</a>
      `;
    }
    if (nomeTopo) nomeTopo.textContent = "";
    return;
  }

  // guarda o usuário para uso em outras funções
  usuarioLogado = user;

  if (authArea) {
    authArea.innerHTML = `
      <span class="text-gray-700 font-medium">👋 ${user.email}</span>
      <button id="btnLogout" class="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Sair</button>
    `;
    document.getElementById("btnLogout").addEventListener("click", async () => {
      await supabase.auth.signOut();
      location.reload();
    });
  }

  if (nomeTopo) nomeTopo.textContent = user.email;
}


async function inicializarApp() {
  await carregarUsuarioLogado();
  carregarMenu();

 
  const btnMonitorar = document.getElementById("btn-monitorar");
  const modalMonitoramento = document.getElementById("modal-monitoramento");
  const fecharMonitoramento = document.getElementById("fechar-monitoramento");

  btnMonitorar.addEventListener("click", async () => {
    if (!usuarioLogado) {
      mostrarMensagem(
        "Atenção",
        "Você precisa estar logado para acompanhar seus pedidos."
      );
      return;
    }

    modalMonitoramento.classList.remove("hidden");
    await carregarPedidosUsuario();

    // Assinar atualizações em tempo real
    iniciarMonitoramentoRealtime(usuarioLogado.email);
  });

  fecharMonitoramento.addEventListener("click", () => {
    modalMonitoramento.classList.add("hidden");
  });
}


// Gera ou recupera um identificador local único
function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

// Salva nome, celular e endereço no Supabase
async function saveCustomerInfo() {
  const nome = document.getElementById("nome")?.value?.trim() || null;
  const celular = document.getElementById("celular")?.value?.trim() || null;
  const endereco = document.getElementById("endereco")?.value?.trim() || null;

  if (!nome || !celular || !endereco) {
    mostrarMensagem(
      "Campos incompletos",
      "Preencha nome, celular e endereço antes de salvar."
    );
    return;
  }

  try {
    const device_id = getDeviceId();

    const { error } = await supabase
      .from("clientes")
      .upsert([{ device_id, nome, celular, endereco }], {
        onConflict: "device_id",
      });

    if (error) throw error;

    mostrarMensagem(
      "Salvo com sucesso",
      "Seus dados foram armazenados para uso futuro."
    );
  } catch (err) {
    console.error("Erro ao salvar cliente:", err);
    mostrarMensagem("Erro", "Não foi possível salvar suas informações.");
  }
}

// Restaura as informações salvas
async function restoreCustomerInfo() {
  try {
    const device_id = getDeviceId();

    const { data, error } = await supabase
      .from("clientes")
      .select("nome, celular, endereco")
      .eq("device_id", device_id)
      .maybeSingle();

    if (error || !data) return;

    if (data.nome) document.getElementById("nome").value = data.nome;
    if (data.celular) document.getElementById("celular").value = data.celular;
    if (data.endereco)
      document.getElementById("endereco").value = data.endereco;
  } catch (err) {
    console.error("Erro ao restaurar cliente:", err);
  }
}



// Adiciona o botão ao formulário
document.addEventListener("DOMContentLoaded", () => {
  const container =
    document.querySelector("#formulario-pedido") || document.body;
  const lembrarBtn = document.createElement("button");
  lembrarBtn.textContent = "Lembrar minhas informações";
  lembrarBtn.className =
    "w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold text-lg";
  lembrarBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await saveCustomerInfo();
  });

  container.appendChild(lembrarBtn);
});

// Restaurar informações automaticamente ao iniciar
(async () => {
  await restoreCustomerInfo();
})();

// Chama essa função no final:
inicializarApp();
