'use client'

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ResponsiveContainer,  Cell,  BarChart, PieChart, Pie, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";



type Incident = {
  id: number;
  title: string;
  reach: number;      
  impact: number;     
  confidence: number; 
  effort: number;    
  reportedDate: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
};


const COLORS = {
    High: "#EF4444",
    Medium: "#F59E0B",
    Low: "#10B981",
  };


interface MonthDataItem {
  name: string;
  uv: number;
}


// Define props types for custom components
interface TriangleBarProps {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}


const initialIncidents: Incident[] = [
    { id: 1, title: "AI Content Moderation Evasion", reportedDate: "2025-03-15", description: "...", severity: "Medium", reach: 80, impact: 4, confidence: 70, effort: 3 },
    { id: 2, title: "Facial Recognition False Positives", reportedDate: "2025-02-08", description: "...", severity: "High", reach: 90, impact: 5, confidence: 80, effort: 4 },
    { id: 3, title: "Autonomous Vehicle Navigation Failure", reportedDate: "2025-04-02", description: "...", severity: "High", reach: 95, impact: 5, confidence: 85, effort: 5 },
    { id: 4, title: "Medical Diagnosis Recommendation Error", reportedDate: "2025-01-20", description: "...", severity: "High", reach: 70, impact: 4, confidence: 60, effort: 2 },
    { id: 5, title: "Supply Chain Optimization Cascade Effect", reportedDate: "2025-03-28", description: "...", severity: "Medium", reach: 60, impact: 3, confidence: 75, effort: 2 },
    { id: 6, title: "Financial Trading Algorithm Abnormality", reportedDate: "2025-02-14", description: "...", severity: "Medium", reach: 65, impact: 4, confidence: 70, effort: 3 },
    { id: 7, title: "Chatbot Personal Data Disclosure", reportedDate: "2025-03-05", description: "...", severity: "Low", reach: 50, impact: 2, confidence: 90, effort: 1 },
    { id: 8, title: "Speech Recognition Cultural Bias", reportedDate: "2025-01-15", description: "...", severity: "Low", reach: 55, impact: 3, confidence: 65, effort: 2 },
  ];
  

const severityData = [
    { severity: "High", count: initialIncidents.filter(i => i.severity === "High").length },
    { severity: "Medium", count: initialIncidents.filter(i => i.severity === "Medium").length },
    { severity: "Low", count: initialIncidents.filter(i => i.severity === "Low").length },
  ];
  
  


// Initial data



const incidentsByMonth: Record<string, number> = initialIncidents.reduce((acc: Record<string, number>, incident) => {
  const month = incident.reportedDate.slice(0, 7); // "YYYY-MM"
  acc[month] = (acc[month] || 0) + 1;
  return acc;
}, {});

const monthData: MonthDataItem[] = Object.entries(incidentsByMonth).map(([name, uv]) => ({ name, uv }));

// Triangle Bar Shape for Bar Chart
const getPath = (x: number, y: number, width: number, height: number): string => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const TriangleBar: React.FC<TriangleBarProps> = (props) => {
  const { fill, x, y, width, height } = props;
  if (typeof x !== 'number' || typeof y !== 'number' || typeof width !== 'number' || typeof height !== 'number') {
    return null;
  }
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill || "#000"} />;
};

// Active Pie Shape Renderer


// Color arrays for bar chart
const barColors: string[] = ['#3B82F6', '#6366F1', '#8B5CF6', '#D946EF', '#EC4899'];

const IncidentTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const incidentsPerPage = 6;
  
    const calculateRiceScore = (incident: Incident) => {
      return ((incident.reach * incident.impact * (incident.confidence / 100)) / incident.effort).toFixed(1);
    };
  
    const totalPages = Math.ceil(initialIncidents.length / incidentsPerPage);
    const startIndex = (currentPage - 1) * incidentsPerPage;
    const currentIncidents = initialIncidents.slice(startIndex, startIndex + incidentsPerPage);
  
    const renderCircles = (count: number, filled: number) => {
      return (
        <div className="flex space-x-1">
          {[...Array(count)].map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${idx < filled ? 'bg-blue-500' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
      );
    };
  
    const renderConfidenceCircle = (confidence: number) => {
      const degree = (confidence / 100) * 360;
      return (
        <div className="relative w-5 h-5">
          <div className="w-5 h-5 rounded-full bg-gray-300" />
          <div
            className="absolute top-0 left-0 w-5 h-5 rounded-full"
            style={{
              background: `conic-gradient(#3b82f6 0deg ${degree}deg, transparent ${degree}deg 360deg)`,
            }}
          />
        </div>
      );
    };
  
    return (
      <div className="h-full flex flex-col overflow-auto">
        <h2 className="text-lg font-mono mb-4">R.I.C.E Prioritization</h2>
  
        <div className="flex-1 overflow-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-500 font-mono">
              <tr>
                <th className="px-2 py-1">Title</th>
                <th className="px-2 py-1">Reach</th>
                <th className="px-2 py-1">Impact</th>
                <th className="px-2 py-1">Confidence</th>
                <th className="px-2 py-1">Effort</th>
                <th className="px-2 py-1">RICE Score</th>
              </tr>
            </thead>
            <tbody>
              {currentIncidents.map((incident) => (
                <tr key={incident.id} className="border-t font-mono">
                  <td className="px-6 py-2 font-medium">{incident.title}</td>
                  <td className="px-2 py-1">{incident.reach}</td>
                  <td className="px-2 py-1">{renderCircles(5, incident.impact)}</td>
                  <td className="px-2 py-1">{renderConfidenceCircle(incident.confidence)}</td>
                  <td className="px-2 py-1">{renderCircles(5, incident.effort)}</td>
                  <td className="px-2 py-1">{calculateRiceScore(incident)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
           className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
           className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  

const DataAnalyticsFinalBento: React.FC = () => {


  return (
    <div className="grid w-full md:w-[73vw] grid-cols-1 md:grid-cols-3 gap-4 pr-8 h-full">
      {/* INCIDENT TABLE - takes 2 columns */}
      <Card className="md:col-span-2 h-full">
        <CardContent className="p-4 h-full">
          <IncidentTable />
        </CardContent>
      </Card>

      {/* Charts div - takes 1 column with same height as table */}
      <div className="flex flex-col gap-4 h-full">
        {/* ENHANCED BAR CHART */}
        <Card className="h-1/2">
          <CardContent className="p-4 flex flex-col h-full">
          <h2 className="text-md font-mono mb-2 text-center">Incidents Over Time</h2>

            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="uv" 
                    fill="#8884d8" 
                    shape={<TriangleBar />} 
                    label={{ position: 'top', fontSize: 12 }}
                  >
                    {monthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ENHANCED PIE CHART */}
        <Card className="h-1/2">
          <CardContent className="p-4 flex flex-col h-full">
            <h2 className="text-md font-mono mb-2 text-center">Severity Distribution</h2>
            <div className="flex-grow">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={severityData} dataKey="count" nameKey="severity" cx="50%" cy="50%" outerRadius={80} label>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.severity as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataAnalyticsFinalBento;