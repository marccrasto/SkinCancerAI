"use client";
import AIChatbot from './components/aichatbot'

import Navbar from './components/navbar'
import Title from './components/title'
import Connect from './components/connect'
import WhyUs from './components/why_us'
import HowItWorksModel from './components/how_does_it_work'
import Instruction from './components/instruction'; 
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Title />

        

        <WhyUs />
        <HowItWorksModel />
        <Instruction/> 
        <AIChatbot />
        {/* Other components like WhyUse, HowItWorks, AIChatbot, TryDiagnostics would go here */}
      </main>
      <Connect />
    </>
  );
}