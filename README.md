<!-- PROJECT_METADATA
{
  "title": "Sua Barbearia — Frontend",
  "short_description": "SPA web para gestão completa de barbearias: agendamentos online, painel do profissional, dashboard do estabelecimento e autenticação JWT.",
  "primary_stack": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  "architecture": "Full-Stack Web",
  "detail_description": "Frontend de uma plataforma completa de gestão para barbearias, construído com Next.js 14 (App Router) e TypeScript. Implementa três fluxos distintos de usuário: clientes (agendamento online com visualização de horários disponíveis), profissionais (painel pessoal com agenda do dia, confirmação e conclusão de atendimentos) e estabelecimento (dashboard com métricas, cadastro de barbeiros e serviços). A autenticação é baseada em JWT com refresh token, e a comunicação com o backend Java/Spring Boot é feita via camada de serviços dedicada.",
  "images": ["IMG/print1.png", "IMG/print2.png", "IMG/print3.png", "IMG/print4.png", "IMG/print5.png"],
  "cover_image": "IMG/print1.png",
  "live_url": "https://sua-barbearia-frontend.vercel.app"
}
-->

# Sua Barbearia — Frontend

Frontend da plataforma de gestão para barbearias, com agendamento online, painel do profissional e dashboard do estabelecimento.

**Deploy:** [sua-barbearia-frontend.vercel.app](https://sua-barbearia-frontend.vercel.app)

## Funcionalidades

### Para Clientes
- Busca e seleção de barbearia
- Visualização de horários disponíveis em tempo real
- Agendamento com escolha de serviço e profissional
- Histórico de agendamentos

### Para Profissionais
- Painel com agenda do dia
- Confirmação, conclusão e cancelamento de atendimentos
- Visualização de slots ocupados por duração do serviço

### Para o Estabelecimento
- Dashboard com métricas de agendamentos
- Cadastro e gerenciamento de profissionais e serviços
- Controle completo da operação

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React + TypeScript + Tailwind CSS |
| Autenticação | JWT com refresh token |
| Estado | React Context + hooks customizados |
| HTTP Client | Axios com interceptors |
| Deploy | Vercel |

## Estrutura do Projeto

```
src/
├── app/           # Rotas e layouts (App Router)
├── components/    # Componentes reutilizáveis
├── services/      # Camada de comunicação com API
├── types/         # Tipos TypeScript
└── utils/         # Funções auxiliares
```

## Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

> **Nota:** Requer o backend [Sua-Barbearia-backend](https://github.com/Wanjos-eng/Sua-Barbearia-backend) rodando localmente ou configure `NEXT_PUBLIC_API_URL` para apontar para o servidor.

## Screenshots

| Dashboard | Agendamento |
| --- | --- |
| ![Dashboard](./IMG/print1.png) | ![Agendamento](./IMG/print2.png) |

| Painel do Profissional | Gerenciamento |
| --- | --- |
| ![Profissional](./IMG/print3.png) | ![Gerenciamento](./IMG/print4.png) |

| Login |
| --- |
| ![Login](./IMG/print5.png) |
