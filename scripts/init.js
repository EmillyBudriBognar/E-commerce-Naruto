// Lista de produtos
const produtos = [
    {
        id: 1,
        nome: "Action Figure Naruto",
        descricao: "Figura articulada do Naruto, 20cm de altura.",
        preco: 129.90,
        imagem: "https://via.placeholder.com/300x300"
    },
    {
        id: 2,
        nome: "Copo Térmico Uzumaki",
        descricao: "Copo térmico com design do Naruto, 400ml.",
        preco: 79.90,
        imagem: "https://via.placeholder.com/300x300"
    },
    {
        id: 3,
        nome: "Camiseta Konoha",
        descricao: "Camiseta 100% algodão com símbolo de Konoha.",
        preco: 89.90,
        imagem: "https://via.placeholder.com/300x300"
    }
];

// Carrega usuários padrão
function carregarUsuariosPadrao() {
    if (!localStorage.getItem('usuarios')) {
        const usuarios = [
            { nome: "Naruto Uzumaki", email: "naruto@konoha.com", senha: "123456" },
            { nome: "Sasuke Uchiha", email: "sasuke@konoha.com", senha: "123456" },
            { nome: "Sakura Haruno", email: "sakura@konoha.com", senha: "123456" }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Verifica usuário logado
function verificarUsuarioLogado() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        document.getElementById('welcome-message').textContent = `Bem-vindo, ${usuario.nome}!`;
        document.getElementById('welcome-message').classList.remove('d-none');
    }
}

// Carrega produtos na página
function carregarProdutos() {
    const container = document.getElementById('produtos-container');
    
    produtos.forEach(produto => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        
        col.innerHTML = `
            <div class="card h-100">
                <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.descricao}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold preco-produto">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button class="btn btn-primary btn-comprar" data-produto-id="${produto.id}">Comprar</button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', function() {
    carregarUsuariosPadrao();
    verificarUsuarioLogado();
    carregarProdutos();
});