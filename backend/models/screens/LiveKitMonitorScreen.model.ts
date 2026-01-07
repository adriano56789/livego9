// Modelo para LiveKitMonitorScreen
type ParticipantType = 'publisher' | 'subscriber' | 'moderator' | 'viewer';
type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'disconnected';
type TrackKind = 'audio' | 'video' | 'screen_share' | 'screen_share_audio';

interface Participant {
  id: string;
  identity: string;
  name: string;
  type: ParticipantType;
  isSpeaking: boolean;
  isLocal: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  connectionQuality: ConnectionQuality;
  audioLevel: number;
  joinTime: string;
  lastActiveTime: string;
  tracks: {
    sid: string;
    kind: TrackKind;
    codec: string;
    isEnabled: boolean;
    isSubscribed: boolean;
    isPublishing: boolean;
    dimensions?: { width: number; height: number };
    bitrate?: number;
    jitter?: number;
    packetsLost?: number;
    roundTripTime?: number;
  }[];
}

interface RoomStats {
  participants: number;
  publishers: number;
  subscribers: number;
  totalIncomingBitrate: number;
  totalOutgoingBitrate: number;
  totalBytesIn: number;
  totalBytesOut: number;
  startTime: string;
  uptime: number;
}

interface ServerStats {
  cpuUsage: number;
  memoryUsage: number;
  rooms: number;
  participants: number;
  tracks: number;
  nodeVersion: string;
  region: string;
  loadAverage: number[];
  uptime: number;
}

export interface LiveKitMonitorScreenModel {
  // Estado da conexão
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'disconnecting' | 'error';
  connectionError: string | null;
  roomName: string;
  roomSid: string;
  
  // Participantes
  participants: Record<string, Participant>;
  localParticipant: Participant | null;
  activeSpeakerId: string | null;
  dominantSpeakerId: string | null;
  
  // Estatísticas da sala
  roomStats: RoomStats | null;
  serverStats: ServerStats | null;
  
  // Configurações de mídia
  audioEnabled: boolean;
  videoEnabled: boolean;
  audioDeviceId: string | null;
  videoDeviceId: string | null;
  availableAudioDevices: MediaDeviceInfo[];
  availableVideoDevices: MediaDeviceInfo[];
  
  // Qualidade da conexão
  connectionQuality: ConnectionQuality;
  networkQuality: {
    score: number;
    quality: 'excellent' | 'good' | 'poor' | 'unknown';
    jitter: number;
    rtt: number;
    packetsLost: number;
    bitrate: number;
  };
  
  // Estado da UI
  isSettingsOpen: boolean;
  selectedParticipantId: string | null;
  isFullscreen: boolean;
  showStats: boolean;
  isReconnecting: boolean;
  
  // Carregamento e erros
  isLoading: boolean;
  error: string | null;
}

export const initialLiveKitMonitorScreenState: LiveKitMonitorScreenModel = {
  isConnected: false,
  connectionStatus: 'disconnected',
  connectionError: null,
  roomName: '',
  roomSid: '',
  
  participants: {},
  localParticipant: null,
  activeSpeakerId: null,
  dominantSpeakerId: null,
  
  roomStats: null,
  serverStats: null,
  
  audioEnabled: true,
  videoEnabled: true,
  audioDeviceId: null,
  videoDeviceId: null,
  availableAudioDevices: [],
  availableVideoDevices: [],
  
  connectionQuality: 'excellent',
  networkQuality: {
    score: 100,
    quality: 'excellent',
    jitter: 0,
    rtt: 0,
    packetsLost: 0,
    bitrate: 0,
  },
  
  isSettingsOpen: false,
  selectedParticipantId: null,
  isFullscreen: false,
  showStats: false,
  isReconnecting: false,
  
  isLoading: false,
  error: null,
};

export type LiveKitMonitorScreenAction =
  // Ações de conexão
  | { type: 'CONNECT_REQUEST'; payload: { roomName: string; identity: string; token: string } }
  | { type: 'CONNECT_SUCCESS'; payload: { roomSid: string; localParticipant: Participant } }
  | { type: 'CONNECT_ERROR'; payload: string }
  | { type: 'DISCONNECT_REQUEST' }
  | { type: 'DISCONNECT_SUCCESS' }
  | { type: 'RECONNECTING' }
  | { type: 'RECONNECTED' }
  
  // Ações de participantes
  | { type: 'PARTICIPANT_CONNECTED'; payload: Participant }
  | { type: 'PARTICIPANT_DISCONNECTED'; payload: string }
  | { type: 'PARTICIPANT_UPDATED'; payload: { id: string; updates: Partial<Participant> } }
  | { type: 'ACTIVE_SPEAKER_CHANGED'; payload: string | null }
  | { type: 'DOMINANT_SPEAKER_CHANGED'; payload: string | null }
  
  // Ações de mídia
  | { type: 'TOGGLE_AUDIO'; payload: boolean }
  | { type: 'TOGGLE_VIDEO'; payload: boolean }
  | { type: 'SET_AUDIO_DEVICE'; payload: string }
  | { type: 'SET_VIDEO_DEVICE'; payload: string }
  | { type: 'UPDATE_DEVICE_LIST'; payload: { audio: MediaDeviceInfo[]; video: MediaDeviceInfo[] } }
  
  // Ações de qualidade
  | { type: 'UPDATE_CONNECTION_QUALITY'; payload: ConnectionQuality }
  | { type: 'UPDATE_NETWORK_QUALITY'; payload: LiveKitMonitorScreenModel['networkQuality'] }
  
  // Ações de UI
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SELECT_PARTICIPANT'; payload: string | null }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'TOGGLE_STATS' }
  
  // Ações de estatísticas
  | { type: 'UPDATE_ROOM_STATS'; payload: RoomStats }
  | { type: 'UPDATE_SERVER_STATS'; payload: ServerStats }
  
  // Ações de erro
  | { type: 'SET_ERROR'; payload: string | null };

// Funções auxiliares
export function getParticipantDisplayName(participant: Participant): string {
  return participant.name || participant.identity || 'Usuário desconhecido';
}

export function formatBitrate(bitsPerSecond: number): string {
  if (bitsPerSecond < 1000) return `${bitsPerSecond} bps`;
  if (bitsPerSecond < 1000000) return `${(bitsPerSecond / 1000).toFixed(1)} Kbps`;
  return `${(bitsPerSecond / 1000000).toFixed(1)} Mbps`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
