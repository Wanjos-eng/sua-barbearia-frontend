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
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { barberShopService } from '@/services/barberShopService';
import { clientService } from '@/services/clientService';
import { appointmentService } from '@/services/appointmentService';
import { BarberShop, AvailableSlot, Service, Professional } from '@/types/api';

// --- INTERFACES ---

interface UIAppointment {
  id: string;
  barberShopName: string;
  service: string;
  price: string;
  date: string;
  time: string;
  barberName: string;
  status: string;
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
  { id: 1, nome: 'Barbearia 1', nomeFantasia: 'Barbearia 1', endereco: 'Rua das Flores, 123', telefone: '(11) 98888-7777', email: 'b1@email.com', avaliacaoMedia: 4.9 },
  { id: 2, nome: 'Barbearia 2', nomeFantasia: 'Barbearia 2', endereco: 'Av. Principal, 456', telefone: '(11) 99999-8888', email: 'b2@email.com', avaliacaoMedia: 4.8 },
  { id: 3, nome: 'Barbearia 3', nomeFantasia: 'Barbearia 3', endereco: 'Beco da Barba, 007', telefone: '(11) 97777-6666', email: 'b3@email.com', avaliacaoMedia: 4.7 },
  { id: 4, nome: 'Barbearia 4', nomeFantasia: 'Barbearia 4', endereco: 'Praça Central, 10', telefone: '(11) 96666-5555', email: 'b4@email.com', avaliacaoMedia: 4.9 },
];

const MOCK_UPCOMING: UIAppointment[] = [
  { id: 'a1', barberShopName: 'Barbearia 1', service: 'Corte', price: 'R$50,00', date: '20/11', time: '10:00', barberName: 'Roberto', status: 'pending' },
  { id: 'a2', barberShopName: 'Barbearia 2', service: 'Corte', price: 'R$50,00', date: '20/11', time: '11:00', barberName: 'Miguel', status: 'confirmed' },
];

const MOCK_SERVICES: Service[] = [
  { id: 1, nome: 'Corte Degradê', preco: 50.00, duracao: 45, descricao: 'Corte moderno', barbeariaId: 1, ativo: true, tipoServico: 'CORTE' },
  { id: 2, nome: 'Barba Terapia', preco: 40.00, duracao: 30, descricao: 'Tratamento completo', barbeariaId: 1, ativo: true, tipoServico: 'BARBA' },
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
      {shop.nome.charAt(0).toUpperCase()}
    </div>

    <h3 className="text-xl font-bold text-white mb-1">{shop.nomeFantasia}</h3>

    <div className="flex items-center gap-2 text-sm text-[#d97757] mb-1">
      <Star className="w-3 h-3 fill-current" />
      <span>{shop.avaliacaoMedia}</span>
    </div>

    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
      <Phone className="w-3 h-3" />
      <span>{shop.telefone}</span>
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

const AppointmentRow: React.FC<{ app: UIAppointment }> = ({ app }) => (
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

const HistoryCard: React.FC<{ app: UIAppointment }> = ({ app }) => (
  <div className="bg-[#18181b] rounded-lg p-4 mb-3 flex items-center justify-between hover:bg-[#202024] transition-colors group cursor-pointer">
    <div>
      <h4 className="text-[#d97757] font-bold text-sm mb-0.5 group-hover:underline">{app.barberShopName}</h4>
      <p className="text-zinc-400 text-xs mb-1">{app.service}</p>
      <p className="text-white text-xs font-medium">{app.date} - {app.time}</p>
    </div>
  </div>
);

// --- MODAL DE PERFIL DO USUÁRIO ---

const ProfileModal: React.FC<{ user: UserProfile, onClose: () => void, onSave: (user: UserProfile) => void }> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedUser = await clientService.updateProfile({
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone
      });

      onSave({
        name: updatedUser.nome,
        email: updatedUser.email,
        phone: updatedUser.telefone || ''
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#18181b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm border-b border-white/5 pb-2">Dados Pessoais</h4>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d97757] hover:bg-[#c0684b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar Alterações'}
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
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [notes, setNotes] = useState('');

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [datesWithAvailability, setDatesWithAvailability] = useState<Set<string>>(new Set());
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [workingHours, setWorkingHours] = useState<import('@/types/api').WorkingHours[]>([]);
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [error, setError] = useState('');

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const data = await barberShopService.listServices(shop.id);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [shop.id]);

  // Fetch professionals when service is selected
  useEffect(() => {
    if (selectedService) {
      const fetchProfessionals = async () => {
        try {
          setLoadingProfessionals(true);
          const data = await barberShopService.listProfessionals(selectedService.id, shop.id);
          setProfessionals(data);
        } catch (error) {
          console.error("Error fetching professionals:", error);
          setProfessionals([]);
        } finally {
          setLoadingProfessionals(false);
        }
      };
      fetchProfessionals();
    }
  }, [selectedService, shop.id]);

  // Fetch working hours when professional is selected
  useEffect(() => {
    if (selectedProfessional) {
      const fetchWorkingHours = async () => {
        try {
          const hours = await barberShopService.getProfessionalWorkingHours(selectedProfessional.id);
          setWorkingHours(hours);
        } catch (error) {
          console.error("Error fetching working hours:", error);
          setWorkingHours([]);
        }
      };
      fetchWorkingHours();
    }
  }, [selectedProfessional]);

  // Check availability for all dates when professional is selected
  useEffect(() => {
    if (selectedService && selectedProfessional && workingHours.length > 0) {
      const checkDatesAvailability = async () => {
        setCheckingAvailability(true);
        const availableDates = new Set<string>();

        const dates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          return d;
        });

        // Map JS day (0=Sun, 1=Mon... 6=Sat) to API day (assuming 1=Mon... 7=Sun or similar)
        // Let's verify the API response format from user request: "seg-dom"
        // Usually Java DayOfWeek: 1=Mon, 7=Sun.
        // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat.
        // Mapping: JS 0 -> 7, JS 1 -> 1, JS 2 -> 2 ...
        const getApiDay = (jsDay: number) => jsDay === 0 ? 7 : jsDay;

        // Check each date for availability based on working hours
        // Optimization: Instead of calling API for every date, we trust the working hours.
        // If the professional works on that day, we mark it as available.
        // Real availability (slots) will be checked when the user selects the date.
        dates.forEach((date) => {
          const apiDay = getApiDay(date.getDay());
          const worksOnDay = workingHours.some(wh => wh.diaSemana === apiDay && wh.ativo);

          if (worksOnDay) {
            availableDates.add(date.toDateString());
          }
        });

        setDatesWithAvailability(availableDates);
        setCheckingAvailability(false);
      };

      checkDatesAvailability();
    } else if (selectedService && selectedProfessional && workingHours.length === 0) {
      // If working hours fetch failed or empty, try checking all dates anyway (fallback)
      // Or maybe we are still loading working hours? 
      // Let's rely on the previous logic if workingHours is empty but we have a professional
      // Actually, let's wait for workingHours to be populated or confirmed empty.
      // For now, I'll leave the fallback to check all dates if workingHours is empty to be safe.
      const checkDatesAvailabilityFallback = async () => {
        setCheckingAvailability(true);
        const availableDates = new Set<string>();
        const dates = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() + i);
          return d;
        });

        // If no working hours (fallback), we assume all days might be available 
        // OR we try to fetch slots for each day (which was failing).
        // Let's try to be optimistic and show all days, or stick to the fetch but log better.
        // Given the 400 errors, let's try to fetch but handle failure gracefully.

        await Promise.all(
          dates.map(async (date) => {
            try {
              const dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
              // If selectedProfessional is present, use it.
              const slots = await barberShopService.getAvailableSlots(shop.id, selectedService.id, dateStr, selectedProfessional?.id);
              if (slots.length > 0) availableDates.add(date.toDateString());
            } catch (e) {
              console.error(`Fallback availability check failed for ${date}:`, e);
              // If it fails, we don't add it.
            }
          })
        );
        setDatesWithAvailability(availableDates);
        setCheckingAvailability(false);
      };
      checkDatesAvailabilityFallback();
    }
  }, [selectedService, selectedProfessional, shop.id, workingHours]);

  // Fetch slots when date and service are selected
  useEffect(() => {
    if (selectedService && selectedDate && selectedProfessional) {
      const fetchSlots = async () => {
        try {
          setLoadingSlots(true);
          // Format date as YYYY-MM-DD manually to avoid timezone issues
          const dateStr = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');
          const slots = await barberShopService.getAvailableSlots(shop.id, selectedService.id, dateStr, selectedProfessional.id);
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Error fetching slots:", error);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedService, selectedDate, selectedProfessional, shop.id]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleBack = () => {
    if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleConfirmClick = async () => {
    if (!selectedService || !selectedSlot || !selectedDate) {
      setError('Dados do agendamento incompletos');
      return;
    }

    try {
      setCreatingAppointment(true);
      setError('');

      // Construct local date time string manually to avoid timezone shifts
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      // selectedSlot.horarioInicio is expected to be "HH:mm:ss" or "HH:mm"
      const timePart = selectedSlot.horarioInicio.slice(0, 5);

      const dataHora = `${year}-${month}-${day}T${timePart}:00`;

      await appointmentService.createAppointment({
        servicoId: selectedService.id,
        funcionarioId: selectedSlot.funcionarioId,
        barbeariaId: shop.id,
        dataHora: dataHora,
        observacoes: notes || undefined
      });

      onConfirm();
      onClose();
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Erro ao criar agendamento. Tente novamente.');
    } finally {
      setCreatingAppointment(false);
    }
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
              <h3 className="text-xl font-bold text-white">{shop.nomeFantasia}</h3>
              <p className="text-xs text-[#d97757]">Agendamento - Etapa {step}/4</p>
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
              {loadingServices ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[#d97757] animate-spin" />
                </div>
              ) : services.length > 0 ? (
                services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); setStep(2); }}
                    className="w-full flex justify-between items-center p-4 bg-[#202024] hover:bg-[#27272a] rounded-lg border border-transparent hover:border-[#d97757]/50 group transition-all"
                  >
                    <div className="text-left">
                      <p className="text-white font-medium">{s.nome}</p>
                      <p className="text-xs text-zinc-500">{s.duracao} min</p>
                    </div>
                    <span className="text-[#d97757] font-bold">R$ {s.preco.toFixed(2)}</span>
                  </button>
                ))
              ) : (
                <p className="text-zinc-500 text-center">Nenhum serviço disponível.</p>
              )}
            </div>
          )}

          {/* Step 2: Profissional */}
          {step === 2 && (
            <div className="space-y-3">
              <h4 className="text-white mb-4 font-medium">Selecione o Profissional</h4>
              {loadingProfessionals ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[#d97757] animate-spin" />
                </div>
              ) : professionals.length > 0 ? (
                professionals.map(prof => (
                  <button
                    key={prof.id}
                    onClick={() => { setSelectedProfessional(prof); setStep(3); }}
                    className="w-full flex items-center gap-4 p-4 bg-[#202024] hover:bg-[#27272a] rounded-lg border border-transparent hover:border-[#d97757]/50 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#d97757]/20 flex items-center justify-center text-[#d97757] font-bold text-lg">
                      {prof.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-medium">{prof.nome}</p>
                      <p className="text-xs text-zinc-500">{prof.profissao || prof.perfilType}</p>
                      {prof.especialidades && (
                        <p className="text-xs text-[#d97757] mt-1">{prof.especialidades}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
                    <User className="w-12 h-12 text-zinc-600" />
                  </div>
                  <h5 className="text-white font-semibold text-lg mb-2">Nenhum profissional disponível</h5>
                  <p className="text-zinc-400 text-sm max-w-xs">
                    Não há profissionais disponíveis para este serviço no momento.
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-6 bg-[#d97757]/20 hover:bg-[#d97757]/30 text-[#d97757] font-medium text-sm py-2 px-6 rounded-lg transition-colors"
                  >
                    Voltar aos Serviços
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Data */}
          {step === 3 && (
            <div>
              <h4 className="text-white mb-4 font-medium">Selecione a Data</h4>

              {checkingAvailability ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#d97757] animate-spin mb-3" />
                  <p className="text-zinc-400 text-sm">Verificando disponibilidade...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {dates.map(d => {
                    const isSelected = selectedDate?.toDateString() === d.toDateString();
                    const isAvailable = datesWithAvailability.has(d.toDateString());

                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedDate(d);
                            setStep(4);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`h-20 rounded-lg flex flex-col items-center justify-center border transition-all ${isSelected
                          ? 'bg-[#d97757] border-[#d97757] text-white'
                          : isAvailable
                            ? 'bg-[#202024] border-[#d97757]/30 text-white hover:border-[#d97757] hover:bg-[#d97757]/10'
                            : 'bg-[#18181b] border-transparent text-zinc-700 cursor-not-allowed opacity-50'
                          }`}
                      >
                        <span className={`text-xs uppercase font-bold ${isAvailable ? 'text-[#d97757]' : 'text-zinc-700'}`}>
                          {d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                        </span>
                        <span className="text-2xl font-bold">{d.getDate()}</span>
                        {isAvailable && !isSelected && (
                          <span className="text-[10px] text-[#d97757] mt-0.5">Disponível</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {!checkingAvailability && datesWithAvailability.size === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center mt-4">
                  <div className="bg-zinc-800/50 p-4 rounded-full mb-3">
                    <Calendar className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h5 className="text-white font-semibold mb-2">Nenhuma data disponível</h5>
                  <p className="text-zinc-400 text-sm max-w-xs">
                    Não há horários disponíveis nos próximos 7 dias para este profissional.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 bg-[#d97757]/20 hover:bg-[#d97757]/30 text-[#d97757] font-medium text-sm py-2 px-6 rounded-lg transition-colors"
                  >
                    Voltar aos Profissionais
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Horário */}
          {step === 4 && (
            <div>
              <h4 className="text-white mb-4 font-medium">Horários Disponíveis ({selectedDate?.toLocaleDateString('pt-BR')})</h4>

              {loadingSlots ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[#d97757] animate-spin" />
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={`${slot.funcionarioId}-${slot.horarioInicio}-${idx}`}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-lg border text-left transition-all ${selectedSlot === slot ? 'bg-[#d97757] border-[#d97757] text-white' : 'bg-[#202024] border-white/5 text-zinc-300 hover:border-zinc-600'}`}
                    >
                      <div className="font-bold text-lg">{slot.horarioInicio.slice(0, 5)}</div>
                      <div className="text-xs opacity-80">{slot.funcionarioNome}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <p>Nenhum horário disponível para esta data.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 4 && selectedSlot && (
          <div className="p-4 border-t border-white/5 bg-[#121214] space-y-3">
            {/* Observações (opcional) */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Observações (Opcional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Preferência: barba com navalha"
                className="w-full bg-[#202024] border border-white/5 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none focus:border-[#d97757]/50 focus:ring-1 focus:ring-[#d97757]/50 resize-none"
                rows={2}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmClick}
              disabled={creatingAppointment}
              className="w-full bg-[#d97757] hover:bg-[#c0684b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {creatingAppointment && <Loader2 className="w-4 h-4 animate-spin" />}
              {creatingAppointment ? 'Criando Agendamento...' : 'Confirmar Agendamento'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- APP PRINCIPAL ---

import { authService } from '@/services/authService';

// ... (imports remain)

// ... (interfaces remain)

// --- APP PRINCIPAL ---

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [barberShops, setBarberShops] = useState<BarberShop[]>([]);
  const [loadingBarberShops, setLoadingBarberShops] = useState(true);
  const [history, setHistory] = useState<UIAppointment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Estado do Usuário
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    phone: ""
  });

  // Estados para o Menu de Usuário
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Carregar dados do usuário logado
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser({
        name: currentUser.nome,
        email: currentUser.email,
        phone: currentUser.telefone || ''
      });
    }

    const fetchBarberShops = async () => {
      try {
        setLoadingBarberShops(true);
        const shops = await barberShopService.listBarberShops();
        setBarberShops(shops);
      } catch (error) {
        console.error("Failed to fetch barber shops", error);
      } finally {
        setLoadingBarberShops(false);
      }
    };

    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const historyData = await clientService.getHistory();
        console.log('History Data:', historyData);
        const formattedHistory: UIAppointment[] = historyData.map(item => {
          const dateObj = new Date(item.dataHora);
          return {
            id: item.id.toString(),
            barberShopName: item.nomeBarbearia,
            service: item.nomeServico,
            price: "R$ -", // API doesn't return price yet
            date: dateObj.toLocaleDateString('pt-BR'),
            time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            barberName: item.nomeBarbeiro || 'Não informado',
            status: item.status
          };
        });
        setHistory(formattedHistory);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchBarberShops();
    fetchHistory();
  }, []);

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

    // Update local storage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const newUser = { ...currentUser, nome: updatedUser.name, email: updatedUser.email, telefone: updatedUser.phone };
      authService.updateCurrentUser(newUser);
    }

    setNotification("Perfil atualizado com sucesso!");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = () => {
    // Lógica de logout simulada
    if (confirm("Deseja realmente sair da conta?")) {
      authService.logout();
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
          {/* Grid de Cards */}
          {loadingBarberShops ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-[#d97757] animate-spin mb-4" />
              <p className="text-zinc-500 text-sm">Carregando barbearias...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {barberShops.filter(s => s.nomeFantasia.toLowerCase().includes(search.toLowerCase())).map(shop => (
                <BarberShopCard key={shop.id} shop={shop} onClick={() => setSelectedShop(shop)} />
              ))}
            </div>
          )}
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

            <div className="bg-[#121214] rounded-2xl p-4 border border-white/5 min-h-[400px] flex flex-col">
              {loadingHistory ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#d97757] animate-spin mb-2" />
                  <p className="text-zinc-500 text-xs">Carregando histórico...</p>
                </div>
              ) : history.length > 0 ? (
                <>
                  {history.map(app => (
                    <HistoryCard key={app.id} app={app} />
                  ))}
                  <button className="w-full text-center text-zinc-500 text-sm mt-4 hover:text-[#d97757] transition-colors mt-auto">
                    Ver todo o histórico
                  </button>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="bg-white/5 p-4 rounded-full mb-3">
                    <Calendar className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 font-medium mb-1">Nenhum agendamento</p>
                  <p className="text-zinc-600 text-xs max-w-[200px]">Seus agendamentos concluídos aparecerão aqui.</p>
                </div>
              )}
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