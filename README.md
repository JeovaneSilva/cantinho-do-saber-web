# 🎓 Cantinho do Saber - Web App

A interface de usuário (SPA) da plataforma educacional "Cantinho do Saber". Um painel administrativo moderno e responsivo focado na experiência do usuário para a gestão de alunos, aulas, finanças e compartilhamento de materiais didáticos.

## 🚀 Tecnologias Utilizadas

* **Framework:** React (via [Vite](https://vitejs.dev/))
* **Linguagem:** TypeScript
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Roteamento:** React Router Dom (v6)
* **Gerenciamento de Estado/Fetch:** React Query (TanStack Query)
* **Deploy:** [Vercel](https://vercel.com/)

## ✨ Principais Funcionalidades

* **Roteamento Inteligente:** Implementação de `PrivateRoute` e `PublicRoute` para redirecionamento automático baseado no estado do Token (ex: usuários logados são enviados direto ao Dashboard).
* **Dashboard Interativo:** Visão geral da escola/tutoria.
* **Gestão de Materiais Didáticos:**
    * Interface com suporte a alternância de visualização (Grid e Lista).
    * Filtros dinâmicos por Matéria e Aluno, além de busca por texto.
    * Upload de materiais (PDF, Imagens) integrado com o back-end.
    * Visualização direta (Inline) de PDFs e imagens no navegador através de URLs do Supabase.
* **Gestão Completa:** Telas dedicadas para controle de Alunos, Agenda de Aulas e Pagamentos.
* **Feedback Visual:** Utilização de Toasters e Sonner para notificações de sucesso/erro (ex: confirmação de upload ou remoção de arquivo).

## 🛠️ Configuração e Execução Local

### Pré-requisitos
* Node.js (v18+)
* A API do Back-end rodando localmente ou em produção.
