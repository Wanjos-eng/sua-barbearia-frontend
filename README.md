<!-- PROJECT_METADATA
{
  "title": "Sua Barbearia — Frontend",
  "short_description": "SPA Next.js 14 com App Router para gestão completa de barbearias: agendamento online com slots em tempo real, painel do profissional e dashboard do estabelecimento.",
  "primary_stack": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Axios", "JWT"],
  "architecture": "Full-Stack Web",
  "detail_description": "Frontend de uma plataforma completa de gestão para barbearias, construído com Next.js 14 (App Router) e TypeScript. A principal complexidade técnica está na visualização de disponibilidade de horários: o componente de agendamento calcula os slots ocupados considerando a duração do serviço — se um corte dura 50 minutos, os slots intermediários (ex: 9:30 quando o serviço começa às 9:00) são automaticamente bloqueados na grade visual. A autenticação usa JWT com refresh token automático via interceptors do Axios — quando o access token expira, o interceptor transparentemente solicita um novo com o refresh token e retenta a requisição original sem interromper o fluxo do usuário. Três perfis de usuário distintos com rotas e UI completamente diferentes: clientes (agendamento self-service), profissionais (painel de agenda com ações de confirmar/concluir/cancelar) e estabelecimento (dashboard com métricas, gestão de barbeiros e serviços). Deploy na Vercel com CI/CD automático via GitHub Actions.",
  "images": ["IMG/print1.png", "IMG/print2.png", "IMG/print3.png", "IMG/print4.png", "IMG/print5.png"],
  "cover_image": "IMG/print1.png",
  "live_url": "https://sua-barbearia-frontend.vercel.app"
}
-->

# Sua Barbearia — Frontend

Frontend da plataforma de gestão para barbearias. **[Demo ao vivo](https://sua-barbearia-frontend.vercel.app)**

## Funcionalidades por Perfil

### 👤 Clientes
- Busca e seleção de barbearia
- Visualização de horários com cálculo de duração de serviço
- Agendamento com escolha de profissional e serviço
- Histórico de agendamentos

### ✂️ Profissionais
- Painel com agenda do dia em grid de slots
- Slots bloqueados por duração do serviço (não apenas o slot inicial)
- Confirmar / Concluir / Cancelar atendimentos

### 🏪 Estabelecimento
- Dashboard com métricas de agendamentos
- Cadastro e gestão de profissionais e serviços

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React + TypeScript + Tailwind CSS |
| Auth | JWT + Refresh Token via Axios interceptors |
| HTTP | Axios com interceptors automáticos |
| Deploy | Vercel + GitHub Actions CI/CD |

## Screenshots

| Dashboard | Agendamento |
| --- | --- |
| ![Dashboard](./IMG/print1.png) | ![Agendamento](./IMG/print2.png) |
| ![Profissional](./IMG/print3.png) | ![Gerenciamento](./IMG/print4.png) |
