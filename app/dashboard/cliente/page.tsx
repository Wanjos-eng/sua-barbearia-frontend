'use client';
// Importando icons 
import React, { useState, useEffect, useRef } from 'react';
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

// --- MODAL DE AGENDAMENTO ---

const ScheduleModal: React.FC<{ shop: BarberShop, onClose: () => void, onConfirm: () => void }> = ({ shop, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    
    const dates = Array.from({length: 5}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });
    const times = ["09:00", "10:00", "11:30", "14:00", "15:30", "18:00"];

    const handleBack = () => {
        if (step === 3) setStep(2);
        else if (step === 2) setStep(1);
    }

    const handleConfirmClick = () => {
        onConfirm(); 
        onClose(); 
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button onClick={handleBack} className="text-zinc-400 hover:text-white">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h3 className="text-xl font-bold text-white">{shop.name}</h3>
                            <p className="text-xs text-[#d97757]">Agendamento - Etapa {step}/3</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-custom">
                    {/* Step 1: Serviço */}
                    {step === 1 && (
                        <div className="space-y-3">
                            <h4 className="text-white mb-4 font-medium">Selecione o serviço</h4>
                            {MOCK_SERVICES.map(s => (
                                <button 
                                    key={s.id} 
                                    onClick={() => { setSelectedService(s); setStep(2); }}
                                    className="w-full flex justify-between items-center p-4 bg-[#202024] hover:bg-[#27272a] rounded-lg border border-transparent hover:border-[#d97757]/50 group transition-all"
                                >
                                    <div className="text-left">
                                        <p className="text-white font-medium">{s.name}</p>
                                        <p className="text-xs text-zinc-500">{s.duration} min</p>
                                    </div>
                                    <span className="text-[#d97757] font-bold">{s.price}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Barbeiro */}
                    {step === 2 && (
                        <div className="space-y-3">
                             <h4 className="text-white mb-4 font-medium">Selecione o profissional</h4>
                             {MOCK_BARBERS.map(b => (
                                 <button
                                    key={b.id}
                                    onClick={() => { setSelectedBarber(b); setStep(3); }}
                                    className="w-full flex items-center gap-4 p-4 bg-[#202024] hover:bg-[#27272a] rounded-lg border border-transparent hover:border-[#d97757]/50 transition-all"
                                 >
                                     <img src={b.avatarUrl} alt={b.name} className="w-12 h-12 rounded-full object-cover" />
                                     <span className="text-white font-bold text-lg">{b.name}</span>
                                 </button>
                             ))}
                        </div>
                    )}

                    {/* Step 3: Data/Hora */}
                    {step === 3 && (
                        <div>
                            <h4 className="text-white mb-4 font-medium">Data e Horário</h4>
                            
                            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                                {dates.map(d => {
                                    const isSelected = selectedDate?.toDateString() === d.toDateString();
                                    return (
                                        <button 
                                            key={d.toISOString()}
                                            onClick={() => setSelectedDate(d)}
                                            className={`min-w-[70px] h-20 rounded-lg flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-[#d97757] border-[#d97757] text-white' : 'bg-[#202024] border-transparent text-zinc-400 hover:border-zinc-600'}`}
                                        >
                                            <span className="text-xs uppercase font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                                            <span className="text-2xl font-bold">{d.getDate()}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {selectedDate && (
                                <div className="grid grid-cols-3 gap-3">
                                    {times.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`py-2 rounded-md text-sm font-medium transition-all ${selectedTime === t ? 'bg-white text-black' : 'bg-[#202024] text-zinc-300 hover:bg-[#2a2a2e]'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 3 && selectedTime && (
                    <div className="p-4 border-t border-white/5 bg-[#121214]">
                        <button 
                            onClick={handleConfirmClick}
                            className="w-full bg-[#d97757] hover:bg-[#c0684b] text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Confirmar Agendamento
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- APP PRINCIPAL ---

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Estado do Usuário
  const [user, setUser] = useState<UserProfile>({
    name: "Arthur",
    email: "arthur@exemplo.com",
    phone: "(11) 99999-9999"
  });

  // Estados para o Menu de Usuário
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBookingSuccess = () => {
      setNotification("Agendamento Realizado!");
      setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveProfile = (updatedUser: UserProfile) => {
      setUser(updatedUser);
      setNotification("Perfil atualizado com sucesso!");
      setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = () => {
      // Lógica de logout simulada
      if(confirm("Deseja realmente sair da conta?")) {
        alert("Saindo...");
        // Aqui você redirecionaria para o login
      }
      setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-zinc-100 selection:bg-[#d97757] selection:text-white">
      {/* Estilos Personalizados */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .scrollbar-custom::-webkit-scrollbar {
            width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
            background: #18181b;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
            background: #3f3f46;
            border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: #52525b;
        }
        @keyframes slideIn {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in {
            animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* --- NOTIFICAÇÃO (Toast) --- */}
      {notification && <Toast message={notification} onClose={() => setNotification(null)} />}

      {/* Header */}
      <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between bg-[#09090b] relative z-40">
        <div className="flex items-center gap-3">
          <Scissors className="w-8 h-8 text-[#d97757]" />
          <div className="flex flex-col leading-tight">
             <span className="text-[#d97757] font-bold text-xl tracking-tight">Sua</span>
             <span className="text-[#d97757] font-bold text-xl tracking-tight -mt-1">Barbearia</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative" ref={menuRef}>
            <span className="font-medium hidden md:inline text-white">Olá, {user.name}</span>
            
            {/* Botão do Avatar */}
            <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-[#202024] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d97757]"
            >
                <User className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        <button 
                            onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-[#202024] hover:text-white flex items-center gap-3 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Editar Perfil
                        </button>
                        <div className="h-px bg-white/5 mx-2"></div>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#202024] hover:text-red-300 flex items-center gap-3 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </div>
                </div>
            )}
        </div>
      </header>

      <main className="px-6 md:px-12 pb-12">
        
        {/* Seção Barbearias */}
        <section className="mb-12">
          <SectionHeader icon={<Scissors className="w-6 h-6 text-[#d97757]" />} title="Barbearias" />
          
          {/* Barra de Busca Estilo Banner */}
          <div className="bg-[#121214] p-2 rounded-lg flex flex-col md:flex-row gap-2 mb-8 max-w-full">
            <button className="bg-[#d97757] hover:bg-[#c0684b] text-white font-medium px-6 py-3 rounded-md transition-colors whitespace-nowrap">
                Buscar Barbearia
            </button>
            <input 
                type="text" 
                placeholder="Buscar barbearia pelo nome..." 
                className="bg-transparent w-full px-4 text-white placeholder-zinc-600 focus:outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_BARBER_SHOPS.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(shop => (
                <BarberShopCard key={shop.id} shop={shop} onClick={() => setSelectedShop(shop)} />
            ))}
          </div>
        </section>

        {/* Grid Principal: Agendamentos e Histórico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna da Esquerda (2/3) - Próximos Agendamentos */}
            <div className="lg:col-span-2 bg-[#121214] rounded-2xl p-6 md:p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                         <div className="w-1 h-8 bg-[#d97757] rounded-full mr-2"></div>
                         <h2 className="text-2xl font-bold text-white">Próximos Agendamentos</h2>
                    </div>
                    <Scissors className="w-6 h-6 text-zinc-600 opacity-50" />
                </div>

                {/* Grupo de Data */}
                <div className="mb-2">
                     <div className="flex items-center gap-2 text-zinc-400 mb-4">
                        <Calendar className="w-5 h-5" />
                        <span className="text-lg">Dia 20/11 - Quinta-Feira</span>
                     </div>
                     <div className="w-full h-px bg-white/10 mb-4"></div>
                </div>

                {/* Lista de Agendamentos */}
                <div className="space-y-1">
                    {MOCK_UPCOMING.map(app => (
                        <AppointmentRow key={app.id} app={app} />
                    ))}
                </div>
                
                <div className="mt-12 text-center text-zinc-600 text-sm">
                    {MOCK_UPCOMING.length === 0 && "Nenhum agendamento futuro."}
                </div>
            </div>

            {/* Coluna da Direita (1/3) - Histórico */}
            <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">Histórico</h2>
                </div>
                
                <div className="bg-[#121214] rounded-2xl p-4 border border-white/5 min-h-[400px]">
                    {MOCK_HISTORY.map(app => (
                        <HistoryCard key={app.id} app={app} />
                    ))}
                    <button className="w-full text-center text-zinc-500 text-sm mt-4 hover:text-[#d97757] transition-colors">
                        Ver todo o histórico
                    </button>
                </div>
            </div>

        </div>
      </main>

      {/* Modal de Agendamento */}
      {selectedShop && (
          <ScheduleModal 
            shop={selectedShop} 
            onClose={() => setSelectedShop(null)} 
            onConfirm={handleBookingSuccess} 
          />
      )}

      {/* Modal de Edição de Perfil */}
      {showProfileModal && (
          <ProfileModal 
            user={user}
            onClose={() => setShowProfileModal(false)}
            onSave={handleSaveProfile}
          />
      )}

    </div>
  );
}