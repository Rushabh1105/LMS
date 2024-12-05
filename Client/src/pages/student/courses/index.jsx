import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { filterOptions, sortOptions } from '@/config'
import { Label } from '@/components/ui/label'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { StudentContext } from '@/context/studentContext'
import { checkStudentCourseEnrollmentService, fetchStudentViewCourseListService } from '@/services'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

function StudentViewCoursesPage() {
    const {studentViewCoursesList, setStudentViewCoursesList, loadingState, setLoadingState} = useContext(StudentContext);
    const [sort, setSort] = useState('price-lowtohigh');
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    function handleFilterOnChange(getSectionId, getCurrentOptions){
        let copyFilters = {...filters};
        const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId);
        // console.log(getSectionId+" "+indexOfCurrentSection);
        if(indexOfCurrentSection === -1){
            copyFilters = {
                ...filters,
                [getSectionId]: [getCurrentOptions.id]
            }
        }else{
            const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOptions.id);
            if(indexOfCurrentOption === -1){
                copyFilters[getSectionId].push(getCurrentOptions.id);
            }else{
                copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }
        }
        setFilters(copyFilters);
        sessionStorage.setItem('filters', JSON.stringify(copyFilters))
    }

    async function fetchAllStudentViewCourses(filters, sort) {
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort
        });
        const response = await fetchStudentViewCourseListService(query);
        // console.log(response);
        if(response?.success){
          setStudentViewCoursesList(response?.data)
          setLoadingState(false);
        }
    }

    async function handleCourseNavigate(currentCourseId) {
        const response = await checkStudentCourseEnrollmentService(currentCourseId);
        // console.log(response);
        if(response?.success){
            if(response?.data){
                navigate(`/student-courses/progress/${currentCourseId}`);
            }else{
                navigate(`/course/details/${currentCourseId}`);
            }
        }
    }

    function createSearchParamsHelper(filterParams){
        const queryParams = [];
        for(const [key, value] of Object.entries(filterParams)){
            if(Array.isArray(value) && value.length > 0){
                const paramValue = value.join(',');
                queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
            }
        }

        return queryParams.join('&');
    }

    useEffect(() => {
        const queryString = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(queryString));
    }, [filters]);
    
    useEffect(() => {
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
        
    }, [])


    useEffect(() => {
        if(filters !== null && sort !== null){
            fetchAllStudentViewCourses(filters, sort);
        }
        
    }, [filters, sort]);

    useEffect(() => {
        const handleUnload = () => {
            sessionStorage.removeItem("filters"); // Or any other cleanup logic
        };
        window.addEventListener('unload', handleUnload);
        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 px-4">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64 space-y-4">
                    <div className="space-y-4">
                        {
                            Object.keys(filterOptions).map((key, index) => (
                                <div className='p-4 space-y-4 border-b' key={index}>
                                    <h3 className='font-bold mb-3'>{key.toUpperCase()}</h3>
                                    <div className="grid gap-2 mt-2">
                                        {
                                            filterOptions[key].map((option) => (
                                                <Label className="flex font-medium items-center gap-3" key={option.id}>
                                                    <Checkbox 
                                                        checked={
                                                            filters && 
                                                            Object.keys(filters).length > 0 &&
                                                            filters[key] &&
                                                            filters[key].indexOf(option.id) > -1
                                                        }
                                                        onCheckedChange={() =>handleFilterOnChange(key, option)}
                                                    />
                                                    {option.label}
                                                </Label>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    
                </aside>
                <main className="flex-1">
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outlined" size="sm" className="flex items-center gap-2 p-5">
                                    <span className='text-[16px] font-medium'>Sort By</span>
                                    <ArrowUpDownIcon className='h-4 w-4'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                                    {
                                        sortOptions.map((options) => (
                                            <DropdownMenuRadioItem key={options.id} value={options.id}>
                                                {options.label}
                                            </DropdownMenuRadioItem>
                                        ))
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black font-bold">
                            {studentViewCoursesList?.length} Results
                        </span>
                    </div>
                    <div className="space-y-4">
                        {
                            studentViewCoursesList && studentViewCoursesList.length > 0 ?
                            studentViewCoursesList.map((courseItem) => (
                                <Card 
                                    onClick={() => handleCourseNavigate(courseItem?._id)} 
                                    key={courseItem._id} 
                                    className="cursor-pointer"
                                >
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="w-48 h-32 flex-shrink-0 ">
                                            <img    
                                                src={courseItem?.image}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl mb-2">{courseItem?.title}</CardTitle>
                                            <p className='text-sm text-grey-600 mb-1'>By :<span className='font-bold'>{courseItem?.instructorName}</span></p>
                                            <p className="text-[16px] text-grey-500 text-black mb-2 mt3">
                                                {
                                                    `${courseItem.curriculum?.length} ${courseItem?.curriculum.length <= 1 ? 'Lecture': 'Lectures'} - ${courseItem?.level.toUpperCase()} Level`
                                                }
                                            </p>
                                            <p className="font-bold text-lg">₹ {courseItem?.pricing}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                loadingState ? 
                                <Skeleton /> : 
                                <h1 className='font-extrabold text-4xl'>No Courses Found!!!</h1>
                            )
                            
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentViewCoursesPage