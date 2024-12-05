import InstructorCourses from '@/components/instructorView/courses'
import InstructorDashBoard from '@/components/instructorView/dashboard'
import { Button } from '@/components/ui/button'
import { AuthContext } from '@/context/authContext'
import { InstructorContext } from '@/context/instructorContext'
import { fetchInstructorCoursesService } from '@/services'
import { Tabs, TabsContent } from '@radix-ui/react-tabs'
import { BarChart, Book, LogOut } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'

function InstructorDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {resetCredentials} = useContext(AuthContext);
  const {instructorCoursesList, setInstructorCoursesList} = useContext(InstructorContext);

  function handleLogout(){
    resetCredentials();
    sessionStorage.removeItem('access-token');
  }

  const menuItems = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard',
      component: <InstructorDashBoard listOfCourses={instructorCoursesList}/>
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses',
      component: <InstructorCourses listOfCourses={instructorCoursesList}/>
    },
    {
      icon: LogOut,
      label: 'Logout',
      value: 'logout',
      component: null,
    }
  ]

  async function fetchAllCourses(){
    const response = await fetchInstructorCoursesService();
    // console.log(response?.data);
    if(response?.success){
      setInstructorCoursesList(response?.data);
    }
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  console.log(instructorCoursesList);
  

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Insructor View</h2>
          <nav>
            {
              menuItems.map((menuItem, idx) => (
                <Button 
                  className="w-full justify-start mb-2" 
                  key= {menuItem.value || idx}
                  variant={activeTab === menuItem.value ? 'secondary': 'ghost'}
                  onClick= {menuItem.value === 'logout'?
                    handleLogout:
                    () => setActiveTab(menuItem.value)
                  }
                >
                  <menuItem.icon className="mr-2 h-4 w-4" />
                  {menuItem.label}
                </Button>
              ))
            }
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-3xl font-bold mb-8">DashBoard</h1>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            {
              menuItems.map((menuItem, idx) => (
                <TabsContent value={menuItem.value} key={idx}>
                  {
                    menuItem.component !== null ? menuItem.component: null
                  }
                </TabsContent>
              ))
            }
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default InstructorDashboardPage