import CommomForm from '@/components/commonForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signInFormControls, signUpFormControls } from '@/config';
import { AuthContext } from '@/context/authContext';
import { TabsContent } from '@radix-ui/react-tabs';
import { GraduationCap } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

function AuthPage() {

    const [activeTab, setActiveTab] = useState('signin');
    const {signInFormData, setSignInFormData, signUpFormData, setSignUpFormData, handleRegisterUser, handleLoginUser} = useContext(AuthContext);

    function handleTabChange(value){
        setActiveTab(value);
    }

    function checkIfSignInFormIsValid(){
        return (signInFormData && 
                signInFormData.userEmail !== '' && 
                signInFormData.password !== '')
    }

    function checkIfSignUpFormIsValid(){
        return (signUpFormData && 
            signUpFormData.userEmail !== '' && 
            signUpFormData.password !== '' &&
            signUpFormData.userName !== ''
        )
    }

    // console.log(signInFormData);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link to={'/'} className="flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold text-xl" >
                        Mr-Professor
                    </span>
                </Link>
            </header>
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Tabs value={activeTab} defaultValue="signin" onValueChange={handleTabChange} className='w-full max-w-md'>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value='signin'>Sign In</TabsTrigger>
                        <TabsTrigger value='signup'>Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value='signin' className="mt-3">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Sign in to Your Account</CardTitle>
                            </CardHeader>
                            <CardDescription>
                                Enter Your Email and Password to Access Your Account
                            </CardDescription>
                            <CardContent className="scroll-py-2">
                                <CommomForm 
                                    formControls={signInFormControls} 
                                    buttonText={'Sign In'} 
                                    formData={signInFormData} 
                                    setFormData={setSignInFormData}
                                    isButtonDisabled={!checkIfSignInFormIsValid()}
                                    handleSubmit={handleLoginUser}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value='signup' className="mt-3">
                    <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Create New Account</CardTitle>
                            </CardHeader>
                            <CardDescription>
                                Enter Your Details to Create Your Account
                            </CardDescription>
                            <CardContent className="space-y-2">
                                <CommomForm 
                                    formControls={signUpFormControls} 
                                    buttonText={'Sign Up'} 
                                    formData={signUpFormData} 
                                    setFormData={setSignUpFormData} 
                                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                                    handleSubmit={handleRegisterUser}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AuthPage