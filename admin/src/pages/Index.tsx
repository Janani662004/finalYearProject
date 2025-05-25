
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
  // Sample employee data
  const [employees, setEmployees] = useState([
    { id: "emp001", name: "John Wesley", department: "Engineering", role: "Senior Developer" },
    { id: "emp002", name: "Sarah Johnson", department: "Marketing", role: "Brand Manager" },
    { id: "emp003", name: "Michael Chen", department: "Design", role: "UX Designer" },
    { id: "emp004", name: "Emma Rodriguez", department: "HR", role: "Talent Acquisition" },
    { id: "emp005", name: "David Kim", department: "Finance", role: "Financial Analyst" },
    { id: "emp006", name: "Olivia Taylor", department: "Engineering", role: "Software Engineer" },
    { id: "emp007", name: "James Wilson", department: "Customer Support", role: "Support Lead" },
    { id: "emp008", name: "Sophia Martinez", department: "Product", role: "Product Manager" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-60" 
        style={{ 
          backgroundImage: `url('/lovable-uploads/d64ad323-9208-4c30-9d2e-9e79cfca104f.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Dashboard</h1>
          <p className="text-gray-600">Monitor employee wellbeing and performance</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search employees..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <Link to={`/employee/${employee.id}`} key={employee.id}>
              <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer h-full bg-white/90">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">{employee.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-1">ID: {employee.id}</p>
                  <p className="text-sm text-gray-500 mb-1">Department: {employee.department}</p>
                  <p className="text-sm text-gray-500">Role: {employee.role}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No employees found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
