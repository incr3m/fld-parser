import React from "react";
import { Slider } from "@material-ui/core";

function valuetext(value) {
  return `${value}°C`;
}

export default function Controls({ onChange }) {
  const [state, setState] = React.useState({ scale: 1 });

  React.useEffect(() => {
    onChange && onChange(state);
  }, [onChange, state]);

  const handleSlider = React.useCallback((e, data) => {
    console.log(">>src/Controls::", "e", data); //TRACE
    setState((oldState) => ({ ...oldState, scale: data }));
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        width: 100,
        height: 60,
      }}
    >
      <Slider
        onChangeCommitted={handleSlider}
        defaultValue={0.5}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={0.1}
        marks
        min={0.1}
        max={1.0}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
