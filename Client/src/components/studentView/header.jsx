import { GraduationCap, TvMinimalPlay } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { AuthContext } from '@/context/authContext'

function StudentViewHeader() {
    const {resetCredentials} = useContext(AuthContext);
    const navigate = useNavigate();
    function handleLogout(){
        resetCredentials();
        sessionStorage.removeItem('access-token');
    }


    return (
        <header className="flex items-center justify-between p-4 border-b relative">
            <div className="flex items-center space-x-4">
                <Link to='/home' className='flex items-center hover:text-black'>
                    <GraduationCap className="h-8 w-8 mr-4"/>
                    <span className="font-extrabold md:text-xl text-[14px]">
                        Mr-Professor Learn
                    </span>
                </Link>
                <div className="flex items-center space-x-1">
                    <Button 
                        className="text-[14px] md:text-[16px] font-medium"
                        variant="ghost"
                        onClick={() =>{
                            location.pathname.includes('/courses') ?
                            null :
                            navigate('/courses');
                        }}
                    >
                        Expolore Courses
                    </Button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex gap-4 items-center">
                    <div className='flex items-center gap-3'>
                        <span 
                            className="font-extrabold md:text-xl text-[14px] cursor-pointer"
                            onClick={() => navigate('/student-courses')}
                        >   
                            My Courses
                        </span>
                        <TvMinimalPlay className='w-8 h-8 cursor-pointer' />
                    </div>
                    <Button onClick={handleLogout}>Sign-Out</Button>
                </div>
            </div>
        </header>
    )
}

export default StudentViewHeader