export type Category = {
  name: string;
  slug: string;
  description: string;
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  featured?: boolean;
  healthNotice?: string;
  summary: string[];
  sections: ArticleSection[];
  related: string[];
  product?: "corner" | "caminho" | "combo";
};

export const categories: Category[] = [
  { name: "Técnica e Treino", slug: "tecnica-e-treino", description: "Fundamentos, golpes, deslocamentos, defesa e construção do treino de boxe." },
  { name: "Saúde do Atleta", slug: "saude-do-atleta", description: "Conteúdo educacional sobre cuidado, prevenção, recuperação e limites do corpo no esporte de combate." },
  { name: "Equipamentos", slug: "equipamentos", description: "Guias práticos para escolher, usar e conservar luvas, bandagens e equipamentos de treino." },
  { name: "História e Cultura", slug: "historia-e-cultura", description: "Memória, personagens, escolas e cultura que formaram o boxe." },
  { name: "Formação de Treinadores", slug: "formacao-de-treinadores", description: "Didática, organização de aula, observação técnica e desenvolvimento de atletas." },
];

export const articles: Article[] = [
  {
    slug: "boxe-para-iniciantes",
    title: "Boxe para iniciantes: guia completo para começar com segurança",
    excerpt: "O que esperar das primeiras aulas, quais fundamentos aprender primeiro, equipamentos básicos e como construir evolução sem atropelar etapas.",
    category: "Técnica e Treino",
    categorySlug: "tecnica-e-treino",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    readTime: "9 min",
    featured: true,
    product: "caminho",
    summary: [
      "Aprenda primeiro base, guarda, deslocamento e jab antes de buscar combinações complexas.",
      "A qualidade da repetição vale mais do que treinar rápido sem controle.",
      "Luvas, bandagem e ambiente de treino adequado fazem parte da segurança, não são detalhes.",
      "Sparring não precisa ser a primeira etapa e deve ter objetivo, intensidade e supervisão definidos.",
    ],
    sections: [
      {
        id: "primeira-aula",
        title: "O que acontece na primeira aula de boxe",
        paragraphs: [
          "Uma boa primeira aula não precisa transformar o aluno em lutador em sessenta minutos. O objetivo inicial é apresentar a lógica do boxe: como ficar em equilíbrio, proteger-se, deslocar-se e golpear sem perder a própria organização.",
          "É comum começar com aquecimento, exercícios de coordenação, posição básica, guarda, deslocamentos simples e um ou dois golpes. O treinador também observa mobilidade, lateralidade, compreensão dos comandos e a capacidade do aluno de manter postura enquanto se movimenta.",
          "Quem chega pensando apenas em força costuma descobrir rápido que boxe depende de distância, tempo, equilíbrio e repetição. O soco aparece dentro de um sistema; não é um movimento isolado do braço.",
        ],
      },
      {
        id: "fundamentos",
        title: "Os fundamentos que devem vir primeiro",
        paragraphs: [
          "A base é a plataforma de tudo. Os pés precisam permitir atacar, defender e mudar de direção sem cruzar de forma desnecessária. A guarda organiza mãos, cotovelos, tronco e cabeça para que o atleta não precise se reconstruir depois de cada movimento.",
          "O jab costuma ser um dos primeiros golpes ensinados porque ajuda a aprender alcance, retorno da mão, coordenação entre base e braço e leitura da distância. Depois dele entram diretos, combinações simples, defesas e respostas progressivamente mais complexas.",
        ],
        bullets: ["Base e equilíbrio", "Guarda e postura", "Deslocamento para frente, trás e laterais", "Jab e retorno da mão", "Noções de distância e defesa"],
      },
      {
        id: "equipamentos",
        title: "Equipamentos básicos para começar",
        paragraphs: [
          "No início, o aluno não precisa comprar tudo. A academia deve informar quais equipamentos são necessários para cada fase. Em geral, bandagem e luvas adequadas ao tipo de treino aparecem cedo na rotina; protetor bucal passa a ser indispensável quando existe contato controlado.",
          "Luvas não devem ser escolhidas apenas pela cor ou pelo peso corporal do atleta. O uso pretendido, o formato da mão, o tipo de enchimento, o espaço interno e as regras da academia importam. Para sparring, a orientação do treinador deve prevalecer.",
        ],
      },
      {
        id: "rotina",
        title: "Como evoluir sem atropelar etapas",
        paragraphs: [
          "Treinar duas ou três vezes por semana com consistência costuma ensinar mais do que alternar semanas de excesso com longas pausas. O iniciante se beneficia de repetir poucos elementos com atenção: base, guarda, deslocamento, jab, direto e defesa simples.",
          "Filmar alguns exercícios, quando a academia permitir, pode ajudar a comparar sensação e execução. O espelho também é útil no shadowboxing, desde que o aluno não transforme o exercício em sequência rápida sem objetivo.",
        ],
        bullets: ["Escolha um ou dois focos técnicos por sessão", "Repita devagar antes de aumentar velocidade", "Peça feedback específico ao treinador", "Registre dúvidas para revisar na aula seguinte"],
      },
      {
        id: "sparring",
        title: "Quando o sparring entra",
        paragraphs: [
          "Sparring é ferramenta de aprendizagem, não prova de coragem. Ele deve aparecer quando o treinador entende que o aluno consegue manter controle básico, compreender comandos e respeitar a intensidade combinada.",
          "Um bom sparring pode ter regras específicas: trabalhar apenas jab, limitar potência, usar determinados alvos ou focar defesa. Quanto mais claro o objetivo, menor a chance de a sessão virar troca desorganizada.",
        ],
      },
      {
        id: "erros",
        title: "Erros comuns de quem está começando",
        bullets: ["Tentar socar forte antes de aprender a voltar à guarda", "Prender a respiração durante combinações", "Cruzar os pés sem necessidade", "Olhar apenas para as luvas do parceiro", "Querer aprender muitas técnicas ao mesmo tempo", "Confundir cansaço extremo com treino de qualidade"],
        paragraphs: ["A evolução do iniciante é mais rápida quando ele aceita fazer o básico bem feito. Técnica consistente cria liberdade depois; pressa costuma criar vícios que precisam ser corrigidos."],
      },
    ],
    related: ["guarda-e-base-no-boxe", "como-fazer-jab-no-boxe", "como-escolher-luva-de-boxe"],
  },
  {
    slug: "como-escolher-luva-de-boxe",
    title: "Como escolher luvas de boxe: tamanho, peso e uso correto",
    excerpt: "Entenda o que significa oz, por que a finalidade da luva importa e quais pontos observar antes de comprar seu primeiro par.",
    category: "Equipamentos",
    categorySlug: "equipamentos",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    readTime: "8 min",
    product: "caminho",
    summary: [
      "O número em oz indica o peso da luva, não uma equivalência automática com o peso corporal do atleta.",
      "Saco, manopla e sparring podem exigir características diferentes.",
      "Ajuste, suporte do punho, volume interno e distribuição do enchimento são tão importantes quanto a etiqueta.",
      "Para sparring, siga a regra da academia e do treinador responsável.",
    ],
    sections: [
      { id: "oz", title: "O que significa oz na luva de boxe", paragraphs: ["Oz é a abreviação de ounce, unidade de peso. Em luvas de boxe, 10 oz, 12 oz, 14 oz ou 16 oz descrevem o peso nominal da luva, mas não contam toda a história sobre tamanho interno, formato ou densidade do enchimento.", "Duas luvas de 14 oz podem vestir de maneira diferente. Modelagem, material, distribuição de espuma e sistema de fechamento mudam a sensação na mão. Por isso, tabelas genéricas que relacionam apenas peso corporal e onças devem ser tratadas como ponto de partida, não como regra universal."] },
      { id: "finalidade", title: "Escolha pela finalidade do treino", bullets: ["Saco: procure estabilidade, bom encaixe e proteção adequada para o volume de golpes.", "Manopla: mobilidade e feedback do impacto podem ser relevantes, sem sacrificar segurança.", "Treino geral: modelos versáteis costumam funcionar bem para iniciantes.", "Sparring: use o peso e o modelo aceitos pela academia; proteção do parceiro também é parte da escolha."], paragraphs: ["Uma única luva pode servir para mais de uma tarefa, especialmente no início, mas atletas que treinam com frequência tendem a perceber vantagem em separar luvas de saco e de sparring para preservar enchimento e higiene."] },
      { id: "ajuste", title: "Como saber se a luva veste bem", paragraphs: ["Com a bandagem que você normalmente usa, a mão deve entrar sem compressão dolorosa. Os dedos precisam ficar acomodados, o polegar não deve ser forçado e o punho precisa sentir suporte sem perder circulação.", "Feche a mão dentro da luva e observe se a posição parece natural. Uma luva grande demais pode fazer a mão deslizar; apertada demais pode gerar dormência e desconforto."] },
      { id: "fechamento", title: "Velcro ou cadarço", paragraphs: ["Velcro é prático para treino diário porque o atleta consegue colocar e retirar a luva com pouca ajuda. Cadarço oferece ajuste mais uniforme em muitos modelos, mas normalmente exige outra pessoa para fechar e proteger a região do laço antes do contato."] },
      { id: "conservacao", title: "Como aumentar a vida útil", bullets: ["Abra a luva depois do treino e deixe secar em local ventilado", "Não guarde molhada dentro da mochila", "Limpe a superfície conforme orientação do fabricante", "Evite usar luva de sparring no saco quando quiser preservar o enchimento", "Troque a luva quando o enchimento perder integridade ou o suporte estiver comprometido"] },
      { id: "checklist", title: "Checklist antes da compra", bullets: ["Para qual treino vou usar?", "Minha academia exige determinada faixa de oz?", "Cabe minha mão com bandagem?", "O punho fica estável?", "Consigo fechar a mão naturalmente?", "Material e costuras parecem consistentes?", "Existe política de troca caso o ajuste não sirva?"] },
    ],
    related: ["boxe-para-iniciantes", "como-colocar-bandagem-de-boxe", "como-fazer-jab-no-boxe"],
  },
  {
    slug: "como-colocar-bandagem-de-boxe",
    title: "Como colocar bandagem de boxe: passo a passo e cuidados com mãos e punhos",
    excerpt: "Princípios para envolver mãos e punhos sem apertar demais, limitar a circulação ou criar falsa sensação de proteção total.",
    category: "Saúde do Atleta",
    categorySlug: "saude-do-atleta",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    readTime: "9 min",
    product: "corner",
    healthNotice: "Conteúdo educacional. Bandagem não elimina o risco de lesões e este guia não substitui avaliação individual de fisioterapeuta, médico ou outro profissional habilitado quando houver dor, trauma, dormência, inchaço ou perda de função.",
    summary: ["A bandagem deve dar suporte sem bloquear circulação ou movimento útil dos dedos.", "Punho, metacarpos e região dos nós dos dedos precisam ser organizados como conjunto.", "Não existe uma única técnica correta para todas as mãos, bandagens e objetivos.", "Dor, dormência, mudança de cor ou formigamento exigem retirada e nova avaliação do ajuste."],
    sections: [
      { id: "objetivo", title: "Para que serve a bandagem", paragraphs: ["A bandagem ajuda a organizar a mão dentro da luva, oferece suporte ao punho e distribui parte das cargas entre tecidos e superfícies. Ela também reduz atrito direto e ajuda a manter a mão mais estável durante repetições de impacto.", "Isso não significa que uma bandagem bem feita torne qualquer golpe seguro. Técnica, equipamento, progressão de carga, recuperação e condição individual continuam importando."] },
      { id: "antes", title: "Antes de começar", bullets: ["Use bandagem limpa e íntegra", "Retire anéis, pulseiras e objetos", "Observe cortes, inchaço ou dor antes de envolver a mão", "Mantenha os dedos relaxados e abertos durante boa parte do processo", "Teste a bandagem dentro da luva que será usada"] },
      { id: "passo-a-passo", title: "Sequência prática de referência", paragraphs: ["Uma sequência comum começa ancorando a bandagem no punho, segue para a região dos nós dos dedos, retorna ao punho e cria passagens que ajudam a organizar metacarpos e espaços entre os dedos. O polegar pode receber uma volta de suporte conforme a técnica adotada.", "A cada etapa, espalhe o tecido sem criar cordões ou dobras grossas. O objetivo é distribuir tensão. Termine no punho, fixe o velcro e então feche e abra a mão algumas vezes."], bullets: ["1. Ancore no punho com tensão leve a moderada", "2. Suba para a região dos nós dos dedos sem comprimir excessivamente", "3. Retorne ao punho para criar base", "4. Faça passagens entre dedos conforme comprimento e técnica", "5. Organize polegar sem puxá-lo para posição desconfortável", "6. Reforce metacarpos/nós e finalize no punho", "7. Teste fechamento da mão, cor, sensibilidade e conforto"] },
      { id: "aperto", title: "Como saber se ficou apertada demais", paragraphs: ["A mão não deve ficar dormente, fria, arroxeada ou com formigamento. O atleta deve conseguir abrir e fechar os dedos sem sensação de bloqueio. Se esses sinais aparecerem, retire a bandagem e refaça com menos tensão."], bullets: ["Formigamento", "Dormência", "Mudança de cor", "Dor pulsante", "Inchaço progressivo", "Dificuldade incomum para fechar ou abrir a mão"] },
      { id: "erros", title: "Erros comuns", bullets: ["Puxar cada volta com força máxima", "Criar muitas camadas grossas na palma", "Deixar dobras que pressionam dentro da luva", "Ignorar dor pré-existente", "Usar bandagem úmida ou suja repetidamente", "Acreditar que bandagem compensa técnica de golpe inadequada"] },
      { id: "quando-procurar", title: "Quando interromper o treino e buscar avaliação", paragraphs: ["Dor forte após impacto, deformidade, incapacidade de mover um dedo, perda de força, inchaço importante, dormência persistente ou piora progressiva merecem avaliação profissional. Continuar golpeando para “testar” a mão pode agravar uma lesão." ] },
    ],
    related: ["como-escolher-luva-de-boxe", "boxe-para-iniciantes", "como-fazer-jab-no-boxe"],
  },
  {
    slug: "guarda-e-base-no-boxe",
    title: "Guarda e base no boxe: equilíbrio para atacar e defender",
    excerpt: "Como organizar pés, quadril, tronco, mãos e cabeça para se movimentar sem perder capacidade de golpear ou defender.",
    category: "Técnica e Treino",
    categorySlug: "tecnica-e-treino",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    readTime: "8 min",
    product: "caminho",
    summary: ["A base deve permitir movimento em várias direções sem reconstrução a cada passo.", "A guarda não é pose estática; ela muda com distância, tarefa e estilo.", "Peso excessivo na frente ou atrás limita respostas e equilíbrio.", "Treinar base devagar no shadowboxing costuma revelar erros que desaparecem quando se tenta fazer tudo rápido."],
    sections: [
      { id: "base", title: "O que é a base no boxe", paragraphs: ["Base é a relação entre seus pés, centro de massa e direção de movimento. Ela precisa oferecer estabilidade suficiente para produzir força e liberdade suficiente para mudar de posição.", "Não existe distância milimétrica universal entre os pés. Estrutura corporal, mobilidade, estilo e tarefa influenciam. A referência útil é funcional: você deve conseguir avançar, recuar, girar e defender sem cruzar ou colar os pés desnecessariamente."] },
      { id: "pes", title: "Posição dos pés e distribuição de peso", paragraphs: ["Em postura convencional, o pé da frente aponta mais para o alvo e o de trás fica ligeiramente aberto. Os joelhos permanecem desbloqueados. O peso deve permitir resposta imediata, evitando ficar totalmente sentado atrás ou projetado sobre a perna da frente."], bullets: ["Pés afastados o suficiente para estabilidade, sem abrir a base em excesso", "Calcanhar traseiro pode permanecer disponível para pivôs", "Joelhos soltos", "Centro organizado entre as pernas", "Passos curtos mantêm capacidade de resposta"] },
      { id: "guarda", title: "Como organizar a guarda", paragraphs: ["A mão da frente trabalha perto da linha de ataque e a de trás protege regiões centrais enquanto permanece pronta para golpear. Cotovelos não precisam ficar colados de forma artificial, mas devem proteger o tronco e permitir trajetória eficiente.", "O queixo costuma ficar discretamente recolhido. Os olhos permanecem no adversário, não nas próprias luvas. Ombros e tronco ajudam a reduzir alvos sem criar tensão excessiva."] },
      { id: "movimento", title: "Mover sem desmontar", paragraphs: ["Ao deslocar, evite passos tão grandes que os pés precisem se encontrar. Uma referência simples é mover primeiro o pé da direção para a qual você vai e deixar o outro recuperar a distância da base.", "Em pivôs, o objetivo é mudar ângulo mantendo possibilidade de golpear ou sair. Girar apenas o tronco sem reposicionar os pés pode deixar o corpo travado." ] },
      { id: "erros", title: "Erros frequentes", bullets: ["Base estreita demais", "Base larga demais", "Cruzar os pés durante deslocamento simples", "Ficar nas pontas dos pés o tempo todo", "Levantar o queixo ao atacar", "Baixar a mão oposta quando golpeia", "Congelar a guarda e perder mobilidade"] },
      { id: "drills", title: "Exercícios simples", bullets: ["Shadowboxing apenas com deslocamento e guarda por 2 minutos", "Jab avançando e recuando sem mudar altura do corpo", "Passos laterais entre duas linhas no chão", "Pivô de 45 a 90 graus após jab", "Round lento filmado para observar distância entre os pés"] },
    ],
    related: ["boxe-para-iniciantes", "como-fazer-jab-no-boxe", "como-escolher-luva-de-boxe"],
  },
  {
    slug: "como-fazer-jab-no-boxe",
    title: "Como fazer o jab no boxe: técnica, erros e exercícios",
    excerpt: "Um guia para entender alinhamento, distância, retorno da mão e como usar o jab para construir o restante do seu boxe.",
    category: "Técnica e Treino",
    categorySlug: "tecnica-e-treino",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-11",
    readTime: "9 min",
    product: "caminho",
    summary: ["O jab começa na posição e na distância, não apenas no braço.", "A mão deve voltar com organização tão rápido quanto saiu.", "Não é necessário transformar todo jab em golpe máximo; ele também mede, interrompe, prepara e cria reação.", "Treinar lento com alvo definido melhora precisão antes de buscar velocidade."],
    sections: [
      { id: "funcao", title: "Por que o jab é tão importante", paragraphs: ["O jab é uma ferramenta de ataque, defesa e leitura. Ele pode marcar distância, interromper avanço, esconder o direto, provocar uma reação, pontuar ou simplesmente ocupar a visão do adversário.", "Por isso, aprender jab não é decorar um movimento único. O mesmo gesto muda de intenção conforme distância, ritmo e alvo." ] },
      { id: "mecanica", title: "Mecânica básica do jab", paragraphs: ["Parta de uma base estável e guarda organizada. A mão da frente percorre uma linha eficiente até o alvo enquanto o ombro acompanha o movimento e ajuda a proteger o queixo. A extensão não deve arrancar o corpo da base.", "No contato, mantenha o punho alinhado e evite deixar o cotovelo abrir cedo demais. Depois do golpe, a mão retorna diretamente para a guarda. O retorno lento cria uma janela maior para contra-ataques."], bullets: ["Olhos no alvo/adversário", "Ombros sem tensão desnecessária", "Extensão direta", "Punho alinhado", "Mão oposta protegendo", "Retorno imediato", "Base pronta para próximo movimento"] },
      { id: "base", title: "O que os pés fazem", paragraphs: ["Um jab parado pode ser treinado para coordenação, mas no boxe real ele frequentemente acompanha ajustes de distância. Ao avançar, o pé da frente pode iniciar um passo curto enquanto o jab ocupa o espaço, e o pé de trás recupera a base.", "Evite projetar a cabeça muito à frente do joelho ou transformar o jab em mergulho. A base deve continuar disponível para recuar, defender ou conectar outro golpe." ] },
      { id: "erros", title: "Erros comuns no jab", bullets: ["Telegravar puxando a mão para trás antes de sair", "Abrir o cotovelo cedo", "Levantar o queixo", "Baixar a mão de trás", "Demorar para retornar", "Inclinar o corpo além da base", "Golpear sempre no mesmo ritmo", "Prender a respiração"] },
      { id: "drills", title: "Exercícios para melhorar", bullets: ["Jab lento no espelho: 3 rounds de 1 minuto", "Jab no alvo pequeno da manopla, priorizando precisão", "Jab avançando e recuando", "Duplo jab sem aumentar desnecessariamente a passada", "Jab + saída lateral", "Round de shadowboxing usando apenas jab e deslocamento"] },
      { id: "tatica", title: "Aplicações táticas básicas", paragraphs: ["Use o jab para perguntar e observar a resposta. O adversário bloqueia? recua? tenta contra-atacar por cima? Depois de algumas repetições, essa reação pode orientar sua próxima escolha.", "Variar alvo, ritmo e distância costuma ser mais útil do que tentar acelerar todos os jabs. Um jab leve pode abrir caminho para um golpe forte; um jab firme pode interromper entrada; um jab no corpo pode mudar a altura da defesa." ] },
    ],
    related: ["guarda-e-base-no-boxe", "boxe-para-iniciantes", "como-escolher-luva-de-boxe"],
  },
];

export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getCategoryArticles = (slug: string) => articles.filter((article) => article.categorySlug === slug);
