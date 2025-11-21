// Definição de tipos para os dados de entrada e saída da API

// Dados para registro de cliente
export interface RegistroClienteData {
  nome: string;
  email: string;
  senha?: string;
  confirmarSenha: string;
  telefone: string;
}

// Dados para login de cliente
export interface LoginClienteData {
  email: string;
  senha?: string;
}

// Dados para atualização de perfil do cliente
export interface UpdateProfileData {
    nome?: string;
    email?: string;
    telefone?: string;
}

// Dados para registro de barbearia
export interface RegistroBarbeariaData {
  nome: string;
  email: string;
  senha?: string;
  confirmarSenha: string;
  telefone: string;
  nomeFantasia: string;
  tipoDocumento: 'CPF' | 'CNPJ';
  documento: string;
  endereco: string;
}

// Dados para login de barbearia
export interface LoginBarbeariaData {
    email: string;
    senha?: string;
}


// --- Funções de interação com a API ---

// URL base da API, obtida das variáveis de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para obter os headers de autenticação
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        // Lidar com o caso de token ausente, talvez lançando um erro
        // ou redirecionando, dependendo da sua estratégia de erro.
        throw new Error("Token de autenticação não encontrado.");
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

/**
 * Realiza o registro de um novo cliente.
 * @param data - Dados do cliente para registro.
 * @returns A resposta da API.
 */
export async function registerCliente(data: RegistroClienteData) {
  const response = await fetch(`${API_URL}/api/auth/cliente/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao registrar cliente");
  }

  return response.json();
}

/**
 * Realiza o login de um cliente.
 * @param data - Credenciais de login.
 * @returns A resposta da API contendo o token.
 */
export async function loginCliente(data: LoginClienteData) {
  const response = await fetch(`${API_URL}/api/auth/cliente/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Email ou senha incorretos");
  }

  return response.json();
}

/**
 * Busca o histórico de agendamentos do cliente autenticado.
 */
export async function getAgendamentosHistorico() {
    const response = await fetch(`${API_URL}/api/clientes/meus-agendamentos/historico`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar histórico de agendamentos.");
    }

    return response.json();
}

/**
 * Atualiza o perfil do cliente autenticado.
 * @param data - Dados a serem atualizados.
 */
export async function updateMeuPerfil(data: UpdateProfileData) {
    const response = await fetch(`${API_URL}/api/clientes/meu-perfil`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar perfil.");
    }

    return response.json();
}

export interface Barbearia {
    id: number;
    nome: string;
    nomeFantasia: string;
    endereco: string;
    telefone: string;
    email: string;
    avaliacaoMedia: number;
}

// Dados para serviço
export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  barbeariaId: number;
  ativo: boolean;
  tipoServico: 'CORTE' | 'BARBA' | 'MANICURE' | 'SOBRANCELHA' | 'COLORACAO' | 'TRATAMENTO_CAPILAR';
}

/**
 * Busca a lista de todas as barbearias ativas.
 */
export async function getBarbearias(): Promise<Barbearia[]> {
    const response = await fetch(`${API_URL}/api/barbearias`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar a lista de barbearias.');
    }

    return response.json();
}

/**
 * Busca a lista de serviços ativos de uma barbearia específica.
 * @param id - ID da barbearia.
 * @returns A lista de serviços.
 */
export async function getServicosBarbearia(id: number): Promise<Servico[]> {
    const response = await fetch(`${API_URL}/api/barbearias/${id}/servicos`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar a lista de serviços.');
    }

    return response.json();
}


/**
 * Realiza o registro de uma nova barbearia.
 * @param data - Dados da barbearia para registro.
 * @returns A resposta da API.
 */
export async function registerBarbearia(data: RegistroBarbeariaData) {
    const response = await fetch(`${API_URL}/api/auth/barbearia/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar barbearia');
    }

    return response.json();
}

/**
 * Realiza o login de uma barbearia.
 * @param data - Credenciais de login.
 * @returns A resposta da API contendo o token.
 */
export async function loginBarbearia(data: LoginBarbeariaData) {
    const response = await fetch(`${API_URL}/api/auth/barbearia/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email ou senha incorretos');
    }

    return response.json();
}
