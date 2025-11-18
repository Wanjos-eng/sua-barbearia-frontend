'use client';
// Importando icons 
import React from 'react';
import {
    Scissors,
    Calendar,
    Clock,
    User,
    Star,
    Phone,
    Info,
    X,
    Check,
    CheckCircle,
    Loader2,
    ChevronLeft,
    Edit,
    LogOut,
    Mail,
    Lock,
    RefreshCw
} from 'lucide-react';

// --- INTERFACES ---

interface Appointment {
  id: string;
  barberShopName: string;
  service: string;
  price: string;
  date: string;
  time: string;
  barberName: string;
  status: 'pending' | 'confirmed';
}

interface BarberShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  initial: string; // Para o avatar circular
}

interface Service {
  id: string;
  name: string;
  price: string;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
  avatarUrl: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

// --- MOCK DATA ---

const MOCK_BARBER_SHOPS: BarberShop[] = [
  { id: 'b1', name: 'Barbearia 1', address: 'Rua das Flores, 123', phone: '(11) 98888-7777', rating: 4.9, initial: 'A' },
  { id: 'b2', name: 'Barbearia 2', address: 'Av. Principal, 456', phone: '(11) 99999-8888', rating: 4.8, initial: 'B' },
  { id: 'b3', name: 'Barbearia 3', address: 'Beco da Barba, 007', phone: '(11) 97777-6666', rating: 4.7, initial: 'C' },
  { id: 'b4', name: 'Barbearia 4', address: 'Praça Central, 10', phone: '(11) 96666-5555', rating: 4.9, initial: 'D' },
];

const MOCK_UPCOMING: Appointment[] = [
  { id: 'a1', barberShopName: 'Barbearia 1', service: 'Corte', price: 'R$50,00', date: '20/11', time: '10:00', barberName: 'Roberto', status: 'pending' },
  { id: 'a2', barberShopName: 'Barbearia 2', service: 'Corte', price: 'R$50,00', date: '20/11', time: '11:00', barberName: 'Miguel', status: 'confirmed' },
];

const MOCK_HISTORY: Appointment[] = [
  { id: 'h1', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
  { id: 'h2', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
  { id: 'h3', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
  { id: 'h4', barberShopName: 'Barbearia 1', service: 'Corte e Barba', price: 'R$90,00', date: '15/11', time: '10:00', barberName: 'Roberto', status: 'confirmed' },
];

const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Corte Degradê', price: 'R$ 50,00', duration: 45 },
  { id: 's2', name: 'Barba Terapia', price: 'R$ 40,00', duration: 30 },
];

const MOCK_BARBERS: Barber[] = [
  { id: 'bar1', name: 'Roberto', avatarUrl: 'https://placehold.co/100x100/d97757/18181b?text=R' },
  { id: 'bar2', name: 'Miguel', avatarUrl: 'https://placehold.co/100x100/d97757/18181b?text=M' },
];

// --- COMPONENTES ---

const SectionHeader: React.FC<{ icon: React.ReactNode, title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="text-white">{icon}</div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
  </div>
);

// --- TOAST NOTIFICATION ---
const Toast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 md:top-24 md:right-6 md:bottom-auto z-[60] animate-slide-in">
    <div className="bg-[#18181b] border border-[#d97757] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px]">
        <div className="bg-[#d97757]/20 p-2 rounded-full">
            <CheckCircle className="w-6 h-6 text-[#d97757]" />
        </div>
        <div className="flex flex-col flex-1">
            <span className="font-bold text-sm text-[#d97757]">Sucesso</span>
            <span className="font-medium text-sm text-zinc-200">{message}</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
        </button>
    </div>
  </div>
);

const BarberShopCard: React.FC<{ shop: BarberShop, onClick: () => void }> = ({ shop, onClick }) => (
  <div className="bg-[#18181b] rounded-xl p-6 flex flex-col items-center text-center relative group transition-all hover:bg-[#202024] border border-transparent hover:border-white/5">
    <div className="w-16 h-16 rounded-full bg-[#4a4a4d] flex items-center justify-center mb-4 text-2xl font-bold text-white/80">
      {shop.initial}
    </div>
    
    <h3 className="text-xl font-bold text-white mb-1">{shop.name}</h3>
    
    <div className="flex items-center gap-2 text-sm text-[#d97757] mb-1">
      <Star className="w-3 h-3 fill-current" />
      <span>{shop.rating}</span>
    </div>
    
    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
      <Phone className="w-3 h-3" />
      <span>{shop.phone}</span>
    </div>

    <div className="flex items-center gap-3 w-full justify-center">
      <button 
        onClick={onClick}
        className="bg-[#d97757] hover:bg-[#c0684b] text-white/90 font-medium text-sm py-2 px-6 rounded-lg transition-colors"
      >
        Agendar
      </button>
      <button className="text-zinc-500 hover:text-white transition-colors">
        <Info className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const AppointmentRow: React.FC<{ app: Appointment }> = ({ app }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-white/5 last:border-0 gap-4 md:gap-0">
    <div className="text-3xl font-bold text-white w-24">
      {app.time}
    </div>
    <div className="flex flex-col w-48">
      <span className="text-white font-bold text-lg">{app.barberShopName}</span>
      <span className="text-zinc-500 text-sm">Com {app.barberName}</span>
    </div>
    <div className="flex flex-col w-32">
      <span className="text-white font-medium">{app.service}</span>
      <span className="text-zinc-500 text-sm">{app.price}</span>
    </div>
    <div className="flex items-center gap-2 w-32">
      {app.status === 'pending' ? (
        <>
          <Loader2 className="w-4 h-4 text-zinc-600 animate-spin" />
          <span className="text-zinc-500 text-sm">Pendente</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4 text-[#d97757]" />
          <span className="text-[#d97757] text-sm">Confirmado</span>
        </>
      )}
    </div>
    <div className="flex flex-col gap-2 w-32">
        {app.status === 'pending' ? (
             <button className="flex items-center justify-center gap-2 bg-[#d97757]/20 hover:bg-[#d97757]/30 text-[#d97757] text-xs py-1.5 px-3 rounded transition-colors">
                <X className="w-3 h-3" /> Cancelar
             </button>
        ) : (
             <span className="text-xs text-zinc-600 text-center"></span>
        )}
       
        <button className="flex items-center justify-center gap-2 bg-[#e4e4e7] hover:bg-white text-zinc-900 text-xs py-1.5 px-3 rounded font-medium transition-colors">
          <RefreshCw className="w-3 h-3" /> Reagendar
        </button>
    </div>
  </div>
);

const HistoryCard: React.FC<{ app: Appointment }> = ({ app }) => (
  <div className="bg-[#18181b] rounded-lg p-4 mb-3 flex items-center justify-between hover:bg-[#202024] transition-colors group cursor-pointer">
    <div>
      <h4 className="text-[#d97757] font-bold text-sm mb-0.5 group-hover:underline">{app.barberShopName}</h4>
      <p className="text-zinc-400 text-xs mb-1">{app.service}</p>
      <p className="text-white text-xs font-medium">{app.date} - {app.time}</p>
    </div>
  </div>
);

// --- MODAL DE PERFIL DO USUÁRIO ---

const ProfileModal: React.FC<{ 
  user: UserProfile, 
  onClose: () => void, 
  onSave: (updatedUser: UserProfile) => void 
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword || passwords.confirmPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("As senhas não conferem.");
            return;
        }
        // Lógica de salvar senha aqui
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#18181b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-custom" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#18181b] z-10">
           <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#d97757]" />
              <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
           </div>
           <button onClick={onClose} className="text-zinc-500 hover:text-white">
               <X className="w-5 h-5" />
           </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm border-b border-white/5 pb-2">Dados Pessoais</h4>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nome Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">E-mail</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Telefone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Segurança */}
            <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm border-b border-white/5 pb-2">Segurança</h4>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nova Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="password" 
                            placeholder="Preencha para alterar"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirmar Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="password" 
                            placeholder="Confirme a nova senha"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50"
                        />
                    </div>
                </div>
            </div>
            
            <div className="pt-2">
                <button 
                    type="submit"
                    className="w-full bg-[#d97757] hover:bg-[#c0684b] text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Salvar Alterações
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};