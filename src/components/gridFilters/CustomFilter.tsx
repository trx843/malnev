import {
  GridApi,
  IFilter,
  Promise,
} from "ag-grid-community";
import { Button, Select as AntSelect } from "antd";
import  { Component } from "react";
import styled from "styled-components";

const FilterPopup = styled.div`
  width: 222px;
  border-radius: 2px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex-flow: wrap;
`;

const Btn = styled(Button)`
  border-radius: 4px;
  margin: 0px 5px;
`;

const SelectDiv = styled.div`
  width: inherit;
  padding-bottom: 10px;
`;

const Select = styled(AntSelect)`
  width: 100%;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const { Option } = Select;

interface CustomFilterState {
  index: number | undefined;
}

interface CustomFilterProps {
  customOptions?: string[];
  filterChangedCallback: (additionalEventAttributes?: any) => void;
  api: GridApi;
}

const filterArray = ["Нет","Да"] as const;



// https://www.ag-grid.com/react-grid/component-filter
export class CustomFilter
  extends Component<CustomFilterProps, CustomFilterState>
  implements IFilter
{
  constructor(props: CustomFilterProps) {
    super(props);
    this.state = {
      index: undefined,
    };
  }

  private filterValues = this.props.customOptions ?? filterArray;

  render() {
    return (
      <FilterPopup>
        <SelectDiv>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            value={this.state.index}
            placeholder="Фильтровать"
            allowClear
            onChange={(value) => {
              const i = value as number;
              this.setState({ index: i });
            }}
          >
            {this.filterValues.map((s, i) => (
              <Option value={i}>{s}</Option>
            ))}
          </Select>
        </SelectDiv>
        <Buttons>
          <Btn
            onClick={() => {
              this.setState({ index: undefined }, () => {
                this.props.filterChangedCallback();
                this.props.api.hidePopupMenu();
              });
            }}
            block
            type="link"
          >
            Сброс
          </Btn>
          <Btn
            onClick={() => {
              this.props.filterChangedCallback();
              this.props.api.hidePopupMenu();
            }}
            block
            type="primary"
          >
            Применить
          </Btn>
        </Buttons>
      </FilterPopup>
    );
  }

  isFilterActive(): boolean {
    return this.state.index !== undefined;
  }

  doesFilterPass(): boolean {
    return true;
  }

  getModel() {
    return this.state.index;
  }

  setModel(model: any): void | Promise<void> {}
}
