// js/carrinho.js
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há usuário logado
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado) {
        alert('Por favor, faça login para acessar seu carrinho.');
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
        
        // Limpa a tabela
        tbody.innerHTML = '';
        
        let total = 0;
        
        // Adiciona cada item ao carrinho
        itensUsuario.forEach((item, index) => {
            const quantidade = item.quantidade || 1;
            const subtotal = item.preco * quantidade;
            total += subtotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="../assets/img/figura${item.id}.jpg" alt="${item.nome}" class="product-image me-3 rounded">
                        <span>${item.nome}</span>
                    </div>
                </td>
                <td>R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary diminuir-quantidade" data-index="${index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${quantidade}" min="1" 
                               class="form-control quantidade-input mx-2" data-index="${index}">
                        <button class="btn btn-sm btn-outline-secondary aumentar-quantidade" data-index="${index}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="btn btn-sm btn-danger remover-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Atualiza o total
        totalCarrinho.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        // Adiciona eventos aos botões
        adicionarEventos(itensUsuario);
    }

    // Evento para finalizar compra
    document.getElementById('finalizar-compra').addEventListener('click', function() {
        finalizarCompra(usuario.nome);
    });
});

function adicionarEventos(itensUsuario) {
    // Remover item
    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removerItemDoCarrinho(index, itensUsuario);
        });
    });
    
    // Aumentar quantidade
    document.querySelectorAll('.aumentar-quantidade').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            alterarQuantidade(index, itensUsuario, 1);
        });
    });
    
    // Diminuir quantidade
    document.querySelectorAll('.diminuir-quantidade').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            alterarQuantidade(index, itensUsuario, -1);
        });
    });
    
    // Alteração manual da quantidade
    document.querySelectorAll('.quantidade-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            const novaQuantidade = parseInt(this.value);
            
            if (novaQuantidade > 0) {
                atualizarQuantidadeNoCarrinho(index, novaQuantidade, itensUsuario);
            } else {
                this.value = itensUsuario[index].quantidade || 1;
            }
        });
    });
}

function removerItemDoCarrinho(index, itensUsuario) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Encontra o item específico no carrinho completo
    const itemParaRemover = itensUsuario[index];
    carrinho = carrinho.filter(item => 
        !(item.id === itemParaRemover.id && 
          item.usuario === itemParaRemover.usuario &&
          item.data === itemParaRemover.data)
    );
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload();
}

function alterarQuantidade(index, itensUsuario, alteracao) {
    const input = document.querySelector(`.quantidade-input[data-index="${index}"]`);
    let novaQuantidade = parseInt(input.value) + alteracao;
    
    if (novaQuantidade < 1) novaQuantidade = 1;
    
    input.value = novaQuantidade;
    atualizarQuantidadeNoCarrinho(index, novaQuantidade, itensUsuario);
}

function atualizarQuantidadeNoCarrinho(index, novaQuantidade, itensUsuario) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemParaAtualizar = itensUsuario[index];
    
    // Atualiza a quantidade no carrinho completo
    carrinho = carrinho.map(item => {
        if (item.id === itemParaAtualizar.id && 
            item.usuario === itemParaAtualizar.usuario &&
            item.data === itemParaAtualizar.data) {
            return {...item, quantidade: novaQuantidade};
        }
        return item;
    });
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    location.reload();
}

function finalizarCompra(usuarioNome) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Remove apenas os itens do usuário atual
    carrinho = carrinho.filter(item => item.usuario !== usuarioNome);
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert('Compra finalizada com sucesso! Obrigado por comprar na Lojinha do Naruto!');
    location.href = '../index.html';
}