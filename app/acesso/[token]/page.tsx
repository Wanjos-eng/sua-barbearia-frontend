'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, Plus, X, Check, XCircle } from 'lucide-react';
import { professionalAccessService } from '@/services/professionalAccessService';
import { formatTimeSlot, generateTimeSlots, formatDateToISO, getDayName } from '@/utils/timeHelpers';
import type {
    ProfessionalInfo,
    ProfessionalAppointment,
    ProfessionalWorkingHours,
    ProfessionalException,
    ProfessionalBlock
} from '@/types/professional';

export default function ProfessionalDashboard() {
    const params = useParams();
    const token = params.token as string;

    const [professional, setProfessional] = useState<ProfessionalInfo | null>(null);
    const [appointments, setAppointments] = useState<ProfessionalAppointment[]>([]);
    const [workingHours, setWorkingHours] = useState<ProfessionalWorkingHours[]>([]);
    const [exceptions, setExceptions] = useState<ProfessionalException[]>([]);
    const [blocks, setBlocks] = useState<ProfessionalBlock[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'agenda' | 'horarios' | 'excecoes' | 'bloqueios'>('agenda');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    // Modal states
    const [showHoursModal, setShowHoursModal] = useState(false);
    const [showExceptionModal, setShowExceptionModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);

    // Form states for hours
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('18:00');
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states for exception
    const [exceptionDate, setExceptionDate] = useState('');
    const [exceptionStart, setExceptionStart] = useState('10:00');
    const [exceptionEnd, setExceptionEnd] = useState('14:00');
    const [exceptionReason, setExceptionReason] = useState('');

    // Form states for block
    const [blockDate, setBlockDate] = useState('');
    const [blockStart, setBlockStart] = useState('12:00');
    const [blockEnd, setBlockEnd] = useState('13:00');
    const [blockReason, setBlockReason] = useState('');

    useEffect(() => {
        if (token) {
            loadAllData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        if (token && professional) {
            loadAppointments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    const loadAllData = async () => {
        setLoading(true);
        setErrors([]);
        const errorList: string[] = [];

        try {
            const info = await professionalAccessService.getInfo(token);
            setProfessional(info);
        } catch (err) {
            errorList.push(`Info: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }

        await loadAppointments(errorList);

        try {
            const hours = await professionalAccessService.getWorkingHours(token);
            setWorkingHours(hours);
        } catch (err) {
            errorList.push(`Horários: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }

        try {
            const excs = await professionalAccessService.getExceptions(token);
            setExceptions(excs);
        } catch (err) {
            errorList.push(`Exceções: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }

        try {
            const blks = await professionalAccessService.getBlocks(token);
            setBlocks(blks);
        } catch (err) {
            errorList.push(`Bloqueios: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }

        setErrors(errorList);
        setLoading(false);
    };

    const loadAppointments = async (errorList: string[] = []) => {
        try {
            const dateStr = formatDateToISO(selectedDate);
            console.log('Loading appointments for date:', dateStr);
            console.log('Selected date object:', selectedDate);
            console.log('Today:', new Date());

            const appts = await professionalAccessService.getAppointments(token, {
                dataInicio: dateStr,
                dataFim: dateStr
            });
            console.log('DEBUG APPOINTMENTS RECEIVED:', appts);
            console.log('Number of appointments:', appts.length);
            if (appts.length > 0) {
                console.log('Appointment times (parsing as LOCAL time):');
                appts.forEach((apt, idx) => {
                    const localDate = parseUTCDateTime(apt.dataHora); // Now treats as local
                    console.log(`  ${idx + 1}. ID ${apt.id}:`);
                    console.log(`     Raw: ${apt.dataHora}`);
                    console.log(`     Horário Local (Brasil): ${localDate.toLocaleString('pt-BR')}`);
                    console.log(`     Duração: ${apt.duracao || 'NÃO INFORMADA'} min`);
                    console.log(`     Data/Hora Fim: ${apt.dataHoraFim || 'NÃO INFORMADA'}`);
                });
            }

            // Filter appointments to only show those for the selected date
            // This is a workaround for API returning all appointments regardless of date filter
            const filteredAppts = appts.filter(apt => {
                const aptDate = parseUTCDateTime(apt.dataHora);
                const aptDateStr = formatDateToISO(aptDate);
                return aptDateStr === dateStr;
            });

            console.log(`Filtered to ${filteredAppts.length} appointments for ${dateStr}`);
            setAppointments(filteredAppts);
        } catch (err) {
            if (!errorList) {
                setErrors(prev => [...prev, `Agendamentos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`]);
            } else {
                errorList.push(`Agendamentos: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
            }
        }
    };

    const handleConfirmAppointment = async (id: number) => {
        try {
            await professionalAccessService.confirmAppointment(token, id);
            await loadAppointments();
            alert('Agendamento confirmado!');
        } catch {
            alert('Erro ao confirmar agendamento');
        }
    };

    const handleCompleteAppointment = async (id: number) => {
        try {
            await professionalAccessService.completeAppointment(token, id);
            await loadAppointments();
            alert('Agendamento concluído!');
        } catch {
            alert('Erro ao concluir agendamento');
        }
    };

    const handleCancelAppointment = async (id: number) => {
        if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

        try {
            await professionalAccessService.cancelAppointment(token, id);
            await loadAppointments();
            alert('Agendamento cancelado');
        } catch {
            alert('Erro ao cancelar agendamento');
        }
    };

    const handleCreateHours = async () => {
        if (selectedDays.length === 0) {
            alert('Selecione pelo menos um dia da semana');
            return;
        }

        try {
            setSaving(true);
            for (const day of selectedDays) {
                await professionalAccessService.setWorkingHours(token, {
                    diaSemana: day,
                    horaAbertura: startTime,
                    horaFechamento: endTime,
                    ativo: isActive
                });
            }
            await loadAllData();
            setShowHoursModal(false);
            setSelectedDays([]);
            setStartTime('09:00');
            setEndTime('18:00');
            setIsActive(true);
            alert('Horários criados com sucesso!');
        } catch {
            alert('Erro ao criar horários');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateException = async () => {
        if (!exceptionDate || !exceptionReason) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setSaving(true);
            await professionalAccessService.createException(token, {
                data: exceptionDate,
                horaAbertura: exceptionStart,
                horaFechamento: exceptionEnd,
                motivo: exceptionReason
            });
            await loadAllData();
            setShowExceptionModal(false);
            setExceptionDate('');
            setExceptionStart('10:00');
            setExceptionEnd('14:00');
            setExceptionReason('');
            alert('Exceção criada com sucesso!');
        } catch {
            alert('Erro ao criar exceção');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateBlock = async () => {
        if (!blockDate || !blockReason) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            setSaving(true);
            await professionalAccessService.createBlock(token, {
                data: blockDate,
                horarioInicio: blockStart,
                horarioFim: blockEnd,
                motivo: blockReason
            });
            await loadAllData();
            setShowBlockModal(false);
            setBlockDate('');
            setBlockStart('12:00');
            setBlockEnd('13:00');
            setBlockReason('');
            alert('Bloqueio criado com sucesso!');
        } catch {
            alert('Erro ao criar bloqueio');
        } finally {
            setSaving(false);
        }
    };

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const timeSlots = generateTimeSlots(8, 20, 30);

    // Helper to parse datetime string as LOCAL time (Brazil)
    // Backend returns times with 'Z' but they are already in Brazil timezone
    const parseUTCDateTime = (dateTimeStr: string): Date => {
        // Remove 'Z' to treat as local time instead of UTC
        const localStr = dateTimeStr.endsWith('Z') ? dateTimeStr.slice(0, -1) : dateTimeStr;
        return new Date(localStr);
    };

    const getAppointmentForSlot = (slot: string) => {
        const selectedDateStr = formatDateToISO(selectedDate);
        const found = appointments.find(apt => {
            const aptDate = parseUTCDateTime(apt.dataHora);
            const aptDateStr = formatDateToISO(aptDate);
            const aptTime = `${aptDate.getHours().toString().padStart(2, '0')}:${aptDate.getMinutes().toString().padStart(2, '0')}`;

            if (aptDateStr === selectedDateStr) {
                console.log(`[Verificando Slot ${slot}] Agendamento ID ${apt.id} às ${aptTime} (${apt.nomeServico})`);
            }

            return aptDateStr === selectedDateStr && aptTime === slot;
        });

        if (found) {
            console.log(`[✓ Match] Slot ${slot} = Agendamento ID ${found.id}`);
        }

        return found;
    };

    const getOccupyingAppointment = (slot: string) => {
        const selectedDateStr = formatDateToISO(selectedDate);
        return appointments.find(apt => {
            const aptDate = parseUTCDateTime(apt.dataHora);
            const aptDateStr = formatDateToISO(aptDate);

            if (aptDateStr !== selectedDateStr) return false;

            const startTime = `${aptDate.getHours().toString().padStart(2, '0')}:${aptDate.getMinutes().toString().padStart(2, '0')}`;

            // Calculate end time
            let endTime;
            if (apt.dataHoraFim) {
                const endDate = parseUTCDateTime(apt.dataHoraFim);
                endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
            } else if (apt.duracao) {
                const endDate = new Date(aptDate.getTime() + apt.duracao * 60000);
                endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
            } else {
                // Default to 30 min if no duration info
                const endDate = new Date(aptDate.getTime() + 30 * 60000);
                endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
            }

            // Debug log for troubleshooting
            const isOccupying = slot > startTime && slot < endTime;
            if (isOccupying) {
                console.log(`[Slot Ocupado] Slot ${slot} está ocupado pelo agendamento:`, {
                    servico: apt.nomeServico,
                    inicio: startTime,
                    fim: endTime,
                    duracao: apt.duracao,
                    dataHoraFim: apt.dataHoraFim
                });
            }

            // Check if slot is strictly within (startTime, endTime)
            // We use > startTime (not >=) because the start slot is already shown by getAppointmentForSlot
            // We use < endTime because if service ends exactly at slot time, that slot should be available
            return isOccupying;
        });
    };


    const getBlockForSlot = (slot: string) => {
        const selectedDateStr = formatDateToISO(selectedDate);
        return blocks.find(block => {
            if (block.data !== selectedDateStr) return false;
            const startTime = formatTimeSlot(block.horarioInicio);
            const endTime = formatTimeSlot(block.horarioFim);
            return slot >= startTime && slot < endTime;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58BEC3] mx-auto mb-4"></div>
                    <p className="text-[#DDDBCB]">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-[#DDDBCB]">
            <header className="bg-[#151515] border-b border-[#292929] sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">{professional?.nome || 'Profissional'}</h1>
                            <p className="text-sm text-[#5C5C5C]">{professional?.perfil || ''}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[#5C5C5C]">{professional?.email || ''}</p>
                        </div>
                    </div>
                </div>
            </header>

            {errors.length > 0 && (
                <div className="bg-yellow-500/10 border-y border-yellow-500/30 p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-500 mb-1">Alguns dados não puderam ser carregados:</p>
                                <ul className="text-xs text-yellow-500/80 space-y-1">
                                    {errors.map((err, idx) => (
                                        <li key={idx}>• {err}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#151515] border-b border-[#292929]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-4">
                        {[
                            { key: 'agenda', label: 'Agenda' },
                            { key: 'horarios', label: 'Horários' },
                            { key: 'excecoes', label: 'Exceções' },
                            { key: 'bloqueios', label: 'Bloqueios' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-[#58BEC3] text-[#58BEC3]' : 'border-transparent text-[#5C5C5C] hover:text-[#DDDBCB]'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'agenda' && (
                    <div className="space-y-6">
                        <div className="bg-[#151515] border border-[#292929] rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <button onClick={() => changeDate(-1)} className="p-2 hover:bg-[#292929] rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="text-center">
                                    <p className="text-lg font-bold">{selectedDate.toLocaleDateString('pt-BR')}</p>
                                    <p className="text-sm text-[#5C5C5C]">
                                        {formatDateToISO(selectedDate) === formatDateToISO(new Date())
                                            ? 'Hoje'
                                            : getDayName(selectedDate)}
                                    </p>
                                </div>
                                <button onClick={() => changeDate(1)} className="p-2 hover:bg-[#292929] rounded-lg">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#151515] border border-[#292929] rounded-xl p-4">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#58BEC3]" />
                                Horários do Dia
                            </h3>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {timeSlots.map(slot => {
                                    const appointment = getAppointmentForSlot(slot);
                                    const occupyingAppointment = getOccupyingAppointment(slot);
                                    const block = getBlockForSlot(slot);

                                    // Check if slot is in the past (only if viewing today)
                                    const isToday = formatDateToISO(selectedDate) === formatDateToISO(new Date());
                                    const now = new Date();
                                    const [slotHour, slotMinute] = slot.split(':').map(Number);
                                    const slotTime = new Date();
                                    slotTime.setHours(slotHour, slotMinute, 0, 0);
                                    const isPast = isToday && slotTime < now;

                                    // Don't show cancelled appointments in grid
                                    if (appointment?.status === 'CANCELADO') {
                                        // Render as available slot
                                        return (
                                            <div
                                                key={slot}
                                                className={`p-3 rounded-lg border bg-[#050505] border-[#292929] ${isPast ? 'opacity-50' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-sm font-medium">{slot}</span>
                                                    <span className="text-xs text-[#5C5C5C]">{isPast ? 'Passado' : 'Disponível'}</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (occupyingAppointment) {
                                        return (
                                            <div
                                                key={slot}
                                                className="p-3 rounded-lg border bg-[#58BEC3]/10 border-[#58BEC3] border-t-0 rounded-t-none relative -mt-1 z-0 opacity-70"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm font-medium text-[#58BEC3]/50">{slot}</span>
                                                    <span className="text-xs text-[#5C5C5C]">Continuação ({occupyingAppointment.nomeServico})</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={slot}
                                            className={`p-3 rounded-lg border ${appointment ? 'bg-[#58BEC3]/10 border-[#58BEC3] rounded-b-none relative z-10' :
                                                block ? 'bg-red-500/10 border-red-500/30' :
                                                    'bg-[#050505] border-[#292929]'
                                                }`}
                                        >
                                            {appointment ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-sm font-medium text-[#58BEC3]">{slot}</span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full ${appointment.status === 'CONFIRMADO' ? 'bg-green-500/20 text-green-500' :
                                                                    appointment.status === 'PENDENTE' ? 'bg-yellow-500/20 text-yellow-500' :
                                                                        appointment.status === 'CONCLUIDO' ? 'bg-blue-500/20 text-blue-500' :
                                                                            'bg-red-500/20 text-red-500'
                                                                    }`}>
                                                                    {appointment.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm font-bold">{appointment.nomeServico}</p>
                                                            <p className="text-xs text-[#5C5C5C]">
                                                                Cliente: {appointment.nomeBarbearia || 'N/A'}
                                                            </p>
                                                            {appointment.observacoes && (
                                                                <p className="text-xs text-[#5C5C5C] mt-1">
                                                                    Obs: {appointment.observacoes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {appointment.status === 'PENDENTE' && (
                                                            <button
                                                                onClick={() => handleConfirmAppointment(appointment.id)}
                                                                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Confirmar
                                                            </button>
                                                        )}
                                                        {(appointment.status === 'CONFIRMADO' || appointment.status === 'PENDENTE') && (
                                                            <button
                                                                onClick={() => handleCompleteAppointment(appointment.id)}
                                                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Concluir
                                                            </button>
                                                        )}
                                                        {appointment.status !== 'CANCELADO' && appointment.status !== 'CONCLUIDO' && (
                                                            <button
                                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                                            >
                                                                <XCircle className="w-3 h-3" />
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : block ? (
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-sm font-medium">{slot}</span>
                                                    <div className="flex-1 ml-4">
                                                        <p className="text-sm font-medium text-red-500">Bloqueado</p>
                                                        <p className="text-xs text-[#5C5C5C]">{block.motivo}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-sm font-medium">{slot}</span>
                                                    <span className="text-xs text-[#5C5C5C]">Disponível</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cancelled Appointments Section */}
                        {appointments.filter(apt => apt.status === 'CANCELADO').length > 0 && (
                            <div className="bg-[#151515] border border-[#292929] rounded-xl p-4 mt-4">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                    Cancelamentos do Dia
                                </h3>
                                <div className="space-y-2">
                                    {appointments
                                        .filter(apt => apt.status === 'CANCELADO')
                                        .map(appointment => (
                                            <div
                                                key={appointment.id}
                                                className="p-3 rounded-lg border bg-red-500/10 border-red-500/30"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm font-medium text-red-500">
                                                                {parseUTCDateTime(appointment.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">
                                                                CANCELADO
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold">{appointment.nomeServico}</p>
                                                        <p className="text-xs text-[#5C5C5C]">
                                                            Cliente: {appointment.nomeBarbearia || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'horarios' && (
                    <div className="bg-[#151515] border border-[#292929] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Horários Semanais</h3>
                            <button
                                onClick={() => setShowHoursModal(true)}
                                className="bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Horário
                            </button>
                        </div>
                        {workingHours.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {workingHours.map(wh => (
                                    <div key={wh.id} className="flex items-center justify-between p-4 bg-[#050505] border border-[#292929] rounded-lg">
                                        <div>
                                            <span className="font-bold text-[#DDDBCB]">
                                                {['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][wh.diaSemana]}
                                            </span>
                                            {wh.ativo ? (
                                                <p className="text-sm text-[#58BEC3] mt-1">
                                                    {formatTimeSlot(wh.horaAbertura)} - {formatTimeSlot(wh.horaFechamento)}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-red-500 mt-1">Folga</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[#5C5C5C] text-center py-8">Nenhum horário definido</p>
                        )}
                    </div>
                )}

                {activeTab === 'excecoes' && (
                    <div className="bg-[#151515] border border-[#292929] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Exceções</h3>
                            <button
                                onClick={() => setShowExceptionModal(true)}
                                className="bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Exceção
                            </button>
                        </div>
                        {exceptions.filter(exc => exc.ativo).length > 0 ? (
                            <div className="space-y-3">
                                {exceptions.filter(exc => exc.ativo).map(exc => (
                                    <div key={exc.id} className="flex items-center justify-between p-3 bg-[#050505] border border-[#292929] rounded-lg">
                                        <div>
                                            <p className="font-medium">{new Date(exc.data).toLocaleDateString('pt-BR')}</p>
                                            <p className="text-xs text-[#5C5C5C]">{exc.motivo}</p>
                                        </div>
                                        <span className="text-sm text-[#58BEC3]">
                                            {formatTimeSlot(exc.horaAbertura)} - {formatTimeSlot(exc.horaFechamento)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[#5C5C5C] text-center py-8">Nenhuma exceção cadastrada</p>
                        )}
                    </div>
                )}

                {activeTab === 'bloqueios' && (
                    <div className="bg-[#151515] border border-[#292929] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Bloqueios</h3>
                            <button
                                onClick={() => setShowBlockModal(true)}
                                className="bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Adicionar Bloqueio
                            </button>
                        </div>
                        {blocks.length > 0 ? (
                            <div className="space-y-3">
                                {blocks.map(block => (
                                    <div key={block.id} className="flex items-center justify-between p-3 bg-[#050505] border border-[#292929] rounded-lg">
                                        <div>
                                            <p className="font-medium">{new Date(block.data).toLocaleDateString('pt-BR')}</p>
                                            <p className="text-xs text-[#5C5C5C]">{block.motivo}</p>
                                        </div>
                                        <span className="text-sm text-red-500">
                                            {formatTimeSlot(block.horarioInicio)} - {formatTimeSlot(block.horarioFim)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-[#5C5C5C] text-center py-8">Nenhum bloqueio cadastrado</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showHoursModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#151515] rounded-xl border border-[#292929] max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Adicionar Horário</h3>
                            <button onClick={() => setShowHoursModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[#5C5C5C] mb-2 block">
                                    Dias da Semana
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: 1, label: 'Segunda' },
                                        { value: 2, label: 'Terça' },
                                        { value: 3, label: 'Quarta' },
                                        { value: 4, label: 'Quinta' },
                                        { value: 5, label: 'Sexta' },
                                        { value: 6, label: 'Sábado' },
                                        { value: 7, label: 'Domingo' }
                                    ].map(day => {
                                        const alreadyHasHours = workingHours.some(wh => wh.diaSemana === day.value);
                                        return (
                                            <button
                                                key={day.value}
                                                onClick={() => !alreadyHasHours && toggleDay(day.value)}
                                                disabled={alreadyHasHours}
                                                className={`p-2 rounded-lg border text-sm transition-colors ${alreadyHasHours
                                                    ? 'bg-[#292929] border-[#292929] text-[#5C5C5C] cursor-not-allowed opacity-50'
                                                    : selectedDays.includes(day.value)
                                                        ? 'bg-[#58BEC3]/10 border-[#58BEC3] text-[#58BEC3]'
                                                        : 'bg-[#050505] border-[#292929] text-[#5C5C5C] hover:border-[#58BEC3]/50'
                                                    }`}
                                            >
                                                {day.label}
                                                {alreadyHasHours && <span className="ml-1 text-xs">✓</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Entrada</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Saída</label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="active" className="text-sm text-[#DDDBCB]">
                                    Dia de trabalho ativo
                                </label>
                            </div>

                            <button
                                onClick={handleCreateHours}
                                disabled={saving || selectedDays.length === 0}
                                className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Salvando...' : `Criar Horário (${selectedDays.length})`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExceptionModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#151515] rounded-xl border border-[#292929] max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Adicionar Exceção</h3>
                            <button onClick={() => setShowExceptionModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Data *</label>
                                <input
                                    type="date"
                                    value={exceptionDate}
                                    onChange={(e) => setExceptionDate(e.target.value)}
                                    className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Início</label>
                                    <input
                                        type="time"
                                        value={exceptionStart}
                                        onChange={(e) => setExceptionStart(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Fim</label>
                                    <input
                                        type="time"
                                        value={exceptionEnd}
                                        onChange={(e) => setExceptionEnd(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Motivo *</label>
                                <textarea
                                    value={exceptionReason}
                                    onChange={(e) => setExceptionReason(e.target.value)}
                                    placeholder="Ex: Trabalhar domingo por demanda"
                                    rows={3}
                                    className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] resize-none"
                                />
                            </div>

                            <button
                                onClick={handleCreateException}
                                disabled={saving}
                                className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Salvando...' : 'Criar Exceção'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBlockModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#151515] rounded-xl border border-[#292929] max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Adicionar Bloqueio</h3>
                            <button onClick={() => setShowBlockModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Data *</label>
                                <input
                                    type="date"
                                    value={blockDate}
                                    onChange={(e) => setBlockDate(e.target.value)}
                                    className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Início</label>
                                    <input
                                        type="time"
                                        value={blockStart}
                                        onChange={(e) => setBlockStart(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Fim</label>
                                    <input
                                        type="time"
                                        value={blockEnd}
                                        onChange={(e) => setBlockEnd(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-[#5C5C5C] mb-1 block">Motivo *</label>
                                <textarea
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    placeholder="Ex: Almoço, Reunião"
                                    rows={3}
                                    className="w-full bg-[#050505] border border-[#292929] rounded-lg py-2 px-3 text-[#DDDBCB] focus:outline-none focus:border-[#58BEC3] resize-none"
                                />
                            </div>

                            <button
                                onClick={handleCreateBlock}
                                disabled={saving}
                                className="w-full bg-[#58BEC3] hover:bg-[#7ADBE0] text-[#151515] font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Salvando...' : 'Criar Bloqueio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
