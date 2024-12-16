import React, { Fragment } from "react";

/** Обрабатывает символы \n  в строке */
export function addLineBreak(str: string) {
  return str.split("\n").map((subStr, idx) => {
    return (
      <Fragment key={idx}>
        {0 < idx && <br />} {subStr}
      </Fragment>
    );
  });
}
