/**
 * MANIFESTO — a unica fonte de verdade da pagina. Contrato 1.
 *
 * Menu, HUD, rotas, progresso, cena 3D e a suite de testes derivam DESTE
 * arquivo. Adicionar, remover ou reordenar uma cena aqui nao pode exigir
 * mudanca em nenhum outro modulo. Se exigir, o acoplamento e o bug.
 *
 * RITMO — extraido do video, nao inventado.
 * Fonte: "04828 - Video Febraban V5 - High Quality.mp4"
 *        1920x1080, 60fps, 256,216667s, h264 21Mbps, faixa de audio MUDA.
 *
 * Como os tempos foram medidos: o video e motion graphics com dissolves
 * suaves — deteccao de corte seco acha quase nada (4 cortes com limiar 0,08).
 * Entao o ritmo saiu da ENERGIA DE MUDANCA por frame (filtro scdet sobre os
 * 15.373 frames): cada card fica ~5,0s em repouso absoluto (score < 0,05)
 * separado por ~2,5s de transicao. Cadencia media de 7,7s por card.
 * `fonte.tIn`/`fonte.tOut` sao os segundos reais no video.
 */

import { PILLARS } from './brand.js'

/**
 * 'final'          — ordem, duracao e conteudo conferidos contra o video
 * 'real-sem-video' — conteudo real, ritmo ainda derivado da Mandala
 */
export const CONTENT_STATUS = 'final'

export const VIDEO_SOURCE = {
  arquivo: '04828 - Vídeo Febraban V5 - High Quality.mp4',
  duracaoS: 256.216667,
  largura: 1920,
  altura: 1080,
  fps: 60,
  temNarracao: false // faixa AAC presente, porem em silencio digital (-91 dB)
}

/** Layouts de card observados no video. */
export const LAYOUTS = {
  ABERTURA: 'abertura',
  INSTITUCIONAL: 'institucional',
  PILARES: 'pilares',
  MANDALA: 'mandala',
  TITULO_PILAR: 'titulo-pilar',
  SOLUCAO: 'solucao',
  CTA: 'cta',
  ENCERRAMENTO: 'encerramento'
}

export const SCENES = [
  // ─────────────────────────────────────────────────────────── abertura
  {
    id: 'abertura',
    layout: LAYOUTS.ABERTURA,
    pilar: null,
    titulo: 'Soluções Inteligentes para o setor Financeiro',
    subtitulo: 'Tecnologias para proteger operações, simplificar jornadas e acelerar a inovação',
    scene3d: 'campo-particulas',
    durationMs: 9700,
    fonte: { tIn: 0.0, tOut: 9.7 }
  },
  {
    /*
      Card institucional de fundo verde-limao — o unico da peca inteira.
      Ficou de fora da primeira leitura do ritmo porque a energia de mudanca
      nao cai entre a abertura e ele (a transicao e uma cortina animada, sem
      quadro em repouso no meio). Achado comparando frame a frame: a cor media
      do quadro vira verde entre 9,7s e 15,5s.
      Traz os unicos numeros institucionais da peca.
    */
    id: 'cpqd-em-numeros',
    layout: LAYOUTS.INSTITUCIONAL,
    pilar: null,
    titulo: 'O CPQD transforma desafios em soluções que conectam tecnologia, inovação e negócios, construindo uma trajetória marcada por grandes resultados.',
    tituloDestaque: ['CPQD', 'tecnologia, inovação e negócios', 'grandes resultados.'],
    chips: [
      { destaque: '+750', texto: 'CLIENTES ATENDIDOS POR NOSSAS SOLUÇÕES', icone: 'rede' },
      { destaque: '+2 MIL', texto: 'SOFTWARES REGISTRADOS E PROTEGIDOS', icone: 'software' },
      { texto: 'ATUAÇÃO NA AMÉRICA LATINA E EUROPA', icone: 'globo' },
      { rotulo: 'LINHAS DE NEGÓCIOS', lista: ['PRODUTOS E SERVIÇOS', 'PD&I', 'ENSAIOS E CERTIFICAÇÕES'], icone: 'mao-engrenagem' }
    ],
    scene3d: 'campo-lime',
    durationMs: 5800,
    fonte: { tIn: 9.7, tOut: 15.5 }
  },
  {
    id: 'quatro-pilares',
    layout: LAYOUTS.PILARES,
    pilar: null,
    titulo: 'Soluções e inovação para todo o ecossistema financeiro',
    tituloDestaque: 'ecossistema financeiro',
    subtitulo: 'Sua atuação se apoia em quatro pilares, ampliando a eficiência e preparando instituições para os desafios do futuro, além de gerar valor para toda a jornada do negócio.',
    scene3d: 'orbita-pilares',
    durationMs: 5900,
    fonte: { tIn: 15.5, tOut: 21.4 }
  },
  {
    id: 'mandala-abertura',
    layout: LAYOUTS.MANDALA,
    pilar: null,
    titulo: 'Ecossistema de Soluções',
    subtitulo: 'Toque em uma solução para explorar',
    scene3d: 'roda-mandala',
    durationMs: 21300,
    fonte: { tIn: 21.4, tOut: 42.7 }
  },

  // ────────────────────────────────────────────── pilar: Segurança Digital
  {
    id: 'pilar-seguranca-digital',
    layout: LAYOUTS.TITULO_PILAR,
    pilar: 'seguranca-digital',
    titulo: 'Segurança Digital',
    subtitulo: 'Protegendo dados, operações e negócios',
    scene3d: 'abertura-pilar',
    durationMs: 7800,
    fonte: { tIn: 42.7, tOut: 50.5 }
  },
  {
    id: 'teste-avaliacao-agentes-ia',
    coluna: 'esq',
    rotuloCurto: 'Teste e Avaliação de Agentes de IA',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Teste e Avaliação de Agentes de IA',
    icone: 'robo',
    chips: [
      { destaque: 'Confiabilidade', texto: 'Respostas precisas e consistentes' },
      { destaque: 'Segurança', texto: 'Proteção de dados e clientes' },
      { destaque: 'Controle', texto: 'Métricas antes da produção' }
    ],
    aplicacoes: ['Atendimento Digital', 'Risco', 'Segurança da Informação'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 50.5, tOut: 58.0 }
  },
  {
    id: 'pentests-agentes-ia',
    coluna: 'esq',
    rotuloCurto: '**Pentests** de Agentes de IA',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Pentests de Agentes de IA',
    icone: 'engrenagem-binario',
    chips: [
      { destaque: 'Proteção', texto: 'Agentes seguros contra ataques' },
      { destaque: 'Resiliência', texto: 'Menos riscos de invasões e fraudes' },
      { destaque: 'Prevenção', texto: 'Brechas antes da exploração' }
    ],
    aplicacoes: ['Segurança da Informação', 'Prevenção a Fraudes'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 58.0, tOut: 65.5 }
  },
  {
    id: 'escalabilidade-ia',
    coluna: 'esq',
    rotuloCurto: 'Escalabilidade de IA com Segurança e Privacidade',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Escalabilidade de IA com Segurança e Privacidade',
    icone: 'cerebro-chip',
    chips: [
      { destaque: 'Escala', texto: 'IA pronta para produção' },
      { destaque: 'Conformidade', texto: 'Privacidade e segurança por design' },
      { destaque: 'Governança', texto: 'Menos riscos e retrabalho' }
    ],
    aplicacoes: ['Segurança da Informação', 'Tecnologia', 'Engenharia', 'Privacidade'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 65.5, tOut: 73.5 }
  },
  {
    id: 'ciberseguranca-resposta-incidentes',
    coluna: 'esq',
    rotuloCurto: 'Cibersegurança e Resposta a Incidentes',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Cibersegurança e Resposta a Incidentes',
    icone: 'escudo-chip',
    chips: [
      { destaque: 'Preparação', texto: 'Maior prontidão contra ataques' },
      { destaque: 'Agilidade', texto: 'Respostas mais rápidas' },
      { destaque: 'Continuidade', texto: 'Operações mais resilientes' }
    ],
    aplicacoes: ['Segurança da Informação', 'Continuidade de Negócios e Risco'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 73.5, tOut: 81.0 }
  },
  {
    id: 'credenciais-verificaveis',
    coluna: 'dir',
    rotuloCurto: 'Credenciais Verificáveis',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Credenciais Verificáveis',
    icone: 'documento-check',
    chips: [
      { destaque: 'Confiança', texto: 'Autenticidade e integridade dos dados' },
      { destaque: 'Agilidade', texto: 'Validações mais rápidas' },
      { destaque: 'Privacidade', texto: 'Dados compartilhados com segurança' }
    ],
    aplicacoes: ['Identidade Digital', 'Segurança da Informação', 'Compliance', 'Inovação e Arquitetura Corporativa'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 81.0, tOut: 89.0 }
  },
  {
    id: 'ensaios-pos',
    coluna: 'dir',
    rotuloCurto: 'Ensaios para POS',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Ensaios para POS e Meios de Pagamento',
    icone: 'pos',
    chips: [
      { rotulo: 'Atendemos', destaque: '90%', texto: 'das adquirentes' },
      { destaque: 'Pioneiros', texto: 'em processos de homologação' },
      { rotulo: 'Do POS à', destaque: 'Aplicação' }
    ],
    aplicacoes: ['Meios de Pagamento', 'Adquirência', 'Engenharia', 'Qualidade', 'Homologação', 'Segurança da Informação e Tecnologia'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 89.0, tOut: 96.5 }
  },
  {
    id: 'antifraude',
    coluna: 'dir',
    rotuloCurto: '**Antifraude:** Transacional, Pix e Adquirente',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Soluções Antifraude Transacional, Pix e Adquirente',
    icone: 'escudo-check',
    metrica: true,
    chips: [
      { rotulo: 'Transacional', destaque: '+8,4 bilhões', texto: 'de requisições/ano' },
      { rotulo: 'Pix', destaque: '+12 bilhões', texto: 'de requisições/ano' },
      { rotulo: 'Adquirentes', destaque: '+274,8 bilhões', texto: 'de requisições/ano' },
      { rotulo: 'Total de Requisições:', destaque: '+295,2', texto: 'bilhões/ano' }
    ],
    aplicacoes: ['Prevenção a Fraudes', 'Meios de Pagamento', 'Adquirência', 'Riscos', 'Segurança da Informação', 'Tecnologia', 'Inovação'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 96.5, tOut: 104.5 }
  },
  {
    id: 'monitoramento-pld-ft',
    coluna: 'dir',
    rotuloCurto: '**PLD/FT –** Prevenção à Lavagem de Dinheiro',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Monitoramento PLD/FT',
    icone: 'escudo-cifrao',
    chips: [
      { destaque: 'Conformidade', texto: 'Mais aderência regulatória' },
      { destaque: 'Eficiência', texto: 'Detecção e investigação automatizadas' },
      { destaque: 'Governança', texto: 'Mais controle e rastreabilidade' }
    ],
    aplicacoes: ['PLD/FT', 'Compliance', 'Riscos', 'Auditoria', 'Controles Internos', 'Tecnologia'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 104.5, tOut: 112.0 }
  },
  {
    id: 'criptografia-pos-quantica',
    coluna: 'dir',
    rotuloCurto: 'Criptografia Pós-Quântica',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'seguranca-digital',
    titulo: 'Criptografia Pós-Quântica',
    icone: 'atomo',
    chips: [
      { destaque: 'Proteção', texto: 'Dados resistentes à ameaça quântica' },
      { destaque: 'Prontidão', texto: 'Criptografia preparada para o futuro' },
      { destaque: 'Continuidade', texto: 'Negócios protegidos e resilientes' }
    ],
    aplicacoes: ['Segurança da Informação', 'Cibersegurança', 'Infraestrutura', 'Arquitetura de TI', 'Riscos', 'Compliance', 'Inovação'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 112.0, tOut: 120.0 }
  },
  {
    id: 'mandala-recap-1',
    layout: LAYOUTS.MANDALA,
    pilar: null,
    titulo: 'Ecossistema de Soluções',
    subtitulo: 'Segurança Digital concluída — toque para explorar ou siga',
    scene3d: 'roda-mandala',
    durationMs: 13000,
    fonte: { tIn: 120.0, tOut: 133.0 }
  },

  // ────────────────────────────────────────────── pilar: Confiança Digital
  {
    id: 'pilar-confianca-digital',
    layout: LAYOUTS.TITULO_PILAR,
    pilar: 'confianca-digital',
    titulo: 'Confiança Digital',
    subtitulo: 'Garantindo autenticidade em cada interação',
    scene3d: 'abertura-pilar',
    durationMs: 8500,
    fonte: { tIn: 133.0, tOut: 141.5 }
  },
  {
    id: 'identidade-digital',
    coluna: 'esq',
    rotuloCurto: 'Identidade Digital',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'confianca-digital',
    titulo: 'Identidade Digital',
    icone: 'cracha',
    metrica: true,
    chips: [
      { destaque: '35', unidade: 'milhões', texto: 'Potenciais usuários no ecossistema' },
      { destaque: '+300', unidade: 'milhões', texto: 'Credenciais habilitadas para emissão' },
      { destaque: '76%', unidade: 'redução', texto: 'Tempo médio de onboarding' }
    ],
    aplicacoes: ['Identidade Digital', 'Onboarding', 'Autenticação', 'Segurança da Informação', 'Experiência do Cliente', 'Compliance', 'Inovação', 'Transformação Digital'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 141.5, tOut: 149.0 }
  },
  {
    id: 'onboarding',
    coluna: 'esq',
    rotuloCurto: 'Onboarding',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'confianca-digital',
    titulo: 'Onboarding',
    icone: 'pessoas-ciclo',
    metrica: true,
    chips: [
      { destaque: '99%', texto: 'dos CPFs ativos no meio digital conhecidos' },
      { destaque: '+130', unidade: 'milhões', texto: 'de documentos verificados' },
      { destaque: '+900', unidade: 'milhões', texto: 'de telefones distintos conhecidos' }
    ],
    aplicacoes: ['Onboarding', 'Cadastro', 'Abertura de Contas', 'Prevenção a Fraudes', 'Compliance', 'Experiência do Cliente', 'Canais Digitais', 'Transformação Digital'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 149.0, tOut: 157.0 }
  },
  {
    id: 'solucoes-voz-ia',
    coluna: 'esq',
    rotuloCurto: 'Soluções de Voz com IA',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'confianca-digital',
    titulo: 'Soluções de Voz com IA',
    icone: 'onda-voz',
    chips: [
      { destaque: 'Eficiência', texto: 'Menos custos e mais agilidade' },
      { destaque: 'Experiência', texto: 'Jornadas mais naturais e personalizadas' },
      { destaque: 'Segurança', texto: 'Mais proteção contra fraudes' }
    ],
    aplicacoes: ['Prevenção a Fraudes', 'Meios de Pagamento', 'Operações', 'Riscos', 'Segurança da Informação', 'Tecnologia'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 157.0, tOut: 165.0 }
  },
  {
    id: 'mandala-recap-2',
    layout: LAYOUTS.MANDALA,
    pilar: null,
    titulo: 'Ecossistema de Soluções',
    subtitulo: 'Confiança Digital concluída — toque para explorar ou siga',
    scene3d: 'roda-mandala',
    durationMs: 12500,
    fonte: { tIn: 165.0, tOut: 177.5 }
  },

  // ──────────────────────────────────────── pilar: Operações Inteligentes
  {
    id: 'pilar-operacoes-inteligentes',
    layout: LAYOUTS.TITULO_PILAR,
    pilar: 'operacoes-inteligentes',
    titulo: 'Operações Inteligentes',
    subtitulo: 'Transformando dados em eficiência operacional',
    scene3d: 'abertura-pilar',
    durationMs: 9000,
    fonte: { tIn: 177.5, tOut: 186.5 }
  },
  {
    id: 'higienizacao-dados-cadastrais',
    coluna: 'dir',
    rotuloCurto: 'Higienização de Dados Cadastrais',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'operacoes-inteligentes',
    titulo: 'Higienização de Dados Cadastrais',
    icone: 'servidor-no',
    metrica: true,
    chips: [
      { destaque: '+100 mil', unidade: 'dados cadastrais', texto: 'normalizados' },
      { destaque: 'Incremento de 50%', texto: 'na qualidade do dado consultado' }
    ],
    aplicacoes: ['Cadastro', 'Onboarding de Clientes', 'Prevenção a Fraudes', 'Qualidade de Dados'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 186.5, tOut: 194.0 }
  },
  {
    id: 'ia-aplicada-negocio',
    coluna: 'dir',
    rotuloCurto: 'IA Aplicada ao Negócio',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'operacoes-inteligentes',
    titulo: 'IA Aplicada ao Negócio',
    icone: 'chip-ia',
    chips: [
      { rotulo: 'Mais de', destaque: '100', texto: 'projetos de IA' },
      { rotulo: 'Metodologia própria vinculando', destaque: 'resultado ao negócio' },
      { destaque: 'Governança', texto: 'de IA' }
    ],
    aplicacoes: ['Inovação', 'Tecnologia', 'Operações', 'Negócios', 'Atendimento', 'Indústria', 'Financeiro', 'Saúde', 'Telecomunicações', 'Setor Público'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 194.0, tOut: 201.5 }
  },
  {
    id: 'data-center-gerencia-planta',
    coluna: 'esq',
    rotuloCurto: '**Data Center –** Gerência da Planta',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'operacoes-inteligentes',
    titulo: 'Data Center\nGerência da Planta',
    icone: 'rack',
    chips: [
      { rotulo: 'Gestão de ativos em operadoras', destaque: 'nacionais e internacionais' },
      { destaque: 'Flexibilidade', texto: 'para inclusão de ativos de data centers' },
      { rotulo: 'Migração de dados em larga escala com', destaque: '99,9% de efetividade' }
    ],
    aplicacoes: ['Infraestrutura de TI', 'Operações de Data Center', 'Facilities', 'Redes', 'Operações Críticas', 'Cloud', 'Continuidade de Negócios', 'Gestão de Ativos'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 201.5, tOut: 209.5 }
  },
  {
    id: 'data-center-monitoramento',
    coluna: 'base',
    rotuloCurto: '**Data Center –** Monitoramento Inteligente',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'operacoes-inteligentes',
    titulo: 'Data Center\nMonitoramento Inteligente',
    icone: 'rack',
    metrica: true,
    chips: [
      { destaque: '22', texto: 'datacenters e', destaque2: '62', texto2: 'Availability Zones' },
      { destaque: '+1.600', texto: 'servidores monitorados' },
      { destaque: '+21 milhões', texto: 'de registros operacionais' },
      { destaque: '+150 mil', texto: 'análises executadas por IA' }
    ],
    aplicacoes: ['Infraestrutura de TI', 'Operações de Data Center', 'Facilities', 'Redes', 'Operações Críticas', 'Cloud', 'Continuidade de Negócios', 'Gestão de Ativos'],
    scene3d: 'aneis-card',
    durationMs: 7500,
    fonte: { tIn: 209.5, tOut: 217.0 }
  },
  {
    id: 'gestao-inteligente-pos',
    coluna: 'base',
    rotuloCurto: 'Gestão Inteligente de POS',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'operacoes-inteligentes',
    titulo: 'Gestão Inteligente de POS',
    icone: 'grafico',
    chips: [
      { rotulo: 'De', destaque: '30%', texto: 'a', destaque2: '40%', texto2: 'Menos custos logísticos' },
      { destaque: '+5% a 10%', texto: 'Potencial de aumento no TPV (Volume Total de Pagamentos)' },
      { destaque: 'Até 50%', texto: 'Redução no tempo de reparo' }
    ],
    aplicacoes: ['Adquirência', 'Meios de Pagamento', 'Gestão do Parque de POS', 'Monitoramento Operacional', 'Logística de Terminais', 'Gestão de ativos'],
    scene3d: 'aneis-card',
    durationMs: 8000,
    fonte: { tIn: 217.0, tOut: 225.0 }
  },
  {
    id: 'gestao-inadimplencia',
    coluna: 'dir',
    rotuloCurto: 'Gestão de Inadimplência',
    layout: LAYOUTS.SOLUCAO,
    pilar: 'operacoes-inteligentes',
    titulo: 'Gestão de Inadimplência',
    icone: 'cifrao',
    chips: [
      { destaque: 'Recuperação', texto: 'Mais receitas recuperadas' },
      { destaque: 'Eficiência', texto: 'Cobranças automatizadas e inteligentes' },
      { destaque: 'Precisão', texto: 'Ações no momento certo, para cada cliente' }
    ],
    aplicacoes: ['Financeiro', 'Crédito e Cobrança', 'Operações', 'Atendimento ao Cliente', 'Gerenciamento Grandes Volumes de Recebíveis'],
    scene3d: 'aneis-card',
    durationMs: 6500,
    fonte: { tIn: 225.0, tOut: 231.5 }
  },

  // ────────────────────────────────────────────────────────── encerramento
  {
    id: 'mandala-final',
    layout: LAYOUTS.MANDALA,
    pilar: null,
    titulo: 'Ecossistema de Soluções',
    subtitulo: 'Toque em qualquer solução para revisitar',
    scene3d: 'roda-mandala',
    durationMs: 14000,
    fonte: { tIn: 231.5, tOut: 245.5 }
  },
  {
    id: 'fale-com-especialistas',
    layout: LAYOUTS.CTA,
    pilar: null,
    titulo: 'Fale com os nossos Especialistas!',
    tituloDestaque: 'Especialistas!',
    subtitulo: 'Escaneie o QR Code e converse com um de nossos especialistas para conhecer as melhores soluções para o seu negócio.',
    subtituloDestaque: 'melhores soluções para o seu negócio.',
    scene3d: 'ondas-barras',
    durationMs: 6000,
    fonte: { tIn: 245.5, tOut: 251.5 }
  },
  {
    id: 'cpqd-50-anos',
    layout: LAYOUTS.ENCERRAMENTO,
    pilar: null,
    titulo: 'CPQD 50 anos',
    subtitulo: '',
    scene3d: 'selo-final',
    durationMs: 4700,
    fonte: { tIn: 251.5, tOut: 256.216667 }
  }
]

// ───────────────────────────────────────────────────── seletores derivados
// Tudo abaixo e funcao pura de SCENES. Nenhum modulo deve manter indice proprio.

export const sceneCount = () => SCENES.length
export const sceneAt = (i) => SCENES[clampIndex(i)]
export const sceneById = (id) => SCENES.find((s) => s.id === id) ?? null
export const indexOfScene = (id) => SCENES.findIndex((s) => s.id === id)
/**
 * Grampeia o indice. Trata nao-finito: `ir(NaN)` gravava NaN no estado, a
 * primeira view lancava e a excecao interrompia o laco de notificacao,
 * deixando HUD, menu, rota e palco dessincronizados PARA SEMPRE.
 */
export const clampIndex = (i) =>
  (Number.isFinite(i) ? Math.min(Math.max(Math.trunc(i), 0), SCENES.length - 1) : 0)

/** Duracao total, em ms — sempre igual ao video. */
export const totalDurationMs = () =>
  SCENES.reduce((soma, s) => soma + s.durationMs, 0)

/**
 * Rotulo da pilula na mandala. No video a roda usa nomes mais curtos que os
 * titulos dos cards ("Ensaios para POS" e nao "Ensaios para POS e Meios de
 * Pagamento"), alguns com negrito parcial marcado por **asteriscos**.
 */
export const rotuloMandala = (cena) => cena.rotuloCurto ?? cena.titulo

/**
 * Onde cada solucao fica na roda. A disposicao e a do video (8 a esquerda,
 * 8 a direita, o resto embaixo) — nao e ordem de leitura, e equilibrio visual.
 */
export const solucoesDaColuna = (col) => solutions().filter((s) => s.coluna === col)

/** Somente as solucoes: alimenta a mandala e o menu. */
export const solutions = () =>
  SCENES.filter((s) => s.layout === LAYOUTS.SOLUCAO)

/** Capitulos para o menu: pilar -> cenas, na ordem do video. */
export function chapters () {
  const porPilar = new Map()
  for (const s of SCENES) {
    if (!s.pilar) continue
    if (!porPilar.has(s.pilar)) porPilar.set(s.pilar, [])
    porPilar.get(s.pilar).push(s)
  }
  return [...porPilar.entries()].map(([id, cenas]) => ({
    pilar: PILLARS[id],
    cenas
  }))
}

/** Cenas fora de pilar (abertura, mandalas, CTA, encerramento). */
export const interludes = () => SCENES.filter((s) => !s.pilar)

/** Progresso 0..1 no fim da cena `i`, ponderado pela duracao real. */
export function progressAt (i) {
  const total = totalDurationMs()
  let acc = 0
  for (let k = 0; k <= clampIndex(i); k++) acc += SCENES[k].durationMs
  return acc / total
}

/** Instante inicial da cena `i` no video, em ms. */
export function startMsAt (i) {
  let acc = 0
  for (let k = 0; k < clampIndex(i); k++) acc += SCENES[k].durationMs
  return acc
}
