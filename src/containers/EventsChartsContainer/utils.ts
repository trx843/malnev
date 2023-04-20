import moment from "moment";
import { ControlMaintEvents } from "../../classes";
import { ControlResultsModel } from "../../classes/ControlMaintEvents";
import { CheckboxGroupOption } from "../../components/shared/CheckboxGroup";
import {
  ChartLinesLib,
  ChartLineStyle,
  TypeFilterParams,
} from "../../slices/eventsCharts";
import { highchartsDefaultOptions } from "./highcharts-default-options";

enum LinesTypes {
  Border = "border",
  Kmh = "Kmh",
  Verification = "verification",
}

interface ChartItem {
  name: string;
  data: number[][];
  dashStyle?: string;
  lineWidth?: number;
  color?: string;
}

const createSeriesItem = (
  name: string,
  data: number[][],
  type?: string,
  style?: ChartLineStyle
): ChartItem => {
  const item: ChartItem = {
    name,
    data,
    ...style,
  };

  if (type === LinesTypes.Border) {
    item.dashStyle = "longdash";
    item.lineWidth = 1;
  }

  if (type === LinesTypes.Kmh) {
    item.lineWidth = 1;
    item.dashStyle = "solid";
  }

  if (type === LinesTypes.Verification) {
    item.lineWidth = 2;
    item.dashStyle = "solid";
  }

  return item;
};

export const returnEventsChartsConfig = (
  events: ControlMaintEvents[],
  selectedEvents: string[],
  chartLinesLib: ChartLinesLib
) => {
  const bordersIds = selectedEvents
    .filter((event) => event.split("@")[0] === "border")
    .map((border) => border.split("@")[1]);

  if (!events.length) return highchartsDefaultOptions;

  const filteredEvents = events.filter(
    (event) =>
      selectedEvents.findIndex(
        (selectedEvent) => selectedEvent === event.id.toString()
      ) !== -1
  );

  const series: ChartItem[] = [];

  filteredEvents.forEach((event) => {
    let dataString = `${event.vis_avg?.toFixed(2) ?? "*"} мм²/с  ${event.dens_avg?.toFixed(2) ?? "*"
      } кг/м³ ${event.t_avg?.toFixed(2) ?? "*"} °C`;
    if (dataString.includes("*")) dataString += " (* - данные не заполнены)";
    const name = `${moment(event.factDate).format("DD.MM.YYYY")} ${event.eventType
      } ${dataString}`;
    const data = event.controlResults.map((result) => [Number(result.qj?.toFixed(2)), Number(result.kj?.toFixed(2))]); //[result.qj ? Number(result.qj.toFixed(2)) : 0, result.kj ? Number(result.kj.toFixed(2)): 0])
    const withBorders = bordersIds.findIndex((id) => id === event.id) !== -1;
    const type =
      event.eventType === TypeFilterParams.Kmh
        ? LinesTypes.Kmh
        : LinesTypes.Verification;
    series.push(createSeriesItem(name, data, type, chartLinesLib[event.id]));
    if (withBorders) {
      const borderNameTop = `${name} верхняя граница`;
      const borderNameBot = `${name} нижняя граница`;
      const dataTop: number[][] = [];
      const dataBot: number[][] = [];
      event.controlResults.forEach((result) => {
        dataTop.push([Number(result.qj?.toFixed(2)), Number((result.kj * 1.0015).toFixed(2))]);
        dataBot.push([Number(result.qj?.toFixed(2)), Number((result.kj * 0.9985).toFixed(2))]);
      });
      series.push(
        createSeriesItem(
          borderNameTop,
          dataTop,
          LinesTypes.Border,
          chartLinesLib[event.id]
        )
      );
      series.push(
        createSeriesItem(
          borderNameBot,
          dataBot,
          LinesTypes.Border,
          chartLinesLib[event.id]
        )
      );
    }
  });
  return {
    ...highchartsDefaultOptions,
    series,
    title: {
      text: `График изменения коэффициентов преобразования ${events[0].siName}`,
    },
  };
};

export const prepareEventsData = (
  events: ControlMaintEvents[]
): ControlMaintEvents[] => {
  const sorter = (a: ControlResultsModel, b: ControlResultsModel) => {
    if (a.qj > b.qj) {
      return 1;
    }
    if (a.qj < b.qj) {
      return -1;
    }
    return 0;
  };

  const sortedEvents = events.map((event) => ({
    ...event,
    controlResults: [...event.controlResults].sort(sorter),
  }));
  return sortedEvents;
};

export const returnEventsOptions = (
  events: ControlMaintEvents[],
  selectedType: string
) => {
  if (!events.length) return [];
  const filteredEvents =
    selectedType === TypeFilterParams.All
      ? events
      : events.filter((event) => event.eventType === selectedType);

  const options: CheckboxGroupOption[] = [];

  filteredEvents.forEach((event) => {
    let data = `${event.vis_avg?.toFixed(2) ?? "*"} мм²/с  ${event.dens_avg?.toFixed(2) ?? "*"} кг/м³ ${event.t_avg?.toFixed(2) ?? "*"
      } °C`;
    if (data.includes("*")) data += " (* - данные не заполнены)";
    options.push({
      label: `${moment(event.factDate).format("DD.MM.YYYY")} 
        ${event.eventType}  ${data}`,
      value: event.id.toString() || "",
      disabled: !event.controlResults.length,
    });
    if (
      event.eventType === TypeFilterParams.Verifications &&
      event.controlResults.length
    ) {
      options.push({
        label: `${moment(event.factDate).format("DD.MM.YYYY")} Границы поверки`,
        value: `border@${event.id.toString()}`,
        disabled: !event.controlResults.length,
      });
    }
  });

  return options;
};
