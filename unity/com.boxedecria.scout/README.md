# BOXE DE CRIA · SCOUT Unity Client

Cliente Unity 6 do **SCOUT DE CRIA / RAIO-X SUPREMO**. O package não gera dados de atletas e não possui credenciais privilegiadas: ele lê somente dossiês públicos `status=approved` do Supabase e aplica novamente o gate de evidência no cliente.

## Instalação

No Unity Package Manager, use **Add package from git URL** apontando para este repositório e subpasta:

`https://github.com/ringuemkt-rgb/regra-na-mao-boxe.git?path=/unity/com.boxedecria.scout#feat/scout-unity-client`

Depois execute:

`Tools > BOXE DE CRIA > Install Scout HUD in Current Scene`

O instalador cria:
- `Assets/ScoutDeCria/ScoutPanelSettings.asset`
- `Assets/ScoutDeCria/ScoutClientConfig.asset`
- GameObject `SCOUT_DE_CRIA_HUD` com `UIDocument` e `ScoutHudController`

## Configuração

No `ScoutClientConfig`:

- `apiBaseUrl`: URL pública do projeto Supabase, por exemplo `https://<project>.supabase.co`
- `publicAnonKey`: apenas a chave pública/anon compatível com RLS
- **Nunca** use service-role, segredo de worker ou token administrativo em Unity.

A API utilizada é o REST público do Supabase e sempre inclui `status=eq.approved`. A RLS do banco é a barreira principal; o gate Unity é defesa adicional.

## Fluxo

```text
Supabase / scout_dossiers
        ↓ RLS approved only
ScoutApiClient
        ↓
EvidenceGate (90% supported + fontes válidas)
        ↓
Command Center
        ├─ Dossiê
        ├─ Métricas derivadas
        └─ Face-Off
```

## Face-Off

O Face-Off é **descritivo**:
- mesma modalidade;
- mesma chave de métrica;
- mesma unidade;
- confiança mínima herdada das duas métricas;
- mostra cobertura e limitações;
- não calcula probabilidade de vitória;
- não produz recomendação de aposta.

## 3D

`ScoutArenaBackdrop` cria opcionalmente um palco procedural de análise (piso, ringue, postes, cordas e câmera). Ele não cria atleta fictício nem silhueta que possa ser confundida com uma pessoa real.

## Testes e auditoria

O package inclui testes de Editor para:
- claim sem suporte bloqueia publicação;
- Face-Off entre modalidades diferentes é bloqueado;
- apenas métricas com mesma chave/unidade são comparadas.

No repositório, `node scripts/unity-scout-audit.mjs` valida a estrutura e procura segredos/anti-padrões no cliente.

## Limites atuais

- Este package é o **cliente visual**. Coleta, entity resolution, triangulação e geração continuam server-side.
- O catálogo público permanece vazio enquanto não existirem dossiês reais aprovados.
- O package não inclui modelos 3D de atletas, imagens licenciadas ou dados esportivos externos.
- Um build Unity real deve ser executado no Editor/CI Unity antes de release de loja.
