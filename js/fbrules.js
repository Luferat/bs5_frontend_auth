rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // --- Regras para a Coleção Users ---
    match /Users/{userId} {
      // 1. Leitura: Permitida para todos (público).
      allow read: if true;

      // 2. Criação e Atualização: Permitida apenas para usuários autenticados.
      allow create, update: if request.auth != null;

      // 3. Deleção: Não é permitida para ninguém.
      allow delete: if false;
    }

    // --- Regras para a Coleção Things ---
    match /Things/{thingId} {
      // 1. Leitura: Permitida para todos (público).
      allow read: if true;

      // 2. Criação e Atualização: Permitida apenas para usuários autenticados.
      allow create, update: if request.auth != null;

      // 3. Deleção: Não é permitida para ninguém.
      allow delete: if false;
    }

    // --- Bloqueio Geral (Boa Prática) ---
    // Nega acesso de leitura e escrita a todas as outras coleções não definidas acima.
    match /{document=**} {
      allow read, write: if false;
    }

  }
}