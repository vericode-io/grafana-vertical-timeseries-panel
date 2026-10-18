# Vertical Time Series

A página do repositório, em inglês, está em [README.md](../README.md). Este arquivo é o guia em português.

Painel do Grafana para gráfico vertical **N:1**: várias métricas na horizontal contra uma referência comum na vertical (tempo, profundidade, perfil de poço, log geológico). O id é `vericode-verticaltimeseries-panel`. O nome no Grafana é **Vertical Time Series**. Exige Grafana 10.4.0 ou mais novo e ainda não tem assinatura.

É um fork parcial do **XY Chart** nativo (base v10.x, licença Apache 2.0). O desenho continua no **uPlot** / Canvas. Overrides de cor, estilo de linha, unidade, escala (linear, logarítmica, simétrica) e inversão de valores continuam os do Grafana. O que saiu foi a camada de UI e o trecho do motor que quebrava esse layout.

## Por que o XY Chart nativo não serve

O nativo foi feito para **1:N** (um X, vários Y). No layout invertido aparecem três bloqueios.

1. **Tooltip.** Em `scatter.ts`, o índice espacial (Quadtree) só era alimentado dentro de `if (showPoints)`. Em gráfico só de linhas, o cursor não acha ponto e o tooltip não abre.
2. **Legenda.** A `VizLegend` filtra pelo nome do campo Y. Todas as curvas compartilham o mesmo Y (tempo ou profundidade), então um clique some com todas.
3. **Eixos.** Label e placement saíam do primeiro campo e se repetiam no X e no Y. Um rótulo no eixo vertical aparecia também nas métricas.

Arquivos do nativo que motivaram o fork: `scatter.ts` (tooltip), `XYChartPanel.tsx` (legenda), `utils.ts` / `prepSeries` (dados pensados para 1:N), `SeriesEditor.tsx` (matchers) e `config.ts` (overrides, reaproveitado).

## O que este plugin faz

O Quadtree é alimentado sempre. Só o desenho do ponto fica condicionado a `showPoints`. O tooltip abre em linha, ponto ou os dois, e usa o `display()` do campo, então o override de casas decimais vale no valor da métrica e no tempo.

A `CustomLegend` esconde série pelo índice no uPlot (`setSeries`), não pelo nome do campo Y. Clique no **nome** isola a curva; o segundo clique nessa mesma curva devolve as outras. Ctrl (ou Cmd) alterna só a curva clicada. Clique na **cor** abre o seletor e grava a cor fixa da série, sem isolar. O marcador é um traço, no padrão do Time series.

O modo **Auto** lê cada frame da consulta. O campo do tipo tempo vira o eixo vertical esteja onde estiver; as outras colunas numéricas são as métricas. Sem campo de tempo, a primeira coluna assume o eixo vertical. Random Walk com várias séries e CSV largo entram sem Merge. O OpenHistorian manda a métrica primeiro e o `Time` depois, uma série por frame: desenha direto, sem Merge e sem Prepare time series.

O modo **Manual** usa o `ManualSeriesEditor`: cada série é um par explícito Y (vertical) e X (horizontal), no lugar dos matchers do nativo.

Left, Right e Hidden movem só o eixo do tempo. As métricas ficam embaixo. Hidden esconde o tempo e mantém as métricas. Rótulo, unidade e decimais continuam nos overrides do campo.

## Peças

O `VerticalXYPanel.tsx` junta os dados e a UI. No Auto, percorre `data.series` e monta as `XYSeries`. No Manual, lê os pares do editor. Guarda o tooltip e o índice das séries escondidas.

O `scatter.ts` exporta o `prepConfig`, fork do motor nativo: Quadtree sempre ativo, eixo X fixo embaixo, eixo Y (tempo) à esquerda, à direita ou oculto. O `CustomTooltip.tsx` desenha o balão com a posição que o uPlot manda. A `CustomLegend.tsx` e o `ManualSeriesEditor.tsx` substituem a legenda e o editor nativos.

## Instalação

Na raiz, `npm install` e `npm run build` geram `dist/`. A pasta instalada no Grafana tem de se chamar `vericode-verticaltimeseries-panel` e conter `plugin.json` e `module.js`.

No servidor:

```bash
sudo cp -r dist /var/lib/grafana/plugins/vericode-verticaltimeseries-panel
```

```ini
[plugins]
allow_loading_unsigned_plugins = vericode-verticaltimeseries-panel
```

```bash
sudo systemctl restart grafana-server
```

Se aparecer "Plugin not signed", o id não está na lista ou o serviço não foi reiniciado.

`npm run server` sobe o Grafana do `docker-compose.yaml` da raiz. Para um Grafana à parte, depois do build:

```powershell
docker run -d --name grafana-plugin-test -p 3001:3000 -e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=vericode-verticaltimeseries-panel -v "${PWD}\dist:/var/lib/grafana/plugins/vericode-verticaltimeseries-panel" grafana/grafana:12.2.1
```

Os dashboards de exemplo estão em `provisioning/dashboards/`: o de samples e o `openhistorian.json`, com o plugin atual, o plugin anterior e o Time series lado a lado.

## Como usar

Adicione o painel **Vertical Time Series**.

No **Auto**, a consulta já vira o gráfico. Várias séries em frames separados ou várias colunas numéricas no mesmo frame entram juntas.

No **Manual**, em **XY Chart > Series mapping**, escolha **Manual**, clique em **Add series** e preencha o Y (referência vertical, por exemplo tempo ou profundidade) e o X (uma métrica). Repita para cada curva.

Para o rótulo do tempo, use um override pelo nome do campo de tempo e preencha **Axis > Label**. Left, Right e Hidden desse override, e o placement do painel, mexem no eixo vertical. Não use o placement para mandar a métrica para o lado: o eixo das métricas permanece embaixo.

## Licença

Apache License 2.0. Baseado no Grafana XY Chart.
