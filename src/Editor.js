import React from "react";
import ReactJson from "react-json-view";
import set from "lodash/set";

export default function Editor({ deviceId, json }) {
  const saveField = React.useCallback(
    (field, value) => {
      return fetch(
        `http://192.168.100.87:4566/set?deviceId=${deviceId}&field=${field}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value }),
        }
      );
    },
    [deviceId]
  );

  const handleEdit = React.useCallback(async (edit) => {
    console.log(">>src/Editor::", "edit", edit); //TRACE
    const { name, new_value } = edit;
    const res = await saveField(name, new_value);
    console.log(">>src/Editor::", "res", res); //TRACE
  }, []);
  return (
    <div>
      <ReactJson src={json} theme="monokai" onEdit={handleEdit} />
    </div>
  );
}
