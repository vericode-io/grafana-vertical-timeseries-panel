# Vertical Time Series

Shared vertical axis for multiple metrics.

Vertical Time Series is a Grafana panel for plotting several metrics against one shared vertical axis. It is based on the Grafana XY Chart and is meant for cases where X is the measured value and Y is the common reference, such as depth or time.

The built-in XY Chart is built around one X and many Y values. In the opposite layout, its tooltip stops working for line-only series, and the legend hides every series at once because they share the same Y field. This panel keeps the tooltip and the legend working in that layout. The legend isolates one series at a time.

## Requirements

- Grafana 10.4.0 or later

## Installation

The plugin is not signed yet. Grafana will load it only if the plugin id is allowed.

1. Build the plugin with `npm install` and `npm run build`, or use an existing `dist` folder.
2. Copy that folder to the Grafana plugins directory and name it `vericode-verticaltimeseries-panel`. The folder must contain `plugin.json` and `module.js`.
3. Allow the unsigned plugin in `grafana.ini`:

```ini
[plugins]
allow_loading_unsigned_plugins = vericode-verticaltimeseries-panel
```

4. Restart Grafana.

On Docker, mount the built folder and set the same allow-list:

```yaml
environment:
  GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS: vericode-verticaltimeseries-panel
volumes:
  - ./dist:/var/lib/grafana/plugins/vericode-verticaltimeseries-panel
```

## Usage

1. Add a panel and choose **Vertical Time Series**.
2. In the panel options, under **XY Chart**, set **Series mapping** to **Manual**.
3. Click **Add series** and set each series:
   - **Y-Field (Vertical):** the shared reference, such as depth or time.
   - **X-Field (Horizontal):** one metric, such as a sensor reading.
4. Repeat for each metric that should share that vertical axis.

To keep axis titles from being duplicated, use field overrides:

- For the Y field, set **Axis > Placement** to **Left** and set the axis label.
- For the X fields, set **Axis > Placement** to **Bottom** and leave the axis label empty.

## License

Apache License 2.0. Based on the Grafana XY Chart.

Notes in Portuguese: [docs/README.md](docs/README.md).
