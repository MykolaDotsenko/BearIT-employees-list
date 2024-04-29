import Header from "./components/Header/Header";
import "./App.css";
import TeachingSection from "./components/TeachingSection";
import DifferencesSection from "./components/DifferencesSection";
import { Fragment, useState } from "react";
import IntroSection from "./components/IntroSection";
import TabsSection from "./components/TabsSection";
import FeedbackSection from "./components/FeedbackSection";
import EffectSection from "./components/EffectSection";

export default function App() {
  const [tab, setTab] = useState("effect");

  return (
    <div>
      <Header />
      <main>
        <IntroSection />

        <TabsSection active={tab}onChange={(current) => setTab(current) } />

        {tab === "main" && (
          <>
            <TeachingSection />
            <DifferencesSection />
          </>
        )}

        {tab=== 'feedback' && <FeedbackSection /> }
        {tab=== 'effect' && <EffectSection /> }

        
      </main>
    </div>
  );
}
