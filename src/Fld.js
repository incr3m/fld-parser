import React from "react";
import Promise from "bluebird";
import "./App.css";
import { makeStyles } from "@material-ui/core";
import Sketch from "react-p5";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Controls from "./Controls";
import debounce from "lodash/debounce";


const useStyles = makeStyles(() => ({
  map: ({ width }) => ({
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }),
}));

export default function Tiles() {
  const [state, setState] = React.useState({
    mapData: null,
    loading: false,
    controls: {},
  });

  const classes = useStyles({ width: 24 });

  const self = React.useRef({
    selectedPoints: {},
    p5: null,
    width: null,
    height: null,
    pixel: 15,
    scrollTop: 0,
    scrollLeft: 0,
  });

  React.useEffect(() => {
    if (!self.current.p5) return;
    self.current.p5.redraw();
  }, [state.controls]);

  React.useEffect(() => {
    setState((oldState) => ({ ...oldState, loading: true }));
    (async () => {
      const res = await fetch(window.location.origin + "/maps/gef_fild13.fld");
      const buffer = await res.arrayBuffer();
      const [width, height] = new Uint16Array(buffer, 0, 2);
      const data = new Uint8Array(buffer, 4);

      self.current.width = width;
      self.current.height = height;
      setState((oldState) => ({
        ...oldState,
        mapData: data,
        loading: false,
      }));
      self.current.p5.redraw();
    })();

    // fetch(window.location.origin + "/maps/gef_fild04.fld").then((data) => {
    //   // console.log(">>src/App::", "data", data); //TRACE
    //   const mapData = generateLayer();
    //   setState((oldState) => ({ ...oldState, mapData, loading: false }));
    //   self.current.p5.redraw();
    // });
  }, []);

  const p5setup = React.useCallback(
    (p5, canvasParentRef) => {
      const { controls } = state;
      const { current } = self;
      p5.createCanvas(
        current.width * current.pixel * controls.scale,
        current.height * current.pixel * controls.scale
      ).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
      p5.noLoop();
      self.current.p5 = p5;
    },
    [state]
  );

  const p5draw = React.useCallback(
    (p5) => {
      const { current } = self;
      const { selectedPoints } = current;
      p5.scale(state.controls.scale);
      p5.background(0);
      console.log(">>src/App::", "selectedPoints", selectedPoints); //TRACE

      const canvasHeight = current.height * current.pixel;

      for (let y = 0; y < current.height; y++) {
        for (let x = 0; x < current.width; x++) {
          const d = state.mapData[y * current.width + x];
          let c = d ? 50 : 0;
          if (selectedPoints[`${x}:${current.height - y - 1}`]) c = 200;

          p5.stroke(c);
          p5.fill(c);
          p5.rect(
            x * current.pixel,
            canvasHeight - (y + 1) * current.pixel,
            current.pixel,
            current.pixel
          );
        }
      }
      console.log(">>src/App::", "POINTS:: ", JSON.stringify(selectedPoints)); //TRACE
    },
    [state]
  );

  const handleControlChange = React.useCallback((controls) => {
    setState((oldState) => ({ ...oldState, controls }));
  }, []);

  const rerender = React.useCallback(
    debounce(() => {
      if (!self.current.p5) return;
      self.current.p5.redraw();
    }, 1000),
    []
  );

  const handleMouseUp = React.useCallback(
    (e) => {
      const { current } = self;

      const x = Math.floor((e.pageX + current.scrollLeft) / current.pixel),
        y = Math.floor((e.pageY + current.scrollTop) / current.pixel);

      console.log(">>src/App::", "x,y", x, y); //TRACE

      const { selectedPoints } = current;
      const key = x + `:` + y;

      if (selectedPoints[key]) delete selectedPoints[key];
      else selectedPoints[key] = true;
      self.current.selectedPoints = selectedPoints;
      rerender();
    },
    [rerender]
  );

  const handleScrollX = React.useCallback((e) => {
    self.current.scrollLeft = e.scrollLeft;
  }, []);
  const handleScrollY = React.useCallback((e) => {
    self.current.scrollTop = e.scrollTop;
  }, []);

  return (
    <div className={classes.map}>
      <PerfectScrollbar onScrollY={handleScrollY} onScrollX={handleScrollX}>
        <div onMouseUp={handleMouseUp}>
          {state.mapData ? (
            <Sketch
              key={JSON.stringify(state.controls)}
              setup={p5setup}
              draw={p5draw}
            />
          ) : (
            <div />
          )}
        </div>
      </PerfectScrollbar>
      <Controls onChange={handleControlChange} />
    </div>
  );
}
