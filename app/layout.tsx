import type { Metadata } from "next";
import { Geist } from "next/font/google";
import JobsApplicationWorkflow from "./jobs-application-workflow";
import CandidateJobTrackerControls from "./candidate-job-tracker-controls";
import CandidateJobMessages from "./candidate-job-messages";
import "./globals.css";
import "./huellitas-bella.css";
import "./discover.css";
import "./jobs-application-workflow.css";
import "./candidate-job-tracker-controls.css";
import "./candidate-job-messages.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "Coqui Ventas MVP", description: "Compra, vende y conecta con todo Puerto Rico.", other: { "codex-preview": "development" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body className={geist.variable}>{children}<JobsApplicationWorkflow /><CandidateJobTrackerControls /><CandidateJobMessages /></body></html>; }
