import React from "react";
// export default function IntroSection() {
//   return (
//     <section>
//       <h1 className="centered">BearIT</h1>
//       <h3 className="centered" style ={{color: '#555'}}>
//         A modern software and working life service company. BearIT is
//         also a Finnish Social Enterprise® with a remarkable experience in
//         digitalization and a unique ability to recognize competence.
//       </h3>
//     </section>
//   );
// }

const e = React.createElement;

export default function IntroSection() {
  return e("section", null, [
    e("h1", { className: "centered", key:1}, "BearIT"),
    e(
      "h3",
      { className: "centered", style: { color: "#555" }, key:2 },
      "A modern software and working life service company. BearIT is also a Finnish Social Enterprise® with a remarkable experience in digitalization and a unique ability to recognize competence."
    ),
  ]);
}
