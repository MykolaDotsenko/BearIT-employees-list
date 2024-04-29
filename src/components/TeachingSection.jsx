import WayToTeach from "./WayToTech";
import {ways } from '../data'

export default function TeachingSection() {
    return (
        <section className="content-section">
        <h3>Ryhmäkoulutukset</h3>
        <h1>Koodia ja suomea</h1>
        <ul>
          {ways.map((way, index) => (
            <WayToTeach key={index} {...way} />
          ))}
        </ul>
      </section>
    )
}