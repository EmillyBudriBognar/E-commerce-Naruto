// scripts/carrinho-pagina.js

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há usuário logado
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Por favor, faça login para ver seu carrinho.');
        window.location.href = '../login/index.html';
        return;
    }

    const usuario = JSON.parse(usuarioLogado);
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Filtra apenas os itens do usuário logado
    const itensUsuario = carrinho.filter(item => item.usuario === usuario.nome);
    
    // Elementos da página
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoItens = document.getElementById('carrinho-itens');
    const tbody = document.getElementById('itens-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    if (itensUsuario.length === 0) {
        carrinhoVazio.classList.remove('d-none');
        carrinhoItens.classList.add('d-none');
    } else {
        carrinhoVazio.classList.add('d-none');
        carrinhoItens.classList.remove('d-none');
        
        // Limpa a tabela antes de adicionar os itens
        tbody.innerHTML = '';
        
        let total = 0;
        
        // Adiciona cada item ao carrinho
        itensUsuario.forEach(item => {
            const precoTotal = item.preco * (item.quantidade || 1);
            total += precoTotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome} ${item.quantidade > 1 ? `(x${item.quantidade})` : ''}</td>
                <td>R$ ${precoTotal.toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="btn btn-sm btn-danger remover-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Atualiza o total
        totalCarrinho.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Adiciona evento para remover itens
    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removerItemDoCarrinho(itemId, usuario.nome);
        });
    });

    // Evento para finalizar compra
    document.getElementById('finalizar-compra').addEventListener('click', function() {
        finalizarCompra(usuario.nome);
    });
});

// Função para remover item do carrinho
function removerItemDoCarrinho(itemId, usuarioNome) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Filtra removendo o item específico do usuário
    carrinho = carrinho.filter(item => !(item.id === itemId && item.usuario === usuarioNome));
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload(); // Recarrega a página para atualizar a lista
}

// Função para finalizar compra
function finalizarCompra(usuarioNome) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Remove apenas os itens do usuário atual
    carrinho = carrinho.filter(item => item.usuario !== usuarioNome);
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert('Compra finalizada com sucesso!');
    location.reload();
}