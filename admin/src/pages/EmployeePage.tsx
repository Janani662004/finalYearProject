
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoodChart } from "@/components/MoodChart";

const EmployeePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching employee data
    const employeeData = {
      id: id,
      name: id === "emp001" ? "John Wesley" : 
            id === "emp002" ? "Sarah Johnson" : 
            id === "emp003" ? "Michael Chen" : 
            id === "emp004" ? "Emma Rodriguez" : 
            id === "emp005" ? "David Kim" : 
            id === "emp006" ? "Olivia Taylor" : 
            id === "emp007" ? "James Wilson" : 
            id === "emp008" ? "Sophia Martinez" : "Unknown Employee",
      department: id === "emp001" ? "Engineering" : 
                 id === "emp002" ? "Marketing" : 
                 id === "emp003" ? "Design" : 
                 id === "emp004" ? "HR" : 
                 id === "emp005" ? "Finance" : 
                 id === "emp006" ? "Engineering" : 
                 id === "emp007" ? "Customer Support" : 
                 id === "emp008" ? "Product" : "Unknown Department",
      role: id === "emp001" ? "Senior Developer" : 
            id === "emp002" ? "Brand Manager" : 
            id === "emp003" ? "UX Designer" : 
            id === "emp004" ? "Talent Acquisition" : 
            id === "emp005" ? "Financial Analyst" : 
            id === "emp006" ? "Software Engineer" : 
            id === "emp007" ? "Support Lead" : 
            id === "emp008" ? "Product Manager" : "Unknown Role",
      recommendedActivities: [
        id === "emp001" ? "15-min Morning Meditation" : "Team Building Exercise",
        id === "emp001" ? "Journaling before bed" : "Stress Management Workshop",
        id === "emp001" ? "Short walk post-lunch" : "Time Management Training",
        id === "emp001" ? "Music therapy" : "Communication Skills Workshop"
      ],
      personalitySummary: id === "emp001" 
        ? "Shows signs of introversion and conscientiousness. Prefers structured routines and excels at independent tasks."
        : "Demonstrates strong collaborative skills and attention to detail. Works well under pressure and adapts quickly to changing priorities."
    };

    setTimeout(() => {
      setEmployee(employeeData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading employee data...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40" 
        style={{ 
          backgroundImage: `url('/lovable-uploads/96dce0b0-23fd-43da-ada6-e6dc94fd1f8a.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4">
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-xl">{employee.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">ID: {employee.id}</p>
                  <p className="text-sm text-gray-500">Department: {employee.department}</p>
                  <p className="text-sm text-gray-500">Role: {employee.role}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-3/4 space-y-6">
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle>Mood Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <MoodChart />
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                  {["😢", "😟", "😐", "🙂", "😄"].map((emoji, index) => (
                    <span key={index} className="text-xl">{emoji}</span>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">Weekly Average Mood: 🙂</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90">
                <CardHeader className="bg-[#9b87f5]/10 rounded-t-lg">
                  <CardTitle>Recommended Activities</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="list-disc list-inside space-y-2">
                    {employee.recommendedActivities.map((activity: string, index: number) => (
                      <li key={index} className="text-gray-700">{activity}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/90">
                <CardHeader className="bg-[#9b87f5]/10 rounded-t-lg">
                  <CardTitle>Personality Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700">{employee.personalitySummary}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
