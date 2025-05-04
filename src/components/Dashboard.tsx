'use client'

import { useState, useRef, useEffect, SetStateAction } from 'react';
import { ChevronDown, ChevronUp, Filter, SortAsc, SortDesc, CheckCircle, AlertCircle, AlertOctagon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from 'zod'; 
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


type Severity = 'Low' | 'Medium' | 'High';

interface Incident {
  id: number;
  title: string;
  severity: Severity;
  reportedDate: string;
  description: string;
}


const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "AI Content Moderation Evasion",
    severity: "Medium",
    reportedDate: "2025-03-15",
    description: "Investigations revealed multiple instances where users exploited advanced prompting techniques to bypass AI content moderation filters. These evasions led to the generation of harmful, offensive, and policy-violating outputs that should have been automatically flagged and blocked. The issue exposed significant gaps in the AI's ability to recognize evolving adversarial tactics, prompting an urgent overhaul of the moderation system's training data and response mechanisms."
  },
  {
    id: 2,
    title: "Facial Recognition False Positives",
    severity: "High",
    reportedDate: "2025-02-08",
    description: "A widely deployed facial recognition system utilized by law enforcement agencies misidentified 23 individuals, leading to several wrongful arrests and detainments. Detailed analysis traced the root cause to bias within the AI’s training datasets, which underrepresented key demographic groups. Public outrage and legal challenges followed, necessitating immediate suspension of the system, a complete audit of the datasets, and the implementation of stricter ethical guidelines for biometric AI."
  },
  {
    id: 3,
    title: "Autonomous Vehicle Navigation Failure",
    severity: "High",
    reportedDate: "2025-04-02",
    description: "During a routine test drive under complex lighting conditions — including harsh glares and shaded road sections — an autonomous vehicle misinterpreted critical road markings, causing it to veer momentarily into an oncoming traffic lane. Fortunately, the emergency override system was triggered, allowing human safety drivers to regain control and prevent a collision. The incident led to revisions in the computer vision algorithms and updates to how environmental factors are handled in real-time decision-making."
  },
  {
    id: 4,
    title: "Medical Diagnosis Recommendation Error",
    severity: "High",
    reportedDate: "2025-01-20",
    description: "An AI-powered clinical decision support tool recommended an inappropriate treatment plan for a patient suffering from a rare autoimmune condition. Upon manual review, physicians detected the error before treatment commenced. It was discovered that the AI had been inadequately trained on rare disease cases due to the scarcity of available data. The event triggered a comprehensive retraining initiative, expanded collaboration with rare disease specialists, and a reevaluation of how AI should assist (but not replace) human medical judgment."
  },
  {
    id: 5,
    title: "Supply Chain Optimization Cascade Effect",
    severity: "Medium",
    reportedDate: "2025-03-28",
    description: "An AI system designed to optimize logistics in global supply chains made decisions that unintentionally created bottlenecks across multiple regions after reacting to a localized disruption. Instead of mitigating the impact of the disruption, its reallocation algorithms compounded shortages elsewhere, affecting millions of dollars in lost revenue. Experts attributed the issue to the model's narrow optimization criteria and lack of broader system-wide awareness, prompting a redesign to include resilience-focused objectives in optimization routines."
  },
  {
    id: 6,
    title: "Financial Trading Algorithm Abnormality",
    severity: "Medium",
    reportedDate: "2025-02-14",
    description: "During a period of extreme market volatility, a high-frequency trading algorithm exhibited unforeseen behavior, executing a series of large trades that briefly distorted stock prices. Although fail-safes ultimately halted the algorithm after detecting anomalous patterns, the temporary disturbance caused ripples across financial markets. Subsequent investigations uncovered insufficient stress-testing for edge-case scenarios, leading to the reinforcement of testing protocols and the imposition of stricter real-time monitoring regulations."
  },
  {
    id: 7,
    title: "Chatbot Personal Data Disclosure",
    severity: "Low",
    reportedDate: "2025-03-05",
    description: "A customer service chatbot inadvertently exposed private customer details — including previous interaction histories — during live conversations with unrelated users. The incident was attributed to faulty session management within the AI's memory handling. Although the information disclosed was limited, the breach raised significant concerns over data privacy compliance, resulting in immediate corrective action, customer notifications, and an overhaul of how conversational AI handles and isolates user sessions."
  },
  {
    id: 8,
    title: "Speech Recognition Cultural Bias",
    severity: "Low",
    reportedDate: "2025-01-15",
    description: "Research into a mainstream speech recognition system revealed substantial accuracy disparities for users speaking English with various non-native accents. Users with South Asian, African, and Eastern European accents reported significantly higher error rates in transcription and command recognition, causing accessibility challenges. The bias was traced back to an unbalanced training set dominated by native English speakers from limited regions. This discovery led to calls for better dataset diversification and a global reevaluation of inclusivity standards in AI development."
  }
];


const severityColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800"
};

const severityIcons = {
  All: <Filter size={16} className="text-gray-500" />,
  Low: <CheckCircle size={16} className="text-blue-500" />,
  Medium: <AlertCircle size={16} className="text-yellow-500" />,
  High: <AlertOctagon size={16} className="text-red-500" />
};


const AnimatedDropdown = ({ isOpen, children, className }: { isOpen: boolean; children: React.ReactNode; className?: string }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`} style={{ maxHeight: `${height}px` }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default function AISafetyIncidentsDashboard() {
  const IncidentSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
    severity: z.enum(["Low", "Medium", "High"], { required_error: "Severity is required." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long." }),
  });
  
 
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedIncidents, setExpandedIncidents] = useState<Set<number>>(new Set());
  const [isSeverityDropdownOpen, setSeverityDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const incidentsPerPage = 6;

  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High" | "">("");
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ title?: string; severity?: string; description?: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReportIncident = () => {
    const result = IncidentSchema.safeParse({ title, severity, description });
    if (!result.success) {
 
      const errors: { title?: string; severity?: string; description?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "title") {
          errors.title = err.message;
        }
        if (err.path[0] === "severity") {
          errors.severity = err.message;
        }
        if (err.path[0] === "description") {
          errors.description = err.message;
        }
      });
      setFormErrors(errors);
    } else {

      const newIncident: Incident = {
        id: incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1,
        title: title,
        severity: severity as Severity,
        reportedDate: new Date().toISOString().split('T')[0], 
        description: description
      };
      

      setIncidents([...incidents, newIncident]);

      setTitle("");
      setSeverity("");
      setDescription("");
      setFormErrors({});
      

      setIsDialogOpen(false);
      toast("New Incident Reported", {
        action: {
          label: "Done",
          onClick: () => console.log("Undo"),
        },
      })
    }
  };

  const filteredIncidents = incidents
    .filter(incident => selectedSeverity === "All" || incident.severity === selectedSeverity)
    .sort((a, b) => {
      const dateA = new Date(a.reportedDate).getTime();
      const dateB = new Date(b.reportedDate).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    
  const totalPages = Math.ceil(filteredIncidents.length / incidentsPerPage);
  

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeverity, sortDirection]);

  const currentIncidents = filteredIncidents.slice(
    (currentPage - 1) * incidentsPerPage, 
    currentPage * incidentsPerPage
  );

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedIncidents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIncidents(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (isSeverityDropdownOpen || isSortDropdownOpen) {
        if (target && target instanceof Element) {
          if (!target.closest('.severity-dropdown') && !target.closest('.sort-dropdown')) {
            setSeverityDropdownOpen(false);
            setSortDropdownOpen(false);
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSeverityDropdownOpen, isSortDropdownOpen]);

  return (
    <div className="max-w-5xl mx-auto  bg-white rounded-lg font-karla text-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div  id="step-two-target" className="flex space-x-3">
          <div className="relative severity-dropdown">
            <button
              onClick={() => setSeverityDropdownOpen(!isSeverityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-0"
            >
              {severityIcons[selectedSeverity as keyof typeof severityIcons]}
              <span className="text-xs font-medium text-gray-700">Filter: {selectedSeverity}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            <AnimatedDropdown isOpen={isSeverityDropdownOpen} className="absolute z-10 mt-1 w-44">
              <div className="bg-white font-mono rounded-md shadow-md py-1">
                {["All", "Low", "Medium", "High"].map(severity => (
                  <button
                    key={severity}
                    onClick={() => { setSelectedSeverity(severity); setSeverityDropdownOpen(false); }}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-0 ${
                      selectedSeverity === severity ? "bg-indigo-100 text-indigo-900" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {severityIcons[severity as keyof typeof severityIcons]}
                    <span className="ml-2">{severity}</span>
                  </button>
                ))}
              </div>
            </AnimatedDropdown>
          </div>
          <div className="relative sort-dropdown">
            <button
              onClick={() => setSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-50 focus:outline-none focus:ring-0"
            >
              {sortDirection === "desc" ? <SortDesc size={14} className="text-gray-500" /> : <SortAsc size={14} className="text-gray-500" />}
              <span className="text-xs font-medium text-gray-700">{sortDirection === "desc" ? "Newest First" : "Oldest First"}</span>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            <AnimatedDropdown isOpen={isSortDropdownOpen} className="absolute z-10 mt-1 w-44">
              <div className="bg-white font-mono rounded-md shadow-md py-1">
                <button
                  onClick={() => { setSortDirection("desc"); setSortDropdownOpen(false); }}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-0 ${
                    sortDirection === "desc" ? "bg-indigo-100 text-indigo-900" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <SortDesc size={14} className="mr-2" />
                  Newest First
                </button>
                <button
                  onClick={() => { setSortDirection("asc"); setSortDropdownOpen(false); }}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-0 ${
                    sortDirection === "asc" ? "bg-indigo-100 text-indigo-900" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <SortAsc size={14} className="mr-2" />
                  Oldest First
                </button>
              </div>
            </AnimatedDropdown>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button  className='ml-2' id="step-three-target">Report</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Report Incident</DialogTitle>
              <DialogDescription>
                Add a new AI Safety Incident to the dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
     
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <div className="col-span-3 flex flex-col space-y-1">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Incident title"
                    className={formErrors.title ? "border-red-500" : ""}
                  />
                  {formErrors.title && (
                    <span className="text-xs text-red-500">{formErrors.title}</span>
                  )}
                </div>
              </div>

     
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <div className="col-span-3 flex flex-col space-y-1">
                  <Select
                    value={severity}
                    onValueChange={(value) => setSeverity(value as "Low" | "Medium" | "High")}
                  >
                    <SelectTrigger className={formErrors.severity ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.severity && (
                    <span className="text-xs text-red-500">{formErrors.severity}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3 flex flex-col space-y-1">
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDescription(e.target.value)}
                    placeholder="Describe the incident"
                    className={formErrors.description ? "border-red-500" : ""}
                    rows={4}
                  />
                  {formErrors.description && (
                    <span className="text-xs text-red-500">{formErrors.description}</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleReportIncident}>
                Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg flex-grow">
        <div className="hidden sm:grid grid-cols-12 bg-gray-50 border-b border-gray-200 p-4 font-medium font-mono text-gray-700">
          <div className="col-span-5">Title</div>
          <div className="col-span-3">Severity</div>
          <div className="col-span-3">Reported Date</div>
          <div className="col-span-1">Actions</div>
        </div>
        <div className="divide-y font-mono divide-gray-200">
          {currentIncidents.length > 0 ? (
            currentIncidents.map(incident => (
              <div key={incident.id} className="bg-white">
     
                <div className="hidden sm:grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors">
                  <div className="col-span-5 font-medium text-gray-800">{incident.title}</div>
                  <div className="col-span-3">
                    <span className={`inline-flex justify-center items-center w-24 py-1 rounded-md text-xs font-semibold ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <div className="col-span-3 text-gray-600">{formatDate(incident.reportedDate)}</div>
                  <div className="col-span-1">
                    <button
                      onClick={() => toggleExpanded(incident.id)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium focus:outline-none"
                    >
                      {expandedIncidents.has(incident.id) ? (
                        <>
                          <ChevronUp size={16} className="mr-1" /> Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" /> View
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex sm:hidden flex-col p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-gray-800">{incident.title}</div>
                    <button
                      onClick={() => toggleExpanded(incident.id)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium focus:outline-none"
                    >
                      {expandedIncidents.has(incident.id) ? (
                        <>
                          <ChevronUp size={16} className="mr-1" /> Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" /> View
                        </>
                      )}
                    </button>
                  </div>
                </div>


                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedIncidents.has(incident.id) ? '500px' : '0',
                    opacity: expandedIncidents.has(incident.id) ? 1 : 0,
                  }}
                >
                  <div className="p-4 pt-0 pl-8 bg-gray-50 text-gray-700">
                    

                    <div className="hidden sm:block">
                      <h3 className="font-medium mb-2">Description:</h3>
                      <p>{incident.description}</p>
                    </div>


                    <div className="flex flex-col space-y-2 sm:hidden">
                      <div className="text-sm">
                      <span className={`inline-flex justify-center items-center w-24 py-1 rounded-md text-xs font-semibold ${severityColors[incident.severity]}`}>
                      {incident.severity}
                    </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">Reported Date:</span> {formatDate(incident.reportedDate)}
                      </div>
                      <div>
                        <h3 className="font-medium mt-2 mb-1">Description:</h3>
                        <p className="text-sm">{incident.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No incidents match the selected filters.
            </div>
          )}
        </div>
      </div>


      {totalPages > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}