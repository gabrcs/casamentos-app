/**
 * Dados do casamento em um só lugar. Preencha todos os campos abaixo
 * antes do primeiro build — veja IMPLANTACAO.md para o passo a passo.
 */
const groom = '{{NOME_NOIVO}}';
const bride = '{{NOME_NOIVA}}';

export const site = {
  couple: {
    bride,
    groom,
    short: `${groom} & ${bride}`,
    // Iniciais exibidas no cabeçalho do painel admin (ex: "M & D").
    initials: `${groom.charAt(0)} & ${bride.charAt(0)}`,
  },
  // Data e hora do evento em ISO (usada na contagem regressiva).
  // Ex: '2027-05-20T18:00:00-03:00'
  eventDate: '{{DATA_HORA_CASAMENTO_ISO}}',
  city: '{{CIDADE_UF}}',
  quote: '{{FRASE_DO_CASAL}}',
  // Clipe do ensaio pré-wedding (YouTube, formato embed). Deixe '' para
  // ocultar a seção de vídeo inteira.
  videoUrl: '{{VIDEO_URL_EMBED}}',
  ceremony: {
    title: 'Cerimônia',
    time: '{{HORA_CERIMONIA}}',
    place: '{{LOCAL_CERIMONIA}}',
    address: '{{ENDERECO_CERIMONIA}}',
    mapsUrl: '{{GOOGLE_MAPS_URL_CERIMONIA}}',
    mapsEmbedUrl: '{{GOOGLE_MAPS_EMBED_URL_CERIMONIA}}',
  },
  reception: {
    title: 'Recepção',
    time: '{{HORA_RECEPCAO}}',
    place: '{{LOCAL_RECEPCAO}}',
    address: '{{ENDERECO_RECEPCAO}}',
    mapsUrl: '{{GOOGLE_MAPS_URL_RECEPCAO}}',
    mapsEmbedUrl: '{{GOOGLE_MAPS_EMBED_URL_RECEPCAO}}',
  },
  // Prazo final para confirmar presença (texto exibido no RSVP).
  rsvpDeadline: '{{PRAZO_RSVP}}',
  contactEmail: '{{EMAIL_CONTATO}}',
  // Parágrafos da seção "Sobre o Casal" (Nossa história). Um parágrafo por item.
  story: [
    '{{HISTORIA_PARAGRAFO_1}}',
    '{{HISTORIA_PARAGRAFO_2}}',
    '{{HISTORIA_PARAGRAFO_3}}',
  ],
} as const;

export type SiteConfig = typeof site;
