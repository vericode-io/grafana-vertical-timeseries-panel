import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { SeriesColorPicker, SeriesIcon, usePanelContext, useTheme2 } from '@grafana/ui';

interface LegendItemProps {
  name: string;
  color: string;
  originalIndex: number; // O índice original do 'xySeries'
}

interface Props {
  series: LegendItemProps[];
  onSeriesClick: (seriesIndex: number, event: React.MouseEvent) => void; // Callback para o 'VerticalXYPanel'
  isolatedIndex?: number | null; // Estado vindo do 'VerticalXYPanel'
  hiddenIndexes?: number[]; // Índices dos itens que estão ocultos
}

/**
 * ADIÇÃO: Este é o nosso componente de Legenda customizado.
 * Ele substitui o 'VizLegend' nativo para permitir a funcionalidade
 * de "clique para isolar" (show/hide).
 */
export const CustomLegend: React.FC<Props> = ({ 
  series, 
  onSeriesClick, 
  isolatedIndex, 
  hiddenIndexes = []
}) => {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const { onSeriesColorChange } = usePanelContext();

  return (
    <div className={styles.wrapper}>
      {series.map((item) => {
        const isHidden = hiddenIndexes.includes(item.originalIndex);

        return (
          <div key={item.originalIndex} className={styles.itemWrapper}>
            {onSeriesColorChange ? (
              <SeriesColorPicker
                color={item.color}
                enableNamedColors
                onChange={(color) => onSeriesColorChange(item.name, color)}
              >
                {({ ref, showColorPicker, hideColorPicker }) => (
                  <SeriesIcon
                    ref={ref}
                    className={styles.icon}
                    color={item.color}
                    onClick={(event) => {
                      event.stopPropagation();
                      showColorPicker();
                    }}
                    onMouseLeave={hideColorPicker}
                  />
                )}
              </SeriesColorPicker>
            ) : (
              <SeriesIcon className={styles.icon} color={item.color} />
            )}
            <span
              className={isHidden ? styles.labelInactive : styles.label}
              onClick={(event) => onSeriesClick(item.originalIndex, event)}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css`
    display: flex;
    padding: ${theme.spacing(1)};
    gap: ${theme.spacing(1)};
    wrap: true;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow-y: visible;
    height: 100%;
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.primary};
  `,
  itemWrapper: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    pointer-events: auto;
    flex-shrink: 0;
  `,
  icon: css`
    cursor: pointer;
  `,
  label: css`
    cursor: pointer;
    font-size: inherit;
    color: ${theme.colors.text.primary};
    white-space: nowrap;
  `,
  labelInactive: css`
    cursor: pointer;
    font-size: inherit;
    color: ${theme.colors.text.disabled};
    white-space: nowrap;
  `,
});
