'use client';
// Importando icons 
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ChevronRight,
  Edit,
  LogOut,
  Mail,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { barberShopService } from '@/services/barberShopService';
import { clientService } from '@/services/clientService';
import { appointmentService } from '@/services/appointmentService';
import { avaliacaoService } from '@/services/avaliacaoService';
import { BarberShop, AvailableSlot, Service, Professional, Review } from '@/types/api';

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
  barbeariaId?: number;
  hasReview?: boolean; // Whether this appointment has been reviewed
}







interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

// --- MOCK DATA ---



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

// --- REVIEWS MODAL ---
const ReviewsModal: React.FC<{ barberShop: BarberShop, onClose: () => void }> = ({ barberShop, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await barberShopService.getReviews(barberShop.id);
        setReviews(data);
      } catch (error: any) {
        console.error('Error fetching reviews:', error?.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [barberShop.id]);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${rating >= star ? 'text-yellow-500 fill-current' : 'text-zinc-600'
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-[#18181b] rounded-xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#18181b] border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Avaliações</h3>
            <p className="text-sm text-zinc-400">{barberShop.nomeFantasia}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#d97757] animate-spin mb-2" />
              <p className="text-zinc-500 text-sm">Carregando avaliações...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#27272a] rounded-lg p-4 border border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white">{review.clienteNome}</h4>
                      <p className="text-xs text-zinc-500">
                        {new Date(review.dataCriacao).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.notaGeral)}
                      <span className="text-sm font-bold text-yellow-500">{review.notaGeral.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Serviço:</span>
                      {renderStars(review.notaServico)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Atendimento:</span>
                      {renderStars(review.notaAtendimento)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Ambiente:</span>
                      {renderStars(review.notaAmbiente)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Limpeza:</span>
                      {renderStars(review.notaLimpeza)}
                    </div>
                  </div>

                  {review.comentario && (
                    <p className="text-sm text-zinc-300 italic border-l-2 border-[#d97757] pl-3">
                      "{review.comentario}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-white/5 p-4 rounded-full mb-3">
                <Star className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-medium mb-1">Nenhuma avaliação ainda</p>
              <p className="text-zinc-600 text-xs max-w-xs">Esta barbearia ainda não possui avaliações.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BarberShopCard: React.FC<{ shop: BarberShop, onClick: () => void, onRatingClick: () => void }> = ({ shop, onClick, onRatingClick }) => (
  <div className="bg-[#18181b] rounded-xl p-6 flex flex-col items-center text-center relative group transition-all hover:bg-[#202024] border border-transparent hover:border-white/5">
    <div className="w-16 h-16 rounded-full bg-[#4a4a4d] flex items-center justify-center mb-4 text-2xl font-bold text-white/80">
      {shop.nome.charAt(0).toUpperCase()}
    </div>

    <h3 className="text-xl font-bold text-white mb-1">{shop.nomeFantasia}</h3>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onRatingClick();
      }}
      className="flex items-center gap-2 text-sm text-[#d97757] mb-1 hover:text-[#e0886a] transition-colors cursor-pointer"
    >
      <Star className="w-3 h-3 fill-current" />
      <span>{shop.avaliacaoMedia !== undefined && shop.avaliacaoMedia !== null ? shop.avaliacaoMedia.toFixed(1) : 'Sem avaliações'}</span>
    </button>

    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
      <Phone className="w-3 h-3" />
      <span>{shop.telefone}</span>
    </div>

    <div className="flex items-center gap-3 w-full justify-center">
      <button
        onClick={onClick}
        className="w-full py-2 bg-[#d97757] hover:bg-[#e0886a] text-white rounded-lg text-sm font-medium transition-colors"
      >
        Ver Serviços
      </button>
    </div>
  </div>
);

// --- REVIEW MODAL ---
const ReviewModal: React.FC<{ appointment: UIAppointment, onClose: () => void }> = ({ appointment, onClose }) => {
  const [ratings, setRatings] = useState({
    notaServico: 0,
    notaAmbiente: 0,
    notaLimpeza: 0,
    notaAtendimento: 0
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let barbeariaId = appointment.barbeariaId;
      if (!barbeariaId) {
        // Fetch details if barbeariaId is missing
        const details = await appointmentService.getAppointmentById(parseInt(appointment.id));
        barbeariaId = details.barbeariaId;
      }

      await clientService.createReview({
        barbeariaId: barbeariaId!,
        agendamentoId: parseInt(appointment.id),
        ...ratings,
        comentario: comment
      });
      onClose();
    } catch (error: any) {
      console.error('Error submitting review:', error?.response?.data || error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
      alert('Erro ao enviar avaliação: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (category: keyof typeof ratings, label: string) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRatings(prev => ({ ...prev, [category]: star }))}
              onMouseEnter={() => setHoverRating(star)}
              className={`p-1 transition-all duration-200 hover:scale-110 ${(hoverRating || ratings[category]) >= star ? 'text-yellow-500' : 'text-zinc-600'
                }`}
            >
              <Star
                className={`w-6 h-6 transition-all duration-200 ${(hoverRating || ratings[category]) >= star ? 'fill-current' : 'stroke-current'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#18181b] rounded-xl border border-white/10 max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Avaliar Serviço</h3>
        <p className="text-sm text-zinc-400 mb-6">
          Como foi sua experiência em {appointment.barberShopName}?
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {renderStars('notaServico', 'Serviço')}
            {renderStars('notaAtendimento', 'Atendimento')}
            {renderStars('notaAmbiente', 'Ambiente')}
            {renderStars('notaLimpeza', 'Limpeza')}
          </div>

          <div className="mt-4 mb-6">
            <label className="block text-sm font-medium text-zinc-400 mb-1">Comentário (Opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#27272a] border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#d97757] resize-none h-24"
              placeholder="Conte mais sobre sua experiência..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#d97757] hover:bg-[#e0886a] text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AppointmentRow: React.FC<{
  app: UIAppointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  loading?: boolean;
}> = ({ app, onCancel, onReschedule, loading }) => (
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
      {app.status === 'PENDENTE' || app.status === 'pending' ? (
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
      {(app.status === 'PENDENTE' || app.status === 'pending' || app.status === 'CONFIRMADO') && (
        <button
          onClick={() => onCancel(app.id)}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#d97757]/20 hover:bg-[#d97757]/30 text-[#d97757] text-xs py-1.5 px-3 rounded transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
          {loading ? 'Cancelando...' : 'Cancelar'}
        </button>
      )}

      <button
        onClick={() => onReschedule(app.id)}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-[#e4e4e7] hover:bg-white text-zinc-900 text-xs py-1.5 px-3 rounded font-medium transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
        {loading ? 'Processando...' : 'Reagendar'}
      </button>
    </div>
  </div>
);

const HistoryCard: React.FC<{ appointment: UIAppointment, onRate?: () => void }> = ({ appointment, onRate }) => (
  <div className="bg-[#18181b] rounded-xl p-4 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${appointment.status === 'CONCLUIDO' ? 'bg-green-500/10 text-green-500' :
        appointment.status === 'CANCELADO' ? 'bg-red-500/10 text-red-500' :
          'bg-blue-500/10 text-blue-500'
        }`}>
        {appointment.status === 'CONCLUIDO' ? <CheckCircle className="w-5 h-5" /> :
          appointment.status === 'CANCELADO' ? <X className="w-5 h-5" /> :
            <Calendar className="w-5 h-5" />
        }
      </div>
      <div>
        <h4 className="font-bold text-white">{appointment.service}</h4>
        <p className="text-sm text-zinc-400">{appointment.barberShopName} • {appointment.date}</p>
      </div>
    </div>

    {appointment.status === 'CONCLUIDO' && (
      appointment.hasReview ? (
        <div className="px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed">
          <Check className="w-4 h-4" />
          Já avaliado
        </div>
      ) : onRate && (
        <button
          onClick={onRate}
          className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Avaliar
        </button>
      )
    )}

    {appointment.status !== 'CONCLUIDO' && (
      <div className="text-right">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${appointment.status === 'CONCLUIDO' ? 'bg-green-500/10 text-green-500' :
          appointment.status === 'CANCELADO' ? 'bg-red-500/10 text-red-500' :
            'bg-blue-500/10 text-blue-500'
          }`}>
          {appointment.status}
        </span>
      </div>
    )}
  </div>
);

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
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Erro ao atualizar perfil');
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
  const [viewStartDate, setViewStartDate] = useState(new Date());
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


  // Fetch slots when date and service are selected
  useEffect(() => {
    if (selectedService && selectedDate && selectedProfessional) {
      const fetchSlots = async () => {
        try {
          setLoadingSlots(true);
          // Format date as YYYY-MM-DD
          const dateStr = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');

          const timeSlots = await clientService.getAvailableTimeSlots(
            shop.id,
            selectedService.id,
            dateStr,
            selectedProfessional.id
          );

          if (timeSlots.length > 0) {
            console.log('DEBUG API DATE FORMAT:', timeSlots[0].data, 'Type:', typeof timeSlots[0].data);
          } else {
            console.log('DEBUG API DATE: No slots found for', dateStr);
          }

          // Convert TimeSlot format to string format for UI
          // Use selectedProfessional.nome as fallback if API returns undefined
          const rawSlots = timeSlots.map(ts => {
            const formatTime = (time: string | import('@/types/api').TimeSlot | undefined) => {
              if (!time) return "00:00";
              if (typeof time === 'string') {
                return time.slice(0, 5); // "09:00:00" -> "09:00"
              }
              return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
            };

            const startStr = formatTime(ts.horarioInicio);
            let endStr = formatTime(ts.horarioFim);

            // If end time is missing or invalid (00:00), calculate it from start time + 30min
            if (!ts.horarioFim || endStr === "00:00") {
              const [h, m] = startStr.split(':').map(Number);
              const date = new Date();
              date.setHours(h, m + 30);
              endStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            }

            return {
              funcionarioId: ts.funcionarioId,
              funcionarioNome: ts.funcionarioNome || selectedProfessional.nome,
              perfilType: ts.profissao,
              data: ts.data,
              horarioInicio: startStr,
              horarioFim: endStr
            };
          });

          // Since we are passing servicoId to the API, it likely returns valid start times for that service.
          // The API response seems to include the calculated end time based on service duration (e.g. 10:00 to 10:50).
          // Therefore, we don't need to filter for consecutive slots manually on the frontend.
          // We just display the slots returned by the API.

          // Filter out past slots if the selected date is today
          const now = new Date();
          const isToday = selectedDate.getFullYear() === now.getFullYear() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getDate() === now.getDate();

          const filteredSlots = isToday
            ? rawSlots.filter(slot => {
              const [hours, minutes] = slot.horarioInicio.split(':').map(Number);
              const slotTime = new Date(selectedDate);
              slotTime.setHours(hours, minutes, 0, 0);
              return slotTime > now;
            })
            : rawSlots;

          setAvailableSlots(filteredSlots);

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

      // Parse time from slot
      const [hours, minutes] = selectedSlot.horarioInicio.split(':').map(Number);

      // Format as LocalDateTime (YYYY-MM-DDTHH:mm:ss)
      // Backend treats this as local Brazil time
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const h = String(hours).padStart(2, '0');
      const m = String(minutes).padStart(2, '0');
      const dataHora = `${year}-${month}-${day}T${h}:${m}:00`;

      console.log('Sending appointment data:', {
        servicoId: selectedService.id,
        funcionarioId: selectedSlot.funcionarioId,
        dataHora: dataHora,
        observacoes: notes || undefined
      });

      await appointmentService.createAppointment({
        servicoId: selectedService.id,
        funcionarioId: selectedSlot.funcionarioId,
        dataHora: dataHora,
        observacoes: notes || undefined
      });

      onConfirm();
      onClose();
    } catch (err: unknown) {
      console.error('Error creating appointment:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao criar agendamento. Tente novamente.');
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
            <div className="bg-[#202024] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium capitalize">
                  {viewStartDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newDate = new Date(viewStartDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      // Don't go back past current month
                      const today = new Date();
                      if (newDate.getMonth() < today.getMonth() && newDate.getFullYear() <= today.getFullYear()) {
                        setViewStartDate(new Date());
                      } else {
                        setViewStartDate(newDate);
                      }
                    }}
                    disabled={viewStartDate.getMonth() === new Date().getMonth() && viewStartDate.getFullYear() === new Date().getFullYear()}
                    className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const newDate = new Date(viewStartDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setViewStartDate(newDate);
                    }}
                    className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                  <div key={i} className="text-xs text-zinc-500 font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const year = viewStartDate.getFullYear();
                  const month = viewStartDate.getMonth();

                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);

                  const daysInMonth = lastDay.getDate();
                  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

                  const days = [];

                  // Empty slots for previous month
                  for (let i = 0; i < startDayOfWeek; i++) {
                    days.push(<div key={`empty-${i}`} className="h-10" />);
                  }

                  // Days of current month
                  for (let i = 1; i <= daysInMonth; i++) {
                    const date = new Date(year, month, i);
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isPast = date < new Date() && !isToday;

                    days.push(
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setStep(4);
                        }}
                        disabled={isPast}
                        className={`h-10 w-full aspect-square rounded-full flex items-center justify-center text-sm transition-all
                            ${isSelected
                            ? 'bg-[#d97757] text-white font-bold'
                            : isPast
                              ? 'text-zinc-600 cursor-not-allowed'
                              : 'text-zinc-300 hover:bg-[#d97757]/20 hover:text-[#d97757]'
                          }
                            ${isToday && !isSelected ? 'border border-[#d97757] text-[#d97757]' : ''}
                          `}
                      >
                        {i}
                      </button>
                    );
                  }

                  return days;
                })()}
              </div>
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

// --- MODAL DE REAGENDAMENTO ---

interface RescheduleModalProps {
  appointment: UIAppointment;
  onClose: () => void;
  onConfirm: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ appointment, onClose, onConfirm }) => {
  const [viewStartDate, setViewStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [error, setError] = useState('');

  // Fetch appointment details to get servicoId, funcionarioId, barbeariaId
  const [appointmentDetails, setAppointmentDetails] = useState<import('@/types/api').AppointmentResponse | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        const details = await appointmentService.getAppointmentById(parseInt(appointment.id));
        setAppointmentDetails(details);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError('Erro ao carregar detalhes do agendamento');
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [appointment.id]);

  // Fetch slots when date is selected
  useEffect(() => {
    if (selectedDate && appointmentDetails) {
      const fetchSlots = async () => {
        try {
          setLoadingSlots(true);
          const dateStr = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');

          const timeSlots = await clientService.getAvailableTimeSlots(
            appointmentDetails.barbeariaId,
            appointmentDetails.servicoId,
            dateStr,
            appointmentDetails.funcionarioId
          );

          const rawSlots = timeSlots.map(ts => {
            const formatTime = (time: string | import('@/types/api').TimeSlot | undefined) => {
              if (!time) return "00:00";
              if (typeof time === 'string') {
                return time.slice(0, 5);
              }
              return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
            };

            const startStr = formatTime(ts.horarioInicio);
            let endStr = formatTime(ts.horarioFim);

            if (!ts.horarioFim || endStr === "00:00") {
              const [h, m] = startStr.split(':').map(Number);
              const date = new Date();
              date.setHours(h, m + 30);
              endStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            }

            return {
              funcionarioId: ts.funcionarioId,
              funcionarioNome: ts.funcionarioNome || appointment.barberName,
              perfilType: ts.profissao,
              data: ts.data,
              horarioInicio: startStr,
              horarioFim: endStr
            };
          });

          // Filter out past slots if today
          const now = new Date();
          const isToday = selectedDate.getFullYear() === now.getFullYear() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getDate() === now.getDate();

          const filteredSlots = isToday
            ? rawSlots.filter(slot => {
              const [hours, minutes] = slot.horarioInicio.split(':').map(Number);
              const slotTime = new Date(selectedDate);
              slotTime.setHours(hours, minutes, 0, 0);
              return slotTime > now;
            })
            : rawSlots;

          setAvailableSlots(filteredSlots);
        } catch (error) {
          console.error("Error fetching slots:", error);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDate, appointmentDetails, appointment.barberName]);

  const handleConfirmReschedule = async () => {
    if (!selectedDate || !selectedSlot) {
      setError('Selecione uma nova data e horário');
      return;
    }

    try {
      setRescheduling(true);
      setError('');

      const [hours, minutes] = selectedSlot.horarioInicio.split(':').map(Number);

      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const h = String(hours).padStart(2, '0');
      const m = String(minutes).padStart(2, '0');
      const novaDataHora = `${year}-${month}-${day}T${h}:${m}:00`;

      await appointmentService.rescheduleAppointment(parseInt(appointment.id), {
        novaDataHora: novaDataHora
      });

      onConfirm();
      onClose();
    } catch (err: unknown) {
      console.error('Error rescheduling appointment:', err);
      const error = err as { message?: string };
      setError(error.message || 'Erro ao reagendar. Tente novamente.');
    } finally {
      setRescheduling(false);
    }
  };

  if (loadingDetails) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#18181b] p-8 rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 text-[#d97757] animate-spin mx-auto" />
          <p className="text-white mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Reagendar Agendamento</h3>
            <p className="text-xs text-zinc-500 mt-1">{appointment.service} • {appointment.barberShopName}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-custom">
          {/* Date Selection */}
          <div className="bg-[#202024] rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium capitalize">
                {viewStartDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newDate = new Date(viewStartDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    const today = new Date();
                    if (newDate.getMonth() < today.getMonth() && newDate.getFullYear() <= today.getFullYear()) {
                      setViewStartDate(new Date());
                    } else {
                      setViewStartDate(newDate);
                    }
                  }}
                  disabled={viewStartDate.getMonth() === new Date().getMonth() && viewStartDate.getFullYear() === new Date().getFullYear()}
                  className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    const newDate = new Date(viewStartDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setViewStartDate(newDate);
                  }}
                  className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-xs text-zinc-500 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const year = viewStartDate.getFullYear();
                const month = viewStartDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startDayOfWeek = firstDay.getDay();
                const days = [];

                for (let i = 0; i < startDayOfWeek; i++) {
                  days.push(<div key={`empty-${i}`} className="h-10" />);
                }

                for (let i = 1; i <= daysInMonth; i++) {
                  const date = new Date(year, month, i);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();
                  const isPast = date < new Date() && !isToday;

                  days.push(
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      disabled={isPast}
                      className={`h-10 w-full aspect-square rounded-full flex items-center justify-center text-sm transition-all
                        ${isSelected
                          ? 'bg-[#d97757] text-white font-bold'
                          : isPast
                            ? 'text-zinc-600 cursor-not-allowed'
                            : 'text-zinc-300 hover:bg-[#d97757]/20 hover:text-[#d97757]'
                        }
                        ${isToday && !isSelected ? 'border border-[#d97757] text-[#d97757]' : ''}
                      `}
                    >
                      {i}
                    </button>
                  );
                }

                return days;
              })()}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div>
              <h4 className="text-white mb-4 font-medium">Horários Disponíveis ({selectedDate.toLocaleDateString('pt-BR')})</h4>
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
        {selectedSlot && (
          <div className="p-4 border-t border-white/5 bg-[#121214] space-y-3">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleConfirmReschedule}
              disabled={rescheduling}
              className="w-full bg-[#d97757] hover:bg-[#c0684b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {rescheduling && <Loader2 className="w-4 h-4 animate-spin" />}
              {rescheduling ? 'Reagendando...' : 'Confirmar Reagendamento'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [upcomingAppointments, setUpcomingAppointments] = useState<UIAppointment[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);

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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<UIAppointment | null>(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedShopForReviews, setSelectedShopForReviews] = useState<BarberShop | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState<UIAppointment | null>(null);

  const handleRateClick = (appointment: UIAppointment) => {
    setSelectedAppointmentForReview(appointment);
    setShowReviewModal(true);
  };

  const handleViewReviews = (shop: BarberShop) => {
    setSelectedShopForReviews(shop);
    setShowReviewsModal(true);
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    try {
      setActionLoading(id);
      await appointmentService.cancelAppointment(parseInt(id));
      setNotification('Agendamento cancelado com sucesso!');

      // Refresh appointments
      fetchUpcomingAppointments();
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert(error.message || 'Erro ao cancelar agendamento');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRescheduleAppointment = (id: string) => {
    const appointment = upcomingAppointments.find(app => app.id === id);
    if (appointment) {
      setSelectedAppointmentForReschedule(appointment);
      setShowRescheduleModal(true);
    }
  };

  const handleRescheduleConfirm = () => {
    setNotification('Agendamento reagendado com sucesso!');
    fetchUpcomingAppointments();
  };

  const fetchHistory = useCallback(async () => {
    try {
      // Don't set loading on every poll to avoid flickering, only if history is empty
      if (history.length === 0) setLoadingHistory(true);

      const [historyData, recentCompletedData] = await Promise.all([
        clientService.getHistory(),
        clientService.getRecentAppointments('concluidos_recentes')
      ]);

      // Merge and deduplicate by ID
      const allHistoryItems = [...historyData];
      recentCompletedData.forEach(recent => {
        if (!allHistoryItems.some(h => h.id === recent.id)) {
          // Map RecentAppointment to Appointment structure if needed, or just use compatible fields
          allHistoryItems.push({
            id: recent.id,
            dataHora: recent.dataHora,
            status: recent.status,
            nomeBarbearia: recent.nomeBarbearia,
            nomeBarbeiro: recent.nomeBarbeiro,
            nomeServico: recent.nomeServico,
            observacoes: null // RecentAppointment doesn't have observations
          } as any);
        }
      });

      // Sort by date descending
      allHistoryItems.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

      // Enrich history items with real names
      const formattedHistory: UIAppointment[] = await Promise.all(allHistoryItems.map(async (item) => {
        let serviceName = item.nomeServico || `Serviço #${(item as any).servicoId}`;
        let shopName = item.nomeBarbearia || `Barbearia #${(item as any).barbeariaId}`;
        let professionalName = item.nomeBarbeiro || 'Não informado';
        let price = "R$ -";
        let barbeariaId = (item as any).barbeariaId;
        let hasReview = false;

        try {
          // Fetch details to get proper data
          const details = await appointmentService.getAppointmentById(item.id);
          barbeariaId = details.barbeariaId;

          if (details.servicoId && details.barbeariaId) {
            // Get service
            const services = await barberShopService.listServices(details.barbeariaId);
            const service = services.find(s => s.id === details.servicoId);
            if (service) {
              price = `R$ ${service.preco.toFixed(2)}`;
              serviceName = service.nome;
            }

            // Get shop
            let shop = barberShops.find(s => s.id === details.barbeariaId);
            if (!shop) {
              const shops = await clientService.listActiveBarbershops();
              shop = shops.find(s => s.id === details.barbeariaId);
            }
            if (shop) {
              shopName = shop.nomeFantasia || shop.nome;
            }

            // Get professional name using funcionarioId from details
            if (details.funcionarioId && details.servicoId) {
              try {
                const professionals = await barberShopService.listProfessionals(details.servicoId, details.barbeariaId);
                const professional = professionals.find(p => p.id === details.funcionarioId);
                if (professional) {
                  professionalName = professional.nome;
                }
              } catch (err) {
                console.error('Error fetching professional name:', err);
              }
            }

            // Check if appointment has been reviewed
            try {
              hasReview = await avaliacaoService.verificarAvaliacao(item.id);
            } catch (err) {
              console.error('Error checking review status:', err);
              hasReview = false; // Default to false if check fails
            }
          }
        } catch (err) {
          console.error("Failed to fetch details for history appointment", item.id, err);
        }

        const dateObj = new Date(item.dataHora);
        return {
          id: item.id.toString(),
          barberShopName: shopName,
          service: serviceName,
          price: price,
          date: dateObj.toLocaleDateString('pt-BR'),
          time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          barberName: professionalName,
          status: item.status,
          barbeariaId: barbeariaId,
          hasReview: hasReview
        };
      }));
      setHistory(formattedHistory);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoadingHistory(false);
    }
  }, [history.length]);

  const fetchUpcomingAppointments = useCallback(async () => {
    try {
      // Don't set loading on every poll to avoid flickering
      if (upcomingAppointments.length === 0) setLoadingUpcoming(true);

      const recentData = await clientService.getRecentAppointments('futuros');
      console.log('Recent Appointments Data:', recentData);

      // Filter out completed or cancelled appointments from upcoming list
      const activeAppointments = recentData.filter(item => item.status === 'PENDENTE' || item.status === 'CONFIRMADO');

      // Fetch details for each appointment to get price and correct names
      const enrichedAppointments = await Promise.all(activeAppointments.map(async (item) => {
        let price = "R$ -";
        let serviceName = item.nomeServico || `Serviço #${item.servicoId}`;
        let shopName = item.nomeBarbearia || `Barbearia #${item.barbeariaId}`;
        let professionalName = item.nomeBarbeiro || 'Não informado';
        let barbeariaId: number | undefined;

        try {
          // 1. Get detailed appointment info to get IDs
          const details = await appointmentService.getAppointmentById(item.id);
          barbeariaId = details.barbeariaId;

          if (details.servicoId && details.barbeariaId) {
            // 2. Get service details to get price and name
            const services = await barberShopService.listServices(details.barbeariaId);
            const service = services.find(s => s.id === details.servicoId);

            if (service) {
              price = `R$ ${service.preco.toFixed(2)}`;
              serviceName = service.nome;
            }

            // 3. Get shop details to get correct name (nomeFantasia)
            let shop = barberShops.find(s => s.id === details.barbeariaId);
            if (!shop) {
              const shops = await clientService.listActiveBarbershops();
              shop = shops.find(s => s.id === details.barbeariaId);
            }

            if (shop) {
              shopName = shop.nomeFantasia || shop.nome;
            }

            // 4. Get professional name using funcionarioId from details
            if (details.funcionarioId && details.servicoId) {
              try {
                const professionals = await barberShopService.listProfessionals(details.servicoId, details.barbeariaId);
                const professional = professionals.find(p => p.id === details.funcionarioId);
                if (professional) {
                  professionalName = professional.nome;
                }
              } catch (err) {
                console.error('Error fetching professional name:', err);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch details for appointment", item.id, err);
        }

        // Backend returns time with "Z" (e.g., "2026-01-03T09:00:00Z") 
        // but it means local Brazil time, not UTC
        // Remove the "Z" to parse as local time
        const localDateTime = item.dataHora.replace('Z', '');
        const dateObj = new Date(localDateTime);

        // Debug: Log original and converted times
        console.log('DEBUG Timezone:', {
          original: item.dataHora,
          withoutZ: localDateTime,
          converted: dateObj.toLocaleString('pt-BR'),
          time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });

        return {
          id: item.id.toString(),
          barberShopName: shopName,
          service: serviceName,
          price: price,
          date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          barberName: professionalName,
          status: item.status,
          barbeariaId: barbeariaId
        };
      }));

      setUpcomingAppointments(enrichedAppointments);
    } catch (error) {
      console.error("Failed to fetch upcoming appointments", error);
    } finally {
      if (upcomingAppointments.length === 0) setLoadingUpcoming(false);
    }
  }, [upcomingAppointments.length]); // Removed barberShops to prevent infinite loop

  // Polling for status updates
  useEffect(() => {
    // Initial fetch
    fetchHistory();
    fetchUpcomingAppointments();

    const interval = setInterval(() => {
      fetchHistory();
      fetchUpcomingAppointments();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchHistory, fetchUpcomingAppointments]);

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
        const shops = await clientService.listActiveBarbershops();

        // Fetch review stats for each shop to get accurate ratings
        const shopsWithRatings = await Promise.all(
          shops.map(async (shop) => {
            try {
              const stats = await barberShopService.getReviewStats(shop.id);
              return {
                ...shop,
                avaliacaoMedia: stats?.mediaGeral ?? 0
              };
            } catch (error) {
              console.error(`Failed to fetch stats for shop ${shop.id}`, error);
              return shop; // Return original shop if stats fail
            }
          })
        );

        setBarberShops(shopsWithRatings);
      } catch (error) {
        console.error("Failed to fetch barber shops", error);
      } finally {
        setLoadingBarberShops(false);
      }
    };

    fetchBarberShops();
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
    fetchUpcomingAppointments();
    fetchHistory();
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
              {barberShops.filter(s => (s.nomeFantasia || s.nome || '').toLowerCase().includes(search.toLowerCase())).map(shop => (
                <BarberShopCard
                  key={shop.id}
                  shop={shop}
                  onClick={() => setSelectedShop(shop)}
                  onRatingClick={() => handleViewReviews(shop)}
                />
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

            {loadingUpcoming ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-[#d97757] animate-spin mb-4" />
                <p className="text-zinc-500 text-sm">Carregando agendamentos...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <>
                {/* Group appointments by date */}
                {(() => {
                  const groupedByDate = upcomingAppointments.reduce((acc, app) => {
                    const dateKey = app.date;
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(app);
                    return acc;
                  }, {} as Record<string, UIAppointment[]>);

                  return Object.entries(groupedByDate).map(([date, appointments]) => {
                    // Parse the date to get day of week
                    const [day, month] = date.split('/');
                    const year = new Date().getFullYear();
                    const dateObj = new Date(year, parseInt(month) - 1, parseInt(day));
                    const dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
                    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

                    return (
                      <div key={date} className="mb-8">
                        {/* Grupo de Data */}
                        <div className="mb-2">
                          <div className="flex items-center gap-2 text-zinc-400 mb-4">
                            <Calendar className="w-5 h-5" />
                            <span className="text-lg">Dia {date} - {capitalizedDayOfWeek}</span>
                          </div>
                          <div className="w-full h-px bg-white/10 mb-4"></div>
                        </div>

                        {/* Lista de Agendamentos */}
                        <div className="space-y-1">
                          {appointments.map(app => (
                            <AppointmentRow
                              key={app.id}
                              app={app}
                              onCancel={handleCancelAppointment}
                              onReschedule={handleRescheduleAppointment}
                              loading={actionLoading === app.id}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-white/5 p-6 rounded-full mb-4">
                  <Calendar className="w-12 h-12 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium mb-1">Nenhum agendamento futuro</p>
                <p className="text-zinc-600 text-sm max-w-xs">Seus próximos agendamentos aparecerão aqui.</p>
              </div>
            )}
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
                    <HistoryCard
                      key={app.id}
                      appointment={app}
                      onRate={() => handleRateClick(app)}
                    />
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

      {/* Modal de Avaliação */}
      {showReviewModal && selectedAppointmentForReview && (
        <ReviewModal
          appointment={selectedAppointmentForReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {/* Modal de Avaliações da Barbearia */}
      {showReviewsModal && selectedShopForReviews && (
        <ReviewsModal
          barberShop={selectedShopForReviews}
          onClose={() => setShowReviewsModal(false)}
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

      {/* Modal de Reagendamento */}
      {showRescheduleModal && selectedAppointmentForReschedule && (
        <RescheduleModal
          appointment={selectedAppointmentForReschedule}
          onClose={() => setShowRescheduleModal(false)}
          onConfirm={handleRescheduleConfirm}
        />
      )}

    </div>
  );
}