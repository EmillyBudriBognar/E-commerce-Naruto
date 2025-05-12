// Função para carregar usuários no localStorage quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se já existem usuários no localStorage
    if (!localStorage.getItem('usuarios')) {
        // Cria um array com 3 usuários de exemplo
        const usuarios = [
            { nome: "Naruto Uzumaki", email: "naruto@konoha.com", senha: "123456" },
            { nome: "Sasuke Uchiha", email: "sasuke@konoha.com", senha: "123456" },
            { nome: "Sakura Haruno", email: "sakura@konoha.com", senha: "123456" }
        ];
        
        // Salva os usuários no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    // Verifica se há um usuário logado na sessão
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        // Se estiver logado, mostra mensagem de boas-vindas
        const usuario = JSON.parse(usuarioLogado);
        document.getElementById('welcome-message').textContent = `Bem-vindo, ${usuario.nome}!`;
        document.getElementById('welcome-message').classList.remove('d-none');
    }
    
    // Configura os botões de compra
    configurarBotoesComprar();
    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();
});

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(produtoId, produtoNome, produtoPreco) {
    // Verifica se o usuário está logado
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert('Por favor, faça login para adicionar produtos ao carrinho.');
        window.location.href = 'login/index.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioLogado);
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => 
        item.id === produtoId && 
        item.usuario === usuario.nome
    );
    
    if (produtoExistente) {
        produtoExistente.quantidade = (produtoExistente.quantidade || 1) + 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            preco: parseFloat(produtoPreco),
            usuario: usuario.nome,
            data: new Date().toISOString(),
            quantidade: 1
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Mostra mensagem de sucesso
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${produtoNome} foi adicionado ao carrinho!
    `;
    document.body.appendChild(toast);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Atualiza o ícone do carrinho
    atualizarContadorCarrinho();
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) return;
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const usuario = JSON.parse(usuarioLogado);
    const itensUsuario = carrinho.filter(item => item.usuario === usuario.nome);
    const totalItens = itensUsuario.reduce((total, item) => total + (item.quantidade || 1), 0);
    
    // Remove o contador existente, se houver
    const contadorExistente = document.querySelector('.cart-counter');
    if (contadorExistente) {
        contadorExistente.remove();
    }
    
    if (totalItens > 0) {
        const contador = document.createElement('span');
        contador.className = 'cart-counter';
        contador.textContent = totalItens;
        
        const iconeCarrinho = document.querySelector('.fa-shopping-cart').parentNode;
        iconeCarrinho.appendChild(contador);
    }
}

// Configura os botões de compra
function configurarBotoesComprar() {
    document.querySelectorAll('.btn-buy').forEach(botao => {
        botao.addEventListener('click', function() {
            const produtoId = this.getAttribute('data-produto-id');
            const produtoNome = this.getAttribute('data-produto-nome');
            const produtoPreco = this.getAttribute('data-produto-preco');
            
            adicionarAoCarrinho(produtoId, produtoNome, produtoPreco);
        });
    });
}