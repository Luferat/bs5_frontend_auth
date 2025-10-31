/**
 * JavaScript do layout.
 * Template com autenticação de usuário pelo Google.
 * Referências desta página: https://firebase.google.com/docs/build?hl=pt-br
 */

/**
 * Configuração: ação ao clicar no usuário logado:
 *  - Se vazio (''), faz logout do usuário
 *  - Se tem uma rota (Ex.: '/profile'), acessa
 */
const loggedUserAction = '';
// const loggedUserAction = '/profile';

/**
 * Configuração: ID do elemento que contém o avatar do usuário.
 * Altere conforme seu HTML.
 */
const userClickId = 'userInOutLink';

/**
 * Configuração: rota de persistência.
 * Rota da API/Backend que recebe o JSON com os dados do usuário quando o perfil é atualizado.
 * - Use um endpoint completo ou somente a rota. Ex.:
 *     - Endpoint completo → https://minhaapi.com/user/login
 *     - Somente a rota → /user/login ← Se o front-end está no mesmo domínio.
 *   DICA! Quando implementar seu back-end, não esqueça de implementar o endpoint abaixo usando o método POST.
 * - Se vazio (""), não envia os dados para a API/backend;
 * - Se "firebase", faz a persistência no projeto atual do Firebase Firestore, na coleção `Users`;
 */
// const apiLoginEndpoint = 'firebase';
// const apiLoginEndpoint = '/owner/login';
const apiLoginEndpoint = '';

/** 
 * Configuração: rota de logout
 * Rota da API/Backend que recebe a requisição de logout do usuário quando ele sai do front-end.
 * Por exemplo, notifica o backend para deletar o cookie de sessão seguro (JWT). 
 * - Use um endpoint completo ou somente a rota. Ex.:
 *     - Endpoint completo → https://minhaapi.com/user/logout
 *     - Somente a rota → /user/logout ← Se o front-end está no mesmo domínio.
 * - Se vazio (""), não envia os dados para a API/backend;
 */
// const apiLogoutEndpoint = '/user/logout';
const apiLogoutEndpoint = '';

/**
 * Configuração: configuração do Projeto Firebase.
 * Altere essas configurações conforme seu projeto no Firebase.com
 *  - Entre no console do projeto no Firebase
 *  - Clique na engrenagem
 *  - Copie os dados do projeto nas chaves abaixo
 */
const firebaseConfig = {
    apiKey: "AIzaSyDHQPWxYc2Xc2xXwW2dh6bg1Bup7vjYNrk",
    authDomain: "ngcrud-93a6f.firebaseapp.com",
    projectId: "ngcrud-93a6f",
    storageBucket: "ngcrud-93a6f.firebasestorage.app",
    messagingSenderId: "1043187476281",
    appId: "1:1043187476281:web:777f337c87a8d171d22ae8"
};

/**
 * Configuração: mostra logs das ações no console
 *  - Se true, mostra logs
 *  - Se false, oculta logs
 */
const showLogs = false;

// Inicializa o Firebase e o Authentication
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();

// Referência ao elemento HTML clicável
const userInOut = document.getElementById(userClickId);

// Adicione a class "is-logged" aos elementos da página que só são visíveis quando o usuário está logado.
const isLogged = document.querySelectorAll('.is-logged');

// Adicione a class "not-is-logged" aos elementos da página que só são visíveis quando não tem ususário logado.
const notIsLogged = document.querySelectorAll('.not-is-logged');

// Função para Login com Google usando Popup
const googleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        // Abre o popup do Google para login
        await auth.signInWithPopup(provider);
        showLogs ? console.log('Login com Google bem-sucedido!') : null;
        // O estado de autenticação será atualizado pelo listener onAuthStateChanged abaixo
    } catch (error) {
        showLogs ? console.error("Erro no login com Google:", error) : null;
        alert('Erro ao fazer login. Verifique o console para mais detalhes.');
    }
};

// Função para Logout
const googleLogout = async () => {
    try {
        // Limpa o estado no Firebase Authentication (do lado do cliente)
        await auth.signOut();

        // Se configurou um endpoint de logout
        if (apiLogoutEndpoint != "") {

            const response = await fetch(apiLogoutEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: "logout" })
            });

            if (response.ok) {
                showLogs ? console.log('Logout bem-sucedido e cookie de sessão removido!'): null;
                // Após logout bem-sucedido, redireciona para a home
                window.location.href = '/home';
            } else {
                showLogs ? console.error('Erro ao notificar o backend sobre o logout.'): null;
            }
        }

    } catch (error) {
        showLogs ? console.error("Erro no logout:", error): null;
        alert('Erro ao fazer logout. Verifique o console para mais detalhes.');
    }
};

// Função de Manipulação de Clique (Login/Página de Perfil)
const handleUserInOutClick = (event) => {
    // Evita que o <a> navegue imediatamente, pois vamos gerenciar isso no JavaScript
    event.preventDefault();

    // Obtém status do usuário
    const user = auth.currentUser;

    if (user) {
        // Usuário LOGADO clica no avatar
        if (loggedUserAction == '') {
            // Opção para fazer logout
            if (confirm("Tem certeza que deseja sair do aplicativo?")) {
                googleLogout()
            }
        } else {
            // Opção que redireciona para outra rota
            window.location.href = loggedUserAction;
        }
    } else {
        // Usuário DESLOGADO: Inicia o processo de login
        googleLogin();
    }
};

// Função para atualizar a interface
const updateUI = (user) => {
    if (user) {
        // Usuário LOGADO: Mostra o Avatar

        // Atualiza o elemento <img> com o avatar do usuário (photoURL)
        const avatarImg = `<img src="${user.photoURL || 'img/user.png'}" alt="${user.displayName || 'Avatar do Usuário'}" class="rounded-circle avatar-sm" referrerpolicy="no-referrer">`;

        // Atualiza o elemento <span> com nome do usuário (displayName)
        const loginSpan = `<span class="d-md-none ms-3">${user.displayName || 'Usuário logado'}</span>`;

        // Atualiza os dados do usuário no link
        userInOut.innerHTML = avatarImg + loginSpan;

        // Atualiza o link para a página de perfil
        if (loggedUserAction == '') {
            // Atualiza o link para o logout (embora o JS trate o clique)
            userInOut.href = '/logout';
            userInOut.title = `Fazer logout de ${user.displayName}`;
        } else {
            userInOut.href = loggedUserAction;
            userInOut.title = `Ver perfil de ${user.displayName}`;
        }

        // Mostra elementos quando usuário ESTÁ logado
        isLogged.forEach(element => {
            element.classList.remove('d-none');
            element.classList.add('d-block');
        });

        // Oculta elementos quando usuário ESTÁ logado
        notIsLogged.forEach(element => {
            element.classList.remove('d-block');
            element.classList.add('d-none');
        });

    } else {
        // Usuário DESLOGADO: Mostra a imagem padrão

        // Cria o elemento <img> (ícone)
        const icon = `<img src="img/user.png" alt="Logue-se com o Google" class="rounded-circle avatar-sm">`;

        // Cria o elemento <span>
        const loginSpan = `<span class="d-md-none ms-3">Login com Google</span>`;

        // Adiciona o ícone ao avatar usuário
        userInOut.innerHTML = icon + loginSpan;

        // Atualiza o link para o login (embora o JS trate o clique)
        userInOut.href = '/login';
        userInOut.title = `Fazer login usando o Google`;

        // Oculta elementos quando usuário NÃO logado
        isLogged.forEach(element => {
            element.classList.remove('d-block');
            element.classList.add('d-none');
        });

        // Mostra elementos quando usuário NÃO logado 
        notIsLogged.forEach(element => {
            element.classList.remove('d-none');
            element.classList.add('d-block');
        });
    }
};

/**
 * Função para persistir os dados em uma API
 * Envia os dados do usuário logado para a API/backend via JSON.
 */
const sendUserToBackend = async (user) => {
    const idToken = await user.getIdToken(true);
    try {
        // Dados do usuário do Firebase Authentication a serem persistidos
        const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now(),
            lastLoginAt: Date.now()
        };

        // A rota da API recebe os dados do usuário logado via JSON e POST e faz persistência
        const response = await fetch(apiLoginEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showLogs ? console.log('Dados do usuário enviados com sucesso para o backend'): null;
        } else {
            showLogs ? console.log('Erro ao enviar dados para o backend'): null;
        }
    } catch (error) {
        showLogs ? console.error('Erro ao enviar dados:', error): null;
    }
};

/**
 * Função para persistir os dados no Firebase Firestore
 * Envia os dados do usuário logado para a API/backend via JSON.
 */
const sendUserToFirestore = async (user) => {
    try {
        // Se a biblioteca Firestore não estiver carregada mostra erro
        if (typeof firebase.firestore !== 'function') {
            showLogs ? console.error("Firestore não está inicializado. Certifique-se de que a biblioteca Firestore (ex: firebase-firestore.js) foi carregada."): null;
            return;
        }

        // Inicializa o Firestore
        const db = firebase.firestore();

        // Referência ao documento do usuário (document ID = user.uid) na coleção 'Users'
        const userDocRef = db.collection("Users").doc(user.uid);

        // Dados a serem persistidos no Firestore
        const userData = {
            uid: user.uid,
            displayName: user.displayName || null,
            email: user.email || null,
            photoURL: user.photoURL || null,
            // O 'createdAt' só deve ser definido se o documento for criado (novo usuário)
            // Usamos o "FieldValue.serverTimestamp()" para obter um timestamp do servidor do Firebase (melhor prática)
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now(),
            lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Cria ou atualiza o documento.
        // { merge: true } garante que o documento seja atualizado se já existir,
        // preservando outros campos não especificados em 'userData'.
        await userDocRef.set(userData, { merge: true });

        showLogs ? console.log('Dados do usuário persistidos com sucesso no Firestore (Coleção Users, Doc ID: ' + user.uid + ')'): null;

    } catch (error) {
        showLogs ? console.error('Erro ao persistir dados no Firestore:', error): null;
    }
}

// Listener para o estado de autenticação
// Este listener é executado sempre que o estado do usuário (logado/deslogado) muda.
auth.onAuthStateChanged((user) => {
    updateUI(user);

    // Se usuário fez login, envia dados para o backend
    if (user && apiLoginEndpoint != '') {
        if (apiLoginEndpoint == 'firebase') {
            showLogs ? console.log("Persistindo no Firebase."): null;
            sendUserToFirestore(user);
        } else {
            showLogs ? console.log("Persistindo na API."): null;
            sendUserToBackend(user);
        }
    } else {
        showLogs ? console.log("Persistência desligada!"): null;
    }
});

// Adiciona o Event Listener ao elemento `userInOut`
userInOut.addEventListener('click', handleUserInOutClick);
