import React from "react";

/** Обрабатывает символы \n  в строке */
export function addLineBreak(str: string) {
  return str.split("\n").map((subStr) => {
    return (
      <>
        {subStr}
        <br />
      </>
    );
  });
}
