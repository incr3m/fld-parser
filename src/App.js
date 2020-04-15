/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { Box, Button } from "@material-ui/core";
import Editor from "./Editor";

export default function App() {
  const [state, setState] = React.useState({
    json: {},
    ids: [],
    selectedId: null,
  });

  const reload = React.useCallback(() => {
    fetch(
      "http://192.168.100.87:4566/devices?fields=disabled,map,hunt,itemExclude,ERRORS,game"
    )
      .then((data) => data.json())
      .then((json) => {
        const ids = Object.keys(json);
        setState((oldState) => ({
          ...oldState,
          json,
          ids,
          selectedId: oldState.selectedId || ids[0],
        }));
      });
  }, []);

  React.useEffect(() => {
    reload();
  }, []);

  const handleIdSelect = React.useCallback((e) => {
    const id = e.currentTarget.getAttribute("name");
    setState((oldState) => ({
      ...oldState,
      selectedId: id,
    }));
  }, []);

  const { selectedId } = state;
  return (
    <Box>
      <Box>
        <Box mr={1} component="span">
          <Button variant="outlined" onClick={reload}>
            🔃
          </Button>
        </Box>
        {state.ids.map((id) => (
          <Button
            key={id}
            variant={selectedId === id ? "contained" : "outlined"}
            name={id}
            color={selectedId === id ? "primary" : "default"}
            onClick={handleIdSelect}
          >
            {id}
          </Button>
        ))}
      </Box>
      {selectedId && (
        <Box width="400px" mt={1}>
          <Editor deviceId={selectedId} json={state.json[selectedId]} />
        </Box>
      )}
    </Box>
  );
}
