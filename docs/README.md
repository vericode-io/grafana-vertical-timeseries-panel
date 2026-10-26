# Vertical Time Series

Guia em português. A página curta do repositório (inglês, estilo catálogo Grafana) está em [README.md](../README.md).

## O que é

Painel Grafana para gráfico **N:1**: várias métricas no eixo horizontal contra **uma referência comum** no eixo vertical (tempo, profundidade, perfil de poço, etc.).

- **Id:** `vericode-verticaltimeseries-panel`
- **Nome no Grafana:** Vertical Time Series
- **Grafana:** 12.0.0 ou mais novo
- **Licença:** Apache 2.0 (baseado no XY Chart)

Ainda sem assinatura: o Grafana só carrega se o id estiver no allow-list de plugins unsigned.

## Por que existe

O **XY Chart** nativo é **1:N** (um X, vários Y). No layout invertido (métrica em X, tempo/profundidade em Y) aparecem problemas:

| Problema | No nativo | Neste painel |
| --- | --- | --- |
| Tooltip em série só de linhas | Não acha ponto (Quadtree só com `showPoints`) | Quadtree sempre ativo; tooltip funciona |
| Legenda | Filtra pelo nome do campo Y compartilhado → some tudo | Isola por índice no uPlot (uma curva por vez) |
| Eixos | Labels/placement se repetem entre X e Y | Tempo/referência no vertical; métricas embaixo |

Também há modo **Auto** pensado em formatos como Random Walk, CSV largo e **OpenHistorian** (métrica + `Time` por frame), sem precisar de Merge.

## Como funciona (visão geral)

1. **Auto** — cada frame da consulta vira série(s). Campo de tempo → eixo vertical; demais colunas numéricas → métricas. Sem tempo, a primeira coluna assume o vertical.
2. **Manual** — cada série é um par explícito: Y (referência) + X (métrica), no editor **Add series**.
3. **Legenda** — clique no nome isola a curva; segundo clique restaura. Ctrl/Cmd alterna só aquela curva. Clique na cor abre o seletor.
4. **Tooltip** — usa `display()` do campo (overrides de decimais, unidade, etc. valem).

Motor de desenho: **uPlot** (fork parcial do `scatter` / XY Chart).

## Instalação

### Desenvolvimento local

```bash
npm install
npm run build
npm run server
```

Grafana de demo em http://localhost:3001 — login **admin / admin**. Os samples vêm de `provisioning/dashboards/dashboard.json` (inclui exemplos Auto, Manual e formato OpenHistorian).

### Em um Grafana existente

1. Gere `dist/` com `npm run build`.
2. Copie para o diretório de plugins com o nome do id:

```bash
cp -r dist /var/lib/grafana/plugins/vericode-verticaltimeseries-panel
```

3. Em `grafana.ini`:

```ini
[plugins]
allow_loading_unsigned_plugins = vericode-verticaltimeseries-panel
```

4. Reinicie o Grafana.

No Docker, monte `dist` e defina `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=vericode-verticaltimeseries-panel`.

## Como usar

1. Adicione o painel **Vertical Time Series**.
2. **Auto:** deixe a consulta; o gráfico monta sozinho se houver tempo + números (ou várias frames).
3. **Manual:** em **Series mapping → Manual**, **Add series** e escolha Y (vertical) e X (métrica) para cada curva.
4. Ajustes de cor, unidade, decimais e escala: **field overrides** do Grafana, como no Time series / XY Chart.
5. Eixo da referência (tempo): override no campo de tempo → **Axis > Label / Placement** (Left, Right, Hidden). As métricas ficam no eixo de baixo.

## Demo provisionada

O dashboard **Samples Vertical Time Series** traz:

- Auto e Manual
- Caso com uma série com dados e outra sem
- Comparação lado a lado com o Time series nativo
- Pares no formato OpenHistorian (vertical + time series)

## Desenvolvimento (atalhos)

| Comando | Função |
| --- | --- |
| `npm run build` | Build de produção → `dist/` |
| `npm run dev` | Watch |
| `npm run typecheck` / `lint` / `test:ci` | Gates de CI |
| `npm run server` | Grafana 12 via Docker Compose |

## Licença

Apache License 2.0. Baseado no Grafana XY Chart.
