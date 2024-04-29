import Button from "./Button/Button"
import { useState } from "react";
import { differences } from "../data";


export default function DifferencesSection() {
    const [contentType, setContentType] = useState(null);

    function handleClick(type) {
      setContentType(type);
    }

    return (
        <section className="content-section">
          <h3>Qualifications</h3>
          <div className="buttons-container">
            <Button
              isActive={contentType === "way"}
              onClick={() => handleClick("way")}
            >
              Approach
            </Button>
            <Button
              isActive={contentType === "easy"}
              onClick={() => handleClick("easy")}
            >
              Requirement
            </Button>
            <Button
              isActive={contentType === "program"}
              onClick={() => handleClick("program")}
            >
              Goal
            </Button>
          </div>
          <div className="tab-content">
            {contentType ? (
              <p>{differences[contentType]}</p>
            ) : (
              <p>Press the button</p>
            )}
          </div>
        </section>
    )
}