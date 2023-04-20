import { Button, Input } from "antd";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const FilterDiv = styled.div`
  width: inherit;
  padding-bottom: 10px;
`;

export default forwardRef((props: any, ref) => {
  const inputRef = useRef<any>(null);
  const [text, setText] = useState("");
  const [filterReset, setFilterReset] = useState(0);
  const onChange = (event) => {
    const newValue = event.target.value;
    if (text !== newValue) {
      setText(newValue);
    }
  };

  useEffect(() => {
    if (filterReset > 0) {
      props.filterChangedCallback();
      props.api.hidePopupMenu();
    }
  }, [filterReset]);

  useImperativeHandle(ref, () => {
    return {
      isFilterActive() {
        return text != null && text !== "";
      },

      doesFilterPass() {
        return true;
      },

      getModel() {
        if (!this.isFilterActive()) {
          return null;
        }
        return text;
      },

      setModel(model) {
        setText(model ? model : "");
      },
      afterGuiAttached() {
        focus();
      },
    };
  });

  const focus = () => {
    inputRef.current!.focus({
      cursor: "start",
    });
  };

  return (
    <FilterPopup>
      <FilterDiv>
        <Input
          placeholder="Фильтр"
          ref={inputRef}
          value={text}
          onChange={onChange}
        />
      </FilterDiv>
      <Buttons>
        <Btn
          onClick={() => {
            setText("");
            setFilterReset(filterReset + 1);
          }}
          block
          type="link"
        >
          Сброс
        </Btn>
        <Btn
          onClick={() => {
            props.filterChangedCallback();
            props.api.hidePopupMenu();
          }}
          block
          type="primary"
        >
          Применить
        </Btn>
      </Buttons>
    </FilterPopup>
  );
});
