
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('password').value;
            const manterConectado = document.getElementById('manterLogin').checked;
            
            // Limpa mensagens de erro
            document.getElementById('email-error').style.display = 'none';
            document.getElementById('password-error').style.display = 'none';
            
            // Obtém os usuários do localStorage
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            
            // Verifica se o usuário existe
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);
            
            if (usuario) {
                // Salva o usuário na sessão
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                
                // Se marcado "manter conectado", salva também no localStorage
                if (manterConectado) {
                    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
                }
                
                alert(`Bem-vindo, ${usuario.nome}!`);
                window.location.href = '../index.html';
            } else {
                // Mostra mensagens de erro apropriadas
                const usuarioExiste = usuarios.some(u => u.email === email);
                
                if (!usuarioExiste) {
                    document.getElementById('email-error').textContent = 'Email não cadastrado';
                    document.getElementById('email-error').style.display = 'block';
                } else {
                    document.getElementById('password-error').textContent = 'Senha incorreta';
                    document.getElementById('password-error').style.display = 'block';
                }
            }
        });

        // Verifica se há usuário salvo no localStorage (para "manter conectado")
        document.addEventListener('DOMContentLoaded', function() {
            const usuarioSalvo = localStorage.getItem('usuarioLogado');
            if (usuarioSalvo) {
                const usuario = JSON.parse(usuarioSalvo);
                document.getElementById('email').value = usuario.email;
                document.getElementById('manterLogin').checked = true;
            }
        });
